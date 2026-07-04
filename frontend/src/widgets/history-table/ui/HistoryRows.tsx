import { CheckStatusBadge, type CheckSummary } from '@/entities/check'
import { formatCheckedAt } from '../lib/formatCheckedAt'
import { formatProgram } from '../lib/formatProgram'

import styles from './HistoryTable.module.css'

type HistoryRowsProps = {
  checks: CheckSummary[]
}

export function HistoryRows({ checks }: HistoryRowsProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Дата</th>
            <th>Программа</th>
            <th>Статус</th>
            <th>Документы</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => (
            <tr key={check.check_id}>
              <td>{check.check_id}</td>
              <td>{formatCheckedAt(check.checked_at)}</td>
              <td>{formatProgram(check.program)}</td>
              <td>
                <CheckStatusBadge status={check.status} label={check.status_label} />
              </td>
              <td>{check.doc_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
