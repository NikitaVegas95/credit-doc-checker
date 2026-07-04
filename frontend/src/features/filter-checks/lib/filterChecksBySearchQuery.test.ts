import type { CheckSummary } from '@/entities/check'

import { filterChecksBySearchQuery } from './filterChecksBySearchQuery'

const checks: CheckSummary[] = [
  {
    check_id: 'federal-approve-1',
    checked_at: '2026-07-03T12:00:00.000Z',
    doc_count: 4,
    program: 'federal',
    status: 'approve',
    status_label: 'Можно заявлять в банк',
  },
  {
    check_id: 'regional-reject-1',
    checked_at: '2026-07-03T13:00:00.000Z',
    doc_count: 2,
    program: 'regional',
    status: 'reject',
    status_label: 'Нельзя заявлять в банк',
  },
]

describe('filterChecksBySearchQuery', () => {
  it('returns all checks for empty query', () => {
    expect(filterChecksBySearchQuery(checks, '  ')).toEqual(checks)
  })

  it('filters checks by id', () => {
    expect(filterChecksBySearchQuery(checks, 'reject')).toEqual([checks[1]])
  })

  it('filters checks by localized program label', () => {
    expect(filterChecksBySearchQuery(checks, 'федеральная')).toEqual([checks[0]])
  })

  it('filters checks by status label', () => {
    expect(filterChecksBySearchQuery(checks, 'можно')).toEqual([checks[0]])
  })
})
