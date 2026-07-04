import { CheckStatusBadge, type CheckResult } from '@/entities/check'
import { downloadJsonReport } from '@/features/download-report'
import { Button } from '@/shared/ui/button'
import { formatDetailsProgram } from '../lib/formatDetailsProgram'
import { getDetailsStats } from '../lib/getDetailsStats'

import styles from './CheckDetailsPage.module.css'

type CheckDetailsSummaryProps = {
  result: CheckResult
}

export function CheckDetailsSummary({ result }: CheckDetailsSummaryProps) {
  const stats = getDetailsStats(result)
  const checkedAt = new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(result.checked_at))

  return (
    <section className={styles.summary} aria-labelledby="details-summary-title">
      <div className={styles.summaryHeader}>
        <div>
          <h3 id="details-summary-title">Сводка проверки</h3>
          <CheckStatusBadge status={result.status} label={result.status_label} />
        </div>
        <Button
          type="button"
          onClick={() => downloadJsonReport(`check-${result.check_id}.json`, result)}
        >
          Скачать отчёт
        </Button>
      </div>

      <dl className={styles.summaryGrid}>
        <div>
          <dt>ID</dt>
          <dd>{result.check_id}</dd>
        </div>
        <div>
          <dt>Дата</dt>
          <dd>{checkedAt}</dd>
        </div>
        <div>
          <dt>Программа</dt>
          <dd>{formatDetailsProgram(result.program)}</dd>
        </div>
        <div>
          <dt>Документы</dt>
          <dd>{stats.documents}</dd>
        </div>
        <div>
          <dt>Ошибки</dt>
          <dd>{stats.errors}</dd>
        </div>
        <div>
          <dt>Предупреждения</dt>
          <dd>{stats.warnings}</dd>
        </div>
      </dl>
    </section>
  )
}
