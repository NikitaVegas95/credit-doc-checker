import { useQuery } from '@tanstack/react-query'
import { checksQueryKeys, getChecks } from '@/entities/check'

export const CHECKS_HISTORY_QUERY_KEY = checksQueryKeys.all

export function useChecksHistory() {
  return useQuery({
    queryFn: getChecks,
    queryKey: CHECKS_HISTORY_QUERY_KEY,
    refetchInterval: (query) =>
      query.state.data?.some((check) => check.status === 'processing') ? 1000 : false,
  })
}
