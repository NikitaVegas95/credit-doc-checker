import type { CheckResult } from '../model/types'

import { toCheckSummary } from './toCheckSummary'

const result: CheckResult = {
  check_id: 'check-1',
  checked_at: '2026-07-04T00:00:00.000Z',
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
  issues: [],
  program: 'federal',
  reason: 'Пакет документов соответствует требованиям выбранной программы.',
  status: 'approve',
  status_label: 'Можно заявлять в банк',
}

describe('toCheckSummary', () => {
  it('maps check result to history summary', () => {
    expect(toCheckSummary(result)).toEqual({
      check_id: 'check-1',
      checked_at: '2026-07-04T00:00:00.000Z',
      doc_count: 1,
      program: 'federal',
      status: 'approve',
      status_label: 'Можно заявлять в банк',
    })
  })
})
