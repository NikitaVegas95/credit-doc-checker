import type { CheckSummary } from '@/entities/check'

import { filterChecksByStatus } from './filterChecksByStatus'

const checks: CheckSummary[] = [
  {
    check_id: 'approve-1',
    checked_at: '2026-07-03T12:00:00.000Z',
    doc_count: 4,
    program: 'federal',
    status: 'approve',
    status_label: 'Можно заявлять в банк',
  },
  {
    check_id: 'manual-1',
    checked_at: '2026-07-03T13:00:00.000Z',
    doc_count: 5,
    program: 'regional',
    status: 'manual',
    status_label: 'Требуется ручная проверка',
  },
]

describe('filterChecksByStatus', () => {
  it('returns all checks for all filter', () => {
    expect(filterChecksByStatus(checks, 'all')).toEqual(checks)
  })

  it('returns checks matching selected status', () => {
    expect(filterChecksByStatus(checks, 'manual')).toEqual([checks[1]])
  })
})
