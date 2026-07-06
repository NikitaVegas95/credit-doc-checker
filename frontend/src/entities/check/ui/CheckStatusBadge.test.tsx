import { render, screen } from '@testing-library/react'

import { CheckStatusBadge } from './CheckStatusBadge'

describe('CheckStatusBadge', () => {
  it.each([
    ['processing', 'Проверка выполняется'],
    ['approve', 'Можно заявлять в банк'],
    ['reject', 'Нельзя заявлять в банк'],
    ['manual', 'Требуется ручная проверка'],
  ] as const)('renders %s status label', (status, label) => {
    render(<CheckStatusBadge status={status} label={label} />)

    expect(screen.getByText(label)).toBeInTheDocument()
  })
})
