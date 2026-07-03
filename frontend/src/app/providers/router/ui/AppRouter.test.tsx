import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppRouter } from './AppRouter'

describe('AppRouter', () => {
  it('renders check page on root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Новая проверка' })).toBeInTheDocument()
  })

  it('renders history page on history route', () => {
    render(
      <MemoryRouter initialEntries={['/history']}>
        <AppRouter />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'История' })).toBeInTheDocument()
  })

  it('redirects unknown routes to check page', async () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <AppRouter />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Новая проверка' })).toBeInTheDocument()
    })
  })
})
