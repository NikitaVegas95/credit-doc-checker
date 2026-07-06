import { Button } from '@/shared/ui/button'

import styles from './ErrorBoundaryFallback.module.css'

type UiErrorFallbackProps = {
  reset: () => void
}

export function UiErrorFallback({ reset }: UiErrorFallbackProps) {
  return (
    <section className={styles.fallback} role="alert" aria-labelledby="ui-error-title">
      <h2 id="ui-error-title">Интерфейс временно недоступен</h2>
      <p>Произошла ошибка в отображении страницы. Попробуйте открыть экран заново.</p>
      <Button type="button" onClick={reset}>
        Попробовать снова
      </Button>
    </section>
  )
}
