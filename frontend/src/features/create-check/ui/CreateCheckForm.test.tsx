import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren, ReactElement } from 'react'

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

  return render(ui, { wrapper: Wrapper })
}

describe('CreateCheckForm', () => {
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

  it('enables submit when program and files are selected', async () => {
    const user = userEvent.setup()

    renderWithQueryProvider(<CreateCheckForm />)

    const submitButton = screen.getByRole('button', { name: 'Запустить проверку' })

    expect(submitButton).toBeDisabled()

    await user.selectOptions(screen.getByLabelText('Льготная программа'), 'federal')
    await user.upload(
      screen.getByLabelText('Перетащите файлы сюда или выберите на компьютере'),
      new File(['contract'], 'договор.pdf', { type: 'application/pdf' }),
    )

    expect(screen.getByText('Выбрано файлов: 1')).toBeInTheDocument()
    expect(screen.getByText('договор.pdf')).toBeInTheDocument()
    expect(submitButton).toBeEnabled()
  })
})
