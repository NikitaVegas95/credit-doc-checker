import { CheckStatusBadge } from '@/entities/check'

import styles from './HistoryTable.module.css'

const emptyRows: never[] = []

export function HistoryTable() {
  return (
    <section className={styles.section} aria-labelledby="history-title">
      <div className={styles.heading}>
        <h2 id="history-title">История</h2>
        <p>Здесь появятся выполненные проверки.</p>
      </div>

      {emptyRows.length === 0 ? (
        <div className={styles.empty}>
          <CheckStatusBadge status="manual" label="Пока нет данных" />
          <p>История будет загружаться из mock API после реализации сценария проверки.</p>
        </div>
      ) : null}
    </section>
  )
}

