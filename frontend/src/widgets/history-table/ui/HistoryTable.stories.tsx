import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
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
    check_id: 'manual-1',
    checked_at: '2026-07-03T13:00:00.000Z',
    doc_count: 5,
    program: 'regional',
    status: 'manual',
    status_label: 'Требуется ручная проверка',
  },
  {
    check_id: 'reject-1',
    checked_at: '2026-07-03T14:00:00.000Z',
    doc_count: 2,
    program: 'regional',
    status: 'reject',
    status_label: 'Нельзя заявлять в банк',
  },
]

function withChecksHistory(initialChecks: CheckSummary[]) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  })

  queryClient.setQueryData(CHECKS_HISTORY_QUERY_KEY, initialChecks)

  return function ChecksHistoryDecorator({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
}

const meta = {
  title: 'widgets/HistoryTable',
  component: HistoryTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Виджет истории проверок. Загружает данные из `GET /api/checks` через TanStack Query, показывает сводку по статусам, поиск, фильтр по статусу, loading/error/empty/success состояния и ручное обновление.',
      },
    },
  },
} satisfies Meta<typeof HistoryTable>

export default meta

type Story = StoryObj<typeof meta>

export const WithRows: Story = {
  render: () => {
    const Wrapper = withChecksHistory(checks)

    return (
      <Wrapper>
        <HistoryTable />
      </Wrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          'История с несколькими проверками. Пользователь может искать запись, фильтровать по статусу, открыть детали или удалить проверку.',
      },
    },
  },
}

export const Empty: Story = {
  render: () => {
    const Wrapper = withChecksHistory([])

    return (
      <Wrapper>
        <HistoryTable />
      </Wrapper>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Пустое состояние истории, когда API вернул пустой список проверок.',
      },
    },
  },
}
