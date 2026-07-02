import type { CheckStatus } from '../model/types'
import { STATUS_META } from '../model/constants'

import styles from './CheckStatusBadge.module.css'

type CheckStatusBadgeProps = {
  status: CheckStatus
  label: string
}

export function CheckStatusBadge({ status, label }: CheckStatusBadgeProps) {
  return <span className={styles[STATUS_META[status].tone]}>{label}</span>
}

