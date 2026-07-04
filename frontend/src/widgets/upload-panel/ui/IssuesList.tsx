import type { CheckIssue } from '@/entities/check'
import { formatIssueLevel } from '../lib/formatIssueLevel'

import styles from './UploadPanel.module.css'

type IssuesListProps = {
  issues: CheckIssue[]
}

export function IssuesList({ issues }: IssuesListProps) {
  if (issues.length === 0) {
    return null
  }

  return (
    <div className={styles.block}>
      <h4>Замечания</h4>
      <ul>
        {issues.map((issue) => (
          <li key={`${issue.level}-${issue.message}`}>
            <strong>{formatIssueLevel(issue.level)}:</strong> {issue.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
