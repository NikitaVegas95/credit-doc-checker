import { useQuery } from '@tanstack/react-query'
import { checksQueryKeys, getChecks } from '@/entities/check'

export const CHECKS_HISTORY_QUERY_KEY = checksQueryKeys.all

export function useChecksHistory() {
  return useQuery({
    queryFn: getChecks,
    queryKey: CHECKS_HISTORY_QUERY_KEY,
  })
}
