import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppHeader } from './AppHeader'

describe('AppHeader', () => {
  it('renders title and navigation links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppHeader />
      </MemoryRouter>,
    )

    expect(screen.getByText('AI-агент')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Проверка льготных кредитов' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Проверка' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'История' })).toHaveAttribute('href', '/history')
  })

  it('marks history link as active on history route', () => {
    render(
      <MemoryRouter initialEntries={['/history']}>
        <AppHeader />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'История' })).toHaveAttribute('aria-current', 'page')
  })
})
