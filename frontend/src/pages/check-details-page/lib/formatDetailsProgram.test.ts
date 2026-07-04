import { formatDetailsProgram } from './formatDetailsProgram'

describe('formatDetailsProgram', () => {
  it.each([
    ['federal', 'Федеральная'],
    ['regional', 'Областная'],
  ] as const)('formats %s program', (program, label) => {
    expect(formatDetailsProgram(program)).toBe(label)
  })
})
