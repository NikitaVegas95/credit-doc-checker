import { render, screen } from '@testing-library/react'
import type { CheckResult } from '@/entities/check'

import { CheckDetailsSummary } from './CheckDetailsSummary'

const result: CheckResult = {
  check_id: 'details-1',
  checked_at: '2026-07-03T00:00:00.000Z',
  documents: [
    {
      detected_type: 'contract',
      name: 'договор.pdf',
      size_kb: 1,
    },
  ],
  extracted: {
    amount: '450 000 ₽',
    contractor: 'ООО «ТехАгро»',
    date: '15.03.2025',
    inn: '7701234567',
    subject: 'Поставка минеральных удобрений',
  },
  issues: [
    {
      level: 'warning',
      message: 'Не удалось определить тип документа: scan.jpg',
    },
  ],
  program: 'federal',
  reason: 'Пакет документов требует дополнительной проверки специалиста.',
  status: 'manual',
  status_label: 'Требуется ручная проверка',
}

describe('CheckDetailsSummary', () => {
  it('renders key check metadata and actions', () => {
    render(<CheckDetailsSummary result={result} />)

    expect(screen.getByRole('heading', { name: 'Сводка проверки' })).toBeInTheDocument()
    expect(screen.getByText('details-1')).toBeInTheDocument()
    expect(screen.getByText('Федеральная')).toBeInTheDocument()
    expect(screen.getByText('Требуется ручная проверка')).toBeInTheDocument()
    expect(screen.getByText('Документы')).toBeInTheDocument()
    expect(screen.getByText('Предупреждения')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Скачать отчёт' })).toBeInTheDocument()
  })
})
