import { useState } from 'react'
import { filterChecksByStatus } from '@/features/filter-checks'
import { Button } from '@/shared/ui/button'
import { useChecksHistory } from '../api/useChecksHistory'
import type { HistoryStatusFilter as HistoryStatusFilterValue } from '../model/filterOptions'

import { HistoryRows } from './HistoryRows'
import { HistoryStatusFilter } from './HistoryStatusFilter'
import styles from './HistoryTable.module.css'

export function HistoryTable() {
  const [statusFilter, setStatusFilter] = useState<HistoryStatusFilterValue>('all')
  const checksQuery = useChecksHistory()
  const checks = checksQuery.data ?? []
  const filteredChecks = filterChecksByStatus(checks, statusFilter)
  const hasChecks = checks.length > 0

  return (
    <section className={styles.section} aria-labelledby="history-title">
      <div className={styles.header}>
        <div className={styles.heading}>
          <h2 id="history-title">История</h2>
          <p>Здесь появятся выполненные проверки.</p>
        </div>
        <Button type="button" onClick={() => void checksQuery.refetch()}>
          Обновить
        </Button>
      </div>

      {checksQuery.isLoading ? <p className={styles.state}>Загружаем историю...</p> : null}

      {checksQuery.isError ? (
        <div className={styles.empty}>
          <p>Не удалось загрузить историю проверок.</p>
          <Button type="button" onClick={() => void checksQuery.refetch()}>
            Повторить
          </Button>
        </div>
      ) : null}

      {checksQuery.isSuccess && !hasChecks ? (
        <div className={styles.empty}>
          <p>Пока нет данных</p>
          <p>Выполненные проверки появятся здесь после загрузки документов.</p>
        </div>
      ) : null}

      {checksQuery.isSuccess && hasChecks ? (
        <>
          <HistoryStatusFilter value={statusFilter} onChange={setStatusFilter} />
          {filteredChecks.length > 0 ? (
            <HistoryRows checks={filteredChecks} />
          ) : (
            <div className={styles.empty}>
              <p>Нет проверок с выбранным статусом.</p>
            </div>
          )}
        </>
      ) : null}
    </section>
  )
}
