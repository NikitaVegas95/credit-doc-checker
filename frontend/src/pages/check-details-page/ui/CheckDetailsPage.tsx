import { Link, useParams } from 'react-router-dom'
import { CheckStatusBadge } from '@/entities/check'
import { CheckResultPanel } from '@/widgets/upload-panel'
import { APP_ROUTE_PATHS } from '@/shared/config/routes'
import { useCheckDetails } from '../api/useCheckDetails'

import { CheckDetailsSummary } from './CheckDetailsSummary'
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

      {checkDetailsQuery.data?.status === 'processing' ? (
        <div className={styles.processing} role="status" aria-live="polite">
          <CheckStatusBadge
            status={checkDetailsQuery.data.status}
            label={checkDetailsQuery.data.status_label}
          />
          <h3>Проверка документов выполняется</h3>
          <p>Файлы загружены. Мы обновим эту страницу автоматически, когда результат будет готов.</p>
        </div>
      ) : null}

      {checkDetailsQuery.data && checkDetailsQuery.data.status !== 'processing' ? (
        <>
          <CheckDetailsSummary result={checkDetailsQuery.data} />
          <CheckResultPanel result={checkDetailsQuery.data} showDownloadReportButton={false} />
        </>
      ) : null}
    </section>
  )
}
