import { formatFileSize } from './formatFileSize'

describe('formatFileSize', () => {
  it.each([
    [1, '1 КБ'],
    [1024, '1 КБ'],
    [1536, '2 КБ'],
  ])('formats %s bytes', (sizeBytes, expected) => {
    expect(formatFileSize(sizeBytes)).toBe(expected)
  })
})
