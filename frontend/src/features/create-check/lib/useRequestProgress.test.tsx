import { renderHook, act } from '@testing-library/react'

import { useRequestProgress } from './useRequestProgress'

describe('useRequestProgress', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('increments progress while request is active and resets after completion', () => {
    const { result, rerender } = renderHook(({ isActive }) => useRequestProgress(isActive), {
      initialProps: { isActive: true },
    })

    expect(result.current).toBe(8)

    act(() => {
      vi.advanceTimersByTime(250)
    })

    expect(result.current).toBeGreaterThan(8)

    rerender({ isActive: false })

    expect(result.current).toBe(0)
  })
})
