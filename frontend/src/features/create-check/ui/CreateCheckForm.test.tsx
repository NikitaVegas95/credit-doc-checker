import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import type { PropsWithChildren, ReactElement } from 'react'
import { checksQueryKeys } from '@/entities/check'
import { useCreateCheckFormStore } from '../model/createCheckFormStore'

import { CreateCheckForm } from './CreateCheckForm'

vi.mock('axios', () => ({
  default: {
    isAxiosError: vi.fn(() => false),
    post: vi.fn(),
  },
}))

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
  beforeEach(() => {
    useCreateCheckFormStore.getState().reset()
  })

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
    expect(screen.getByLabelText('Льготная программа')).toHaveAccessibleDescription('Выберите льготную программу')
    expect(
      screen.getByLabelText('Перетащите файлы сюда или выберите на компьютере'),
    ).toHaveAccessibleDescription('Добавьте хотя бы один документ для проверки.')
  })

  it('focuses the first missing field after submit attempt', async () => {
    const user = userEvent.setup()

    renderWithQueryProvider(<CreateCheckForm />)

    await user.click(screen.getByRole('button', { name: 'Запустить проверку' }))

    await waitFor(() => {
      expect(screen.getByLabelText('Льготная программа')).toHaveFocus()
    })
  })

  it('shows selected files and uploaded file status', async () => {
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
    expect(screen.getByText('Файл загружен')).toBeInTheDocument()
    expect(screen.getByText('Все окей, документы добавлены и готовы к проверке.')).toBeInTheDocument()
    expect(screen.getByText('Документы добавлены и готовы к проверке.')).toBeInTheDocument()
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
    expect(screen.getByRole('button', { name: 'Запустить проверку' })).toBeDisabled()
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

    vi.mocked(axios.post).mockImplementation(async (_url, _body, config) => {
      config?.onUploadProgress?.({ loaded: 1, total: 1, progress: 1, bytes: 1 } as never)

      return {
        data: {
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
        },
      } as never
    })

    await user.selectOptions(screen.getByLabelText('Льготная программа'), 'federal')
    await user.upload(
      screen.getByLabelText('Перетащите файлы сюда или выберите на компьютере'),
      new File(['contract'], 'договор.pdf', { type: 'application/pdf' }),
    )
    await user.click(screen.getByRole('button', { name: 'Запустить проверку' }))

    expect(await screen.findByRole('button', { name: 'Запустить проверку' })).toBeEnabled()
    expect(screen.queryByText('Идет проверка документов')).not.toBeInTheDocument()
    expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({ check_id: 'created-1' }))
    expect(queryClient.getQueryData(checksQueryKeys.all)).toEqual([
      expect.objectContaining({
        check_id: 'created-1',
        doc_count: 1,
      }),
    ])
  })
})
