import { useQuery } from '@tanstack/react-query'
import { getCheck } from '@/entities/check'

export function getCheckDetailsQueryKey(checkId: string) {
  return ['checks', checkId] as const
}

export function useCheckDetails(checkId: string) {
  return useQuery({
    enabled: checkId.length > 0,
    queryFn: () => getCheck(checkId),
    queryKey: getCheckDetailsQueryKey(checkId),
  })
}
