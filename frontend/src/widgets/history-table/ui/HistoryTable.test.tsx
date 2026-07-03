import { render, screen } from '@testing-library/react'

import { HistoryTable } from './HistoryTable'

describe('HistoryTable', () => {
  it('renders empty history state', () => {
    render(<HistoryTable />)

    expect(screen.getByRole('heading', { name: 'История' })).toBeInTheDocument()
    expect(screen.getByText('Пока нет данных')).toBeInTheDocument()
    expect(
      screen.getByText('История будет загружаться из mock API после реализации сценария проверки.'),
    ).toBeInTheDocument()
  })
})
