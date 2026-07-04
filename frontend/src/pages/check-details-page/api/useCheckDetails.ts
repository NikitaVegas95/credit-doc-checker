import { useQuery } from '@tanstack/react-query'
import { checksQueryKeys, getCheck } from '@/entities/check'

export function getCheckDetailsQueryKey(checkId: string) {
  return checksQueryKeys.detail(checkId)
}

export function useCheckDetails(checkId: string) {
  return useQuery({
    enabled: checkId.length > 0,
    queryFn: () => getCheck(checkId),
    queryKey: getCheckDetailsQueryKey(checkId),
  })
}
