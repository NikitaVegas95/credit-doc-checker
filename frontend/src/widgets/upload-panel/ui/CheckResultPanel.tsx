import { forwardRef } from 'react'
import { CheckStatusBadge, type CheckResult } from '@/entities/check'
import { downloadJsonReport } from '@/features/download-report'
import { Button } from '@/shared/ui/button'
import { getOutcomeGuidance } from '../lib/getOutcomeGuidance'

import { DocumentsList } from './DocumentsList'
import { DocumentChecklist } from './DocumentChecklist'
import { ExtractedFieldsList } from './ExtractedFieldsList'
import { IssuesList } from './IssuesList'
import styles from './UploadPanel.module.css'

type CheckResultPanelProps = {
  result: CheckResult
  showDownloadReportButton?: boolean
  onReset?: () => void
}

export const CheckResultPanel = forwardRef<HTMLElement, CheckResultPanelProps>(function CheckResultPanel(
  {
    result,
    showDownloadReportButton = true,
    onReset,
  }: CheckResultPanelProps,
  ref,
) {
  return (
    <section ref={ref} className={styles.result} aria-labelledby="check-result-title" tabIndex={-1}>
      <div className={styles.resultHeader}>
        <div>
          <h3 id="check-result-title">Результат проверки</h3>
          <CheckStatusBadge status={result.status} label={result.status_label} />
        </div>
        <div className={styles.resultActions}>
          {onReset ? (
            <Button type="button" className={styles.secondaryButton} onClick={onReset}>
              Новая проверка
            </Button>
          ) : null}
          {showDownloadReportButton ? (
            <Button
              type="button"
              onClick={() => downloadJsonReport(`check-${result.check_id}.json`, result)}
            >
              Скачать отчёт
            </Button>
          ) : null}
        </div>
      </div>

      <p className={styles.guidance}>{getOutcomeGuidance(result.status)}</p>
      <p className={styles.reason}>{result.reason}</p>
      <DocumentChecklist result={result} />
      <IssuesList issues={result.issues} />
      <DocumentsList documents={result.documents} />
      <ExtractedFieldsList extracted={result.extracted} />
    </section>
  )
})
