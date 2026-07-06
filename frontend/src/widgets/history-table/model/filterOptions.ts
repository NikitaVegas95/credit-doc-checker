import type { CheckStatus } from '@/entities/check'

export type HistoryStatusFilter = CheckStatus | 'all'

export const HISTORY_STATUS_FILTER_OPTIONS: Array<{
  label: string
  value: HistoryStatusFilter
}> = [
  { value: 'all', label: 'Все' },
  { value: 'processing', label: 'Выполняется' },
  { value: 'approve', label: 'Можно заявлять' },
  { value: 'reject', label: 'Нельзя заявлять' },
  { value: 'manual', label: 'Ручная проверка' },
]
