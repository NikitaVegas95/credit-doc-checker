import { useQuery } from '@tanstack/react-query'
import { getChecks } from '@/entities/check'

export const CHECKS_HISTORY_QUERY_KEY = ['checks'] as const

export function useChecksHistory() {
  return useQuery({
    queryFn: getChecks,
    queryKey: CHECKS_HISTORY_QUERY_KEY,
  })
}
