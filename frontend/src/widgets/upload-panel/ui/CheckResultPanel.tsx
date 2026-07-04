import { CheckStatusBadge, type CheckResult } from '@/entities/check'
import { downloadJsonReport } from '@/features/download-report'
import { Button } from '@/shared/ui/button'

import { DocumentsList } from './DocumentsList'
import { ExtractedFieldsList } from './ExtractedFieldsList'
import { IssuesList } from './IssuesList'
import styles from './UploadPanel.module.css'

type CheckResultPanelProps = {
  result: CheckResult
}

export function CheckResultPanel({ result }: CheckResultPanelProps) {
  return (
    <section className={styles.result} aria-labelledby="check-result-title">
      <div className={styles.resultHeader}>
        <div>
          <h3 id="check-result-title">Результат проверки</h3>
          <CheckStatusBadge status={result.status} label={result.status_label} />
        </div>
        <Button
          type="button"
          onClick={() => downloadJsonReport(`check-${result.check_id}.json`, result)}
        >
          Скачать отчёт
        </Button>
      </div>

      <p className={styles.reason}>{result.reason}</p>
      <IssuesList issues={result.issues} />
      <DocumentsList documents={result.documents} />
      <ExtractedFieldsList extracted={result.extracted} />
    </section>
  )
}
