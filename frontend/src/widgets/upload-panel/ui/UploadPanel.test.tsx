import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren, ReactElement } from 'react'
import userEvent from '@testing-library/user-event'
import type { CheckResult } from '@/entities/check'
import { useCreateCheckFormStore } from '@/features/create-check/model/createCheckFormStore'
import { clearPersistedCreateCheckFormState } from '@/features/create-check/lib/createCheckFormPersistence'

import { UploadPanel } from './UploadPanel'

function renderWithQueryProvider(ui: ReactElement) {
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

describe('UploadPanel', () => {
  beforeEach(async () => {
    useCreateCheckFormStore.getState().reset()
    await clearPersistedCreateCheckFormState()
  })

  it('renders upload scenario heading and form controls', () => {
    renderWithQueryProvider(<UploadPanel />)

    expect(screen.getByRole('heading', { name: 'Новая проверка' })).toBeInTheDocument()
    expect(screen.getByText('Загрузите документы и выберите льготную программу.')).toBeInTheDocument()
    expect(screen.getByLabelText('Льготная программа')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Запустить проверку' })).toBeInTheDocument()
  })

  it('resets the form after starting a new check', async () => {
    const user = userEvent.setup()
    const result: CheckResult = {
      check_id: 'check-1',
      checked_at: '2026-07-03T00:00:00.000Z',
      documents: [],
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
    } as const

    useCreateCheckFormStore.getState().setProgram('federal')
    useCreateCheckFormStore.getState().setResult(result)

    renderWithQueryProvider(<UploadPanel />)

    expect(screen.getByRole('status')).toHaveTextContent('Черновик сохранен в браузере.')
    expect(screen.getByRole('button', { name: 'Новая проверка' })).toBeInTheDocument()
    expect(screen.getByLabelText('Льготная программа')).toHaveValue('federal')
    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'Результат проверки' })).toHaveFocus()
    })

    await user.click(screen.getByRole('button', { name: 'Новая проверка' }))

    expect(screen.queryByRole('heading', { name: 'Результат проверки' })).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByLabelText('Льготная программа')).toHaveValue('')
    })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
