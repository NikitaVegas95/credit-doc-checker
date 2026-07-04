import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren, ReactElement } from 'react'
import { checksQueryKeys } from '@/entities/check'

import { CreateCheckForm } from './CreateCheckForm'

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

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper }),
  }
}

describe('CreateCheckForm', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders program select with available programs', () => {
    renderWithQueryProvider(<CreateCheckForm />)

    const select = screen.getByLabelText('Льготная программа')

    expect(within(select).getByRole('option', { name: 'Выберите программу' })).toBeDisabled()
    expect(within(select).getByRole('option', { name: 'Федеральная' })).toHaveValue('federal')
    expect(within(select).getByRole('option', { name: 'Областная' })).toHaveValue('regional')
  })

  it('renders multiple file input with accepted document formats', () => {
    renderWithQueryProvider(<CreateCheckForm />)

    const input = screen.getByLabelText('Перетащите файлы сюда или выберите на компьютере')

    expect(input).toHaveAttribute('type', 'file')
    expect(input).toHaveAttribute('multiple')
    expect(input).toHaveAttribute('accept', '.pdf,.doc,.docx,.jpg,.jpeg,.png')
  })

  it('highlights required fields after submit attempt', async () => {
    const user = userEvent.setup()

    renderWithQueryProvider(<CreateCheckForm />)

    const submitButton = screen.getByRole('button', { name: 'Запустить проверку' })

    expect(submitButton).toBeEnabled()

    await user.click(submitButton)

    expect(screen.getByText('Выберите льготную программу')).toBeInTheDocument()
    expect(screen.getByText('Добавьте хотя бы один документ для проверки.')).toBeInTheDocument()
  })

  it('shows selected files and upload readiness progress', async () => {
    const user = userEvent.setup()

    renderWithQueryProvider(<CreateCheckForm />)

    await user.selectOptions(screen.getByLabelText('Льготная программа'), 'federal')

    expect(screen.getByText('Состав пакета')).toBeInTheDocument()
    expect(screen.getByText('Договор')).toBeInTheDocument()
    expect(screen.getByText('Спецификация')).toBeInTheDocument()
    expect(screen.getAllByText('Обязательно')).toHaveLength(4)

    await user.upload(
      screen.getByLabelText('Перетащите файлы сюда или выберите на компьютере'),
      new File(['contract'], 'договор.pdf', { type: 'application/pdf' }),
    )

    expect(screen.getByText('Выбрано файлов: 1')).toBeInTheDocument()
    expect(screen.getByText('договор.pdf')).toBeInTheDocument()
    expect(screen.getByText('Файлы готовы к загрузке')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('shows file validation errors and blocks submit', async () => {
    const user = userEvent.setup()

    renderWithQueryProvider(<CreateCheckForm />)

    await user.selectOptions(screen.getByLabelText('Льготная программа'), 'federal')
    fireEvent.change(screen.getByLabelText('Перетащите файлы сюда или выберите на компьютере'), {
      target: {
        files: [new File(['text'], 'notes.txt', { type: 'text/plain' })],
      },
    })

    expect(screen.getByText(/Недопустимый формат/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Запустить проверку' })).toBeEnabled()
  })

  it('removes selected file from list', async () => {
    const user = userEvent.setup()

    renderWithQueryProvider(<CreateCheckForm />)

    await user.selectOptions(screen.getByLabelText('Льготная программа'), 'federal')
    await user.upload(
      screen.getByLabelText('Перетащите файлы сюда или выберите на компьютере'),
      new File(['contract'], 'договор.pdf', { type: 'application/pdf' }),
    )

    expect(screen.getByText('договор.pdf')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Удалить' }))

    expect(screen.queryByText('договор.pdf')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Запустить проверку' })).toBeEnabled()
  })

  it('stores created check in query cache after successful submit', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    const { queryClient } = renderWithQueryProvider(<CreateCheckForm onSuccess={onSuccess} />)

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          check_id: 'created-1',
          program: 'federal',
          status: 'approve',
          status_label: 'Можно заявлять в банк',
          reason: 'Пакет документов соответствует требованиям выбранной программы.',
          issues: [],
          documents: [
            {
              name: 'договор.pdf',
              detected_type: 'contract',
              size_kb: 1,
            },
          ],
          extracted: {
            contractor: 'ООО «ТехАгро»',
            inn: '7701234567',
            amount: '450 000 ₽',
            date: '15.03.2025',
            subject: 'Поставка минеральных удобрений',
          },
          checked_at: '2026-07-04T00:00:00.000Z',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 201,
        },
      ),
    )

    await user.selectOptions(screen.getByLabelText('Льготная программа'), 'federal')
    await user.upload(
      screen.getByLabelText('Перетащите файлы сюда или выберите на компьютере'),
      new File(['contract'], 'договор.pdf', { type: 'application/pdf' }),
    )
    await user.click(screen.getByRole('button', { name: 'Запустить проверку' }))

    expect(await screen.findByRole('button', { name: 'Запустить проверку' })).toBeEnabled()
    expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({ check_id: 'created-1' }))
    expect(queryClient.getQueryData(checksQueryKeys.all)).toEqual([
      expect.objectContaining({
        check_id: 'created-1',
        doc_count: 1,
      }),
    ])
  })
})
