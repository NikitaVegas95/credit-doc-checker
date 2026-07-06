import type { CheckSummary, CheckStatus } from '@/entities/check'

export type HistoryStats = {
  total: number
} & Record<CheckStatus, number>

export function getHistoryStats(checks: CheckSummary[]): HistoryStats {
  return checks.reduce<HistoryStats>(
    (stats, check) => ({
      ...stats,
      total: stats.total + 1,
      [check.status]: stats[check.status] + 1,
    }),
    {
      approve: 0,
      manual: 0,
      processing: 0,
      reject: 0,
      total: 0,
    },
  )
}
