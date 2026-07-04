import { confirmDeleteCheck } from './confirmDeleteCheck'

describe('confirmDeleteCheck', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('asks user to confirm check deletion', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    expect(confirmDeleteCheck('check-1')).toBe(true)
    expect(confirmSpy).toHaveBeenCalledWith('Удалить проверку check-1?')
  })
})
