import { useState } from 'react'
import { filterChecksBySearchQuery, filterChecksByStatus } from '@/features/filter-checks'
import { Button } from '@/shared/ui/button'
import { useDeleteCheck } from '../api/useDeleteCheck'
import { useChecksHistory } from '../api/useChecksHistory'
import { confirmDeleteCheck } from '../lib/confirmDeleteCheck'
import { getHistoryStats } from '../lib/getHistoryStats'
import type { HistoryStatusFilter as HistoryStatusFilterValue } from '../model/filterOptions'

import { HistoryRows } from './HistoryRows'
import { HistorySearch } from './HistorySearch'
import { HistorySummary } from './HistorySummary'
import { HistoryStatusFilter } from './HistoryStatusFilter'
import styles from './HistoryTable.module.css'

export function HistoryTable() {
  const [statusFilter, setStatusFilter] = useState<HistoryStatusFilterValue>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const checksQuery = useChecksHistory()
  const deleteCheckMutation = useDeleteCheck()
  const checks = checksQuery.data ?? []
  const statusFilteredChecks = filterChecksByStatus(checks, statusFilter)
  const filteredChecks = filterChecksBySearchQuery(statusFilteredChecks, searchQuery)
  const stats = getHistoryStats(checks)
  const hasChecks = checks.length > 0
  const hasActiveFilters = statusFilter !== 'all' || searchQuery.trim().length > 0

  const handleDeleteCheck = (checkId: string) => {
    if (confirmDeleteCheck(checkId)) {
      deleteCheckMutation.mutate(checkId)
    }
  }

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

      {checksQuery.isSuccess && !hasChecks ? (
        <div className={styles.empty}>
          <p>Пока нет данных</p>
          <p>Выполненные проверки появятся здесь после загрузки документов.</p>
        </div>
      ) : null}

      {checksQuery.isSuccess && hasChecks ? (
        <>
          <HistorySummary stats={stats} />
          <div className={styles.controls}>
            <HistorySearch value={searchQuery} onChange={setSearchQuery} />
            {hasActiveFilters ? (
              <Button
                type="button"
                onClick={() => {
                  setStatusFilter('all')
                  setSearchQuery('')
                }}
              >
                Сбросить фильтры
              </Button>
            ) : null}
          </div>
          <HistoryStatusFilter value={statusFilter} onChange={setStatusFilter} />
          {filteredChecks.length > 0 ? (
            <HistoryRows
              checks={filteredChecks}
              deletingCheckId={deleteCheckMutation.variables}
              onDelete={handleDeleteCheck}
            />
          ) : (
            <div className={styles.empty}>
              <p>Нет проверок по заданным условиям.</p>
            </div>
          )}
          {deleteCheckMutation.isError ? (
            <p className={styles.error}>Не удалось удалить проверку.</p>
          ) : null}
        </>
      ) : null}
    </section>
  )
}
