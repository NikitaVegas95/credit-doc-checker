import { formatProgram } from './formatProgram'

describe('formatProgram', () => {
  it('formats federal program', () => {
    expect(formatProgram('federal')).toBe('Федеральная')
  })

  it('formats regional program', () => {
    expect(formatProgram('regional')).toBe('Областная')
  })
})
