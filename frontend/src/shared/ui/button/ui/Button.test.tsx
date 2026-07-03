import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from './Button'

describe('Button', () => {
  it('renders children and uses button type by default when passed explicitly', () => {
    render(<Button type="button">Запустить проверку</Button>)

    expect(screen.getByRole('button', { name: 'Запустить проверку' })).toBeInTheDocument()
  })

  it('calls onClick when enabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(
      <Button type="button" onClick={handleClick}>
        Запустить
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: 'Запустить' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(
      <Button type="button" disabled onClick={handleClick}>
        Запустить
      </Button>,
    )

    await user.click(screen.getByRole('button', { name: 'Запустить' }))

    expect(handleClick).not.toHaveBeenCalled()
  })
})
