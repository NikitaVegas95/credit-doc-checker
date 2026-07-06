import { isApiRequestError } from '@/shared/lib/errors'
import { Button } from '@/shared/ui/button'

import styles from './ErrorBoundaryFallback.module.css'

type ApiErrorFallbackProps = {
  error: Error
  reset: () => void
}

export function ApiErrorFallback({ error, reset }: ApiErrorFallbackProps) {
  if (!isApiRequestError(error)) {
    throw error
  }

  return (
    <section className={styles.fallback} role="alert" aria-labelledby="api-error-title">
      <h2 id="api-error-title">Не удалось получить данные</h2>
      <p>{error.message}</p>
      <Button type="button" onClick={reset}>
        Повторить запрос
      </Button>
    </section>
  )
}
