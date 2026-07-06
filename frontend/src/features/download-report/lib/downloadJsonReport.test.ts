import { downloadJsonReport } from './downloadJsonReport'

describe('downloadJsonReport', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('clicks a temporary link and revokes object URL asynchronously', () => {
    const url = 'blob:report'
    const click = vi.fn()
    const link = document.createElement('a')

    vi.spyOn(document, 'createElement').mockReturnValue(link)
    vi.spyOn(link, 'click').mockImplementation(click)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue(url)
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)

    downloadJsonReport('report.json', { ok: true })

    expect(link.download).toBe('report.json')
    expect(link.href).toBe(url)
    expect(click).toHaveBeenCalledTimes(1)
    expect(document.body.contains(link)).toBe(false)
    expect(revokeObjectURL).not.toHaveBeenCalled()

    vi.runOnlyPendingTimers()

    expect(revokeObjectURL).toHaveBeenCalledWith(url)
  })
})
