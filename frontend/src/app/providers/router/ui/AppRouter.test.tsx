import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren, ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ApiRequestError } from '@/shared/lib/errors'

import { AppRouter } from './AppRouter'

function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: {
        retry: false,
        throwOnError: true,
      },
    },
  })

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper })
}

describe('AppRouter', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders check page on root route', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Новая проверка' })).toBeInTheDocument()
  })

  it('renders history page on history route', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/history']}>
        <AppRouter />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'История' })).toBeInTheDocument()
  })

  it('renders check details page on history details route', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/history/check-1']}>
        <AppRouter />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Детали проверки' })).toBeInTheDocument()
  })

  it('redirects unknown routes to check page', async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/unknown']}>
        <AppRouter />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Новая проверка' })).toBeInTheDocument()
    })
  })

  it('keeps app navigation visible when a route API request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ detail: 'История недоступна' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 503,
      }),
    )

    renderWithProviders(
      <MemoryRouter initialEntries={['/history']}>
        <AppRouter />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Не удалось получить данные' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Проверка льготных кредитов' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Проверка' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'История' })).toBeInTheDocument()
  })

  it('keeps app navigation visible when a route query rejects before response', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new ApiRequestError('История недоступна'))

    renderWithProviders(
      <MemoryRouter initialEntries={['/history']}>
        <AppRouter />
      </MemoryRouter>,
    )

    expect(await screen.findByRole('heading', { name: 'Не удалось получить данные' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Проверка льготных кредитов' })).toBeInTheDocument()
  })
})
