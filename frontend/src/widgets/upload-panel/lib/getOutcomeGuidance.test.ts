import { getOutcomeGuidance } from './getOutcomeGuidance'

describe('getOutcomeGuidance', () => {
  it('returns guidance for approve status', () => {
    expect(getOutcomeGuidance('approve')).toBe('Пакет готов: можно переходить к заявке в банк.')
  })
})
