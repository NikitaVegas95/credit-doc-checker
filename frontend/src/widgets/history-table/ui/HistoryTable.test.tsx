import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PropsWithChildren, ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import type { CheckSummary } from '@/entities/check'
import { CHECKS_HISTORY_QUERY_KEY } from '../api/useChecksHistory'

import { HistoryTable } from './HistoryTable'

const checks: CheckSummary[] = [
  {
    check_id: 'approve-1',
    checked_at: '2026-07-03T12:00:00.000Z',
    doc_count: 4,
    program: 'federal',
    status: 'approve',
    status_label: 'Можно заявлять в банк',
  },
  {
    check_id: 'reject-1',
    checked_at: '2026-07-03T13:00:00.000Z',
    doc_count: 2,
    program: 'regional',
    status: 'reject',
    status_label: 'Нельзя заявлять в банк',
  },
]

function renderWithQueryProvider(ui: ReactElement, initialChecks?: CheckSummary[]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  })

  if (initialChecks) {
    queryClient.setQueryData(CHECKS_HISTORY_QUERY_KEY, initialChecks)
  }

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper })
}

describe('HistoryTable', () => {
  it('renders empty history state', async () => {
    renderWithQueryProvider(<HistoryTable />, [])

    expect(await screen.findByText('Пока нет данных')).toBeInTheDocument()
    expect(screen.getByText('Выполненные проверки появятся здесь после загрузки документов.')).toBeInTheDocument()
  })

  it('renders checks loaded from query cache', async () => {
    renderWithQueryProvider(<HistoryTable />, checks)

    expect(await screen.findByText('approve-1')).toBeInTheDocument()
    expect(screen.getByText('reject-1')).toBeInTheDocument()
    expect(screen.getByText('Федеральная')).toBeInTheDocument()
    expect(screen.getByText('Областная')).toBeInTheDocument()
  })

  it('filters checks by selected status', async () => {
    const user = userEvent.setup()

    renderWithQueryProvider(<HistoryTable />, checks)

    await screen.findByText('approve-1')
    await user.click(screen.getByRole('button', { name: 'Нельзя заявлять' }))

    expect(screen.queryByText('approve-1')).not.toBeInTheDocument()
    expect(screen.getByText('reject-1')).toBeInTheDocument()
  })
})
