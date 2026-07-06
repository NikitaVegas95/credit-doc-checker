import type { PropsWithChildren } from 'react'
import { ErrorBoundary } from '@/shared/ui/error-boundary'

import { UiErrorFallback } from './UiErrorFallback'

export function UiErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary fallback={({ reset }) => <UiErrorFallback reset={reset} />}>
      {children}
    </ErrorBoundary>
  )
}
