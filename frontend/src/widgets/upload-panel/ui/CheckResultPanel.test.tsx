import { render, screen } from '@testing-library/react'

import type { CheckResult } from '@/entities/check'

import { CheckResultPanel } from './CheckResultPanel'

const result: CheckResult = {
  check_id: 'check-1',
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

describe('CheckResultPanel', () => {
  it('renders status, issues, documents and extracted fields', () => {
    render(<CheckResultPanel result={result} />)

    expect(screen.getByRole('heading', { name: 'Результат проверки' })).toBeInTheDocument()
    expect(screen.getByText('Требуется ручная проверка')).toBeInTheDocument()
    expect(screen.getByText(/Предупреждение:/)).toBeInTheDocument()
    expect(screen.getByText(/договор.pdf - договор, 1 КБ/)).toBeInTheDocument()
    expect(screen.getByText('ООО «ТехАгро»')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Скачать отчёт' })).toBeInTheDocument()
  })
})
