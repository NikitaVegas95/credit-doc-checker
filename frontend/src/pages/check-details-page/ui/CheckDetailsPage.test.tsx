import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { PropsWithChildren, ReactElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { CheckResult } from '@/entities/check'
import { getCheckDetailsQueryKey } from '../api/useCheckDetails'

import { CheckDetailsPage } from './CheckDetailsPage'

const result: CheckResult = {
  check_id: 'details-1',
  checked_at: '2026-07-03T00:00:00.000Z',
  documents: [
    {
      detected_type: 'contract',
      name: 'договор.pdf',
      size_kb: 1,
    },
  ],
  extracted: {
    amount: '450 000 ₽',
    contractor: 'ООО «ТехАгро»',
    date: '15.03.2025',
    inn: '7701234567',
    subject: 'Поставка минеральных удобрений',
  },
  issues: [],
  program: 'federal',
  reason: 'Пакет документов соответствует требованиям выбранной программы.',
  status: 'approve',
  status_label: 'Можно заявлять в банк',
}

function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  })

  queryClient.setQueryData(getCheckDetailsQueryKey(result.check_id), result)

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/history/${result.check_id}`]}>
        <Routes>
          <Route path="/history/:checkId" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper })
}

describe('CheckDetailsPage', () => {
  it('renders check result loaded by route id', () => {
    renderWithProviders(<CheckDetailsPage />)

    expect(screen.getByRole('heading', { name: 'Детали проверки' })).toBeInTheDocument()
    expect(screen.getByText('ID: details-1')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Сводка проверки' })).toBeInTheDocument()
    expect(screen.getByText('Федеральная')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Результат проверки' })).toBeInTheDocument()
    expect(screen.getAllByText('Можно заявлять в банк')).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'К истории' })).toHaveAttribute('href', '/history')
  })
})
