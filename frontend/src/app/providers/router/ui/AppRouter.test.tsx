import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren, ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'

import { AppRouter } from './AppRouter'

function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  })

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper })
}

describe('AppRouter', () => {
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
})
