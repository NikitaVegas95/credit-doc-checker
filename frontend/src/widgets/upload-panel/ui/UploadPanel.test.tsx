import { render, screen } from '@testing-library/react'

import { UploadPanel } from './UploadPanel'

describe('UploadPanel', () => {
  it('renders upload scenario heading and form controls', () => {
    render(<UploadPanel />)

    expect(screen.getByRole('heading', { name: 'Новая проверка' })).toBeInTheDocument()
    expect(screen.getByText('Загрузите документы и выберите льготную программу.')).toBeInTheDocument()
    expect(screen.getByLabelText('Льготная программа')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Запустить проверку' })).toBeInTheDocument()
  })
})
