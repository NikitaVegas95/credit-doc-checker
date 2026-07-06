import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { ApiRequestError } from '@/shared/lib/errors'

import { ApiErrorBoundary } from './ApiErrorBoundary'
import { UiErrorBoundary } from './UiErrorBoundary'

function ThrowError({ error }: { error: Error }) {
  throw error
  return null
}

function renderWithQueryClient(children: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return render(children, { wrapper: Wrapper })
}

describe('error boundaries', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders API fallback for API request errors', () => {
    renderWithQueryClient(
      <ApiErrorBoundary>
        <ThrowError error={new ApiRequestError('История недоступна', 503)} />
      </ApiErrorBoundary>,
    )

    expect(screen.getByRole('heading', { name: 'Не удалось получить данные' })).toBeInTheDocument()
    expect(screen.getByText('История недоступна')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Повторить запрос' })).toBeInTheDocument()
  })

  it('passes non-API errors to UI fallback', () => {
    renderWithQueryClient(
      <UiErrorBoundary>
        <ApiErrorBoundary>
          <ThrowError error={new Error('Render failed')} />
        </ApiErrorBoundary>
      </UiErrorBoundary>,
    )

    expect(screen.getByRole('heading', { name: 'Интерфейс временно недоступен' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Попробовать снова' })).toBeInTheDocument()
  })
})
