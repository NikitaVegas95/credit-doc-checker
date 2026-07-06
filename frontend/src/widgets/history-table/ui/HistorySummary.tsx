import type { HistoryStats } from '../lib/getHistoryStats'

import styles from './HistoryTable.module.css'

type HistorySummaryProps = {
  stats: HistoryStats
}

export function HistorySummary({ stats }: HistorySummaryProps) {
  return (
    <dl className={styles.summary} aria-label="Сводка истории">
      <div>
        <dt>Всего</dt>
        <dd>{stats.total}</dd>
      </div>
      <div>
        <dt>Можно заявлять</dt>
        <dd>{stats.approve}</dd>
      </div>
      <div>
        <dt>Выполняется</dt>
        <dd>{stats.processing}</dd>
      </div>
      <div>
        <dt>Нельзя заявлять</dt>
        <dd>{stats.reject}</dd>
      </div>
      <div>
        <dt>Ручная проверка</dt>
        <dd>{stats.manual}</dd>
      </div>
    </dl>
  )
}
