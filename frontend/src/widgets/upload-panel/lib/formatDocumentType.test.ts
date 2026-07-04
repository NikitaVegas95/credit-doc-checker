import { formatDocumentType } from './formatDocumentType'

describe('formatDocumentType', () => {
  it('returns known document type label', () => {
    expect(formatDocumentType('contract')).toBe('договор')
  })

  it('returns original value for unknown document type code', () => {
    expect(formatDocumentType('custom')).toBe('custom')
  })
})
