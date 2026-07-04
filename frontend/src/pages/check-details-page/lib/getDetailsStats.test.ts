import type { CheckResult } from '@/entities/check'

import { getDetailsStats } from './getDetailsStats'

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
      level: 'error',
      message: 'Отсутствует обязательный документ: акт',
    },
    {
      level: 'warning',
      message: 'Не удалось определить тип документа: scan.jpg',
    },
  ],
  program: 'federal',
  reason: 'Пакет документов требует исправлений.',
  status: 'reject',
  status_label: 'Нельзя заявлять в банк',
}

describe('getDetailsStats', () => {
  it('counts documents, errors and warnings', () => {
    expect(getDetailsStats(result)).toEqual({
      documents: 1,
      errors: 1,
      warnings: 1,
    })
  })
})
