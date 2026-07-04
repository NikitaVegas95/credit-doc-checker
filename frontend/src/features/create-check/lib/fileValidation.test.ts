import { getFileExtension, validateFiles } from './fileValidation'

describe('fileValidation', () => {
  it('returns normalized file extension', () => {
    expect(getFileExtension('Договор.PDF')).toBe('.pdf')
  })

  it('returns issue for unsupported extension', () => {
    const issues = validateFiles([new File(['text'], 'notes.txt', { type: 'text/plain' })])

    expect(issues).toEqual([
      expect.objectContaining({
        fileName: 'notes.txt',
        message: expect.stringContaining('Недопустимый формат'),
      }),
    ])
  })

  it('returns issue for duplicated names', () => {
    const issues = validateFiles([
      new File(['one'], 'dogovor.pdf', { type: 'application/pdf' }),
      new File(['two'], 'DOGOVOR.pdf', { type: 'application/pdf' }),
    ])

    expect(issues).toContainEqual({
      fileName: 'DOGOVOR.pdf',
      message: 'Файл с таким именем уже выбран',
    })
  })
})
