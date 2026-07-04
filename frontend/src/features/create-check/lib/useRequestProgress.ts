import { useEffect, useState } from 'react'

export function useRequestProgress(isActive: boolean) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isActive) {
      return
    }

    const startTimeoutId = window.setTimeout(() => setProgress(8), 0)
    const intervalId = window.setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 92) {
          return currentProgress
        }

        return currentProgress + (currentProgress < 50 ? 7 : 3)
      })
    }, 250)

    return () => {
      window.clearTimeout(startTimeoutId)
      window.clearInterval(intervalId)
    }
  }, [isActive])

  if (!isActive) {
    return 0
  }

  return Math.max(8, progress)
}
