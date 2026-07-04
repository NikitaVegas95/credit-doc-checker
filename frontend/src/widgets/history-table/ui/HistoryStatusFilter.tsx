import type { HistoryStatusFilter as HistoryStatusFilterValue } from '../model/filterOptions'
import { HISTORY_STATUS_FILTER_OPTIONS } from '../model/filterOptions'

import styles from './HistoryTable.module.css'

type HistoryStatusFilterProps = {
  value: HistoryStatusFilterValue
  onChange: (value: HistoryStatusFilterValue) => void
}

export function HistoryStatusFilter({ value, onChange }: HistoryStatusFilterProps) {
  return (
    <div className={styles.filters} aria-label="Фильтр по статусу">
      {HISTORY_STATUS_FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={option.value === value ? styles.filterActive : styles.filter}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
