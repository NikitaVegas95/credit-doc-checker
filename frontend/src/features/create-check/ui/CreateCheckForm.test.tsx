import { render, screen, within } from '@testing-library/react'

import { CreateCheckForm } from './CreateCheckForm'

describe('CreateCheckForm', () => {
  it('renders program select with available programs', () => {
    render(<CreateCheckForm />)

    const select = screen.getByLabelText('Льготная программа')

    expect(within(select).getByRole('option', { name: 'Выберите программу' })).toBeDisabled()
    expect(within(select).getByRole('option', { name: 'Федеральная' })).toHaveValue('federal')
    expect(within(select).getByRole('option', { name: 'Областная' })).toHaveValue('regional')
  })

  it('renders multiple file input with accepted document formats', () => {
    render(<CreateCheckForm />)

    const input = screen.getByLabelText('Перетащите файлы сюда или выберите на компьютере')

    expect(input).toHaveAttribute('type', 'file')
    expect(input).toHaveAttribute('multiple')
    expect(input).toHaveAttribute('accept', '.pdf,.doc,.docx,.jpg,.jpeg,.png')
  })

  it('keeps submit button disabled until submit scenario is implemented', () => {
    render(<CreateCheckForm />)

    expect(screen.getByRole('button', { name: 'Запустить проверку' })).toBeDisabled()
  })
})
