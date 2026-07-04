import { Link, useParams } from 'react-router-dom'
import { CheckResultPanel } from '@/widgets/upload-panel'
import { APP_ROUTE_PATHS } from '@/shared/config/routes'
import { Button } from '@/shared/ui/button'
import { useCheckDetails } from '../api/useCheckDetails'

import styles from './CheckDetailsPage.module.css'

export function CheckDetailsPage() {
  const { checkId } = useParams()
  const checkDetailsQuery = useCheckDetails(checkId ?? '')

  return (
    <section className={styles.section} aria-labelledby="check-details-title">
      <div className={styles.header}>
        <div className={styles.heading}>
          <h2 id="check-details-title">Детали проверки</h2>
          <p>{checkId ? `ID: ${checkId}` : 'ID проверки не найден в маршруте.'}</p>
        </div>
        <Link className={styles.backLink} to={APP_ROUTE_PATHS.history}>
          К истории
        </Link>
      </div>

      {!checkId ? (
        <div className={styles.error}>
          <p>Не удалось определить ID проверки.</p>
        </div>
      ) : null}

      {checkId && checkDetailsQuery.isLoading ? (
        <p className={styles.state}>Загружаем детали проверки...</p>
      ) : null}

      {checkId && checkDetailsQuery.isError ? (
        <div className={styles.error}>
          <p>Не удалось загрузить детали проверки.</p>
          <Button type="button" onClick={() => void checkDetailsQuery.refetch()}>
            Повторить
          </Button>
        </div>
      ) : null}

      {checkDetailsQuery.data ? <CheckResultPanel result={checkDetailsQuery.data} /> : null}
    </section>
  )
}
