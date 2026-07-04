import { formatIssueLevel } from './formatIssueLevel'

describe('formatIssueLevel', () => {
  it('formats error level', () => {
    expect(formatIssueLevel('error')).toBe('Ошибка')
  })

  it('formats warning level', () => {
    expect(formatIssueLevel('warning')).toBe('Предупреждение')
  })
})
