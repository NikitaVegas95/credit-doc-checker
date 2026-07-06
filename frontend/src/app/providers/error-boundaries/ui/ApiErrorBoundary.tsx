import { QueryErrorResetBoundary } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { ErrorBoundary } from '@/shared/ui/error-boundary'

import { ApiErrorFallback } from './ApiErrorFallback'

export function ApiErrorBoundary({ children }: PropsWithChildren) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallback={({ error, reset: resetBoundary }) => (
            <ApiErrorFallback
              error={error}
              reset={() => {
                reset()
                resetBoundary()
              }}
            />
          )}
          onReset={reset}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
