import { formatCheckedAt } from './formatCheckedAt'

describe('formatCheckedAt', () => {
  it('formats ISO date for ru-RU locale', () => {
    expect(formatCheckedAt('2026-07-03T12:00:00.000Z')).toMatch(/03\.07\.2026/)
  })
})
