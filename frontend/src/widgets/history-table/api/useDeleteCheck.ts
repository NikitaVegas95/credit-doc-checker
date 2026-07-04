import { useMutation, useQueryClient } from '@tanstack/react-query'
import { checksQueryKeys, deleteCheck, type CheckSummary } from '@/entities/check'

import { CHECKS_HISTORY_QUERY_KEY } from './useChecksHistory'

type DeleteCheckContext = {
  previousChecks?: CheckSummary[]
}

export function useDeleteCheck() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, string, DeleteCheckContext>({
    mutationFn: deleteCheck,
    onMutate: async (checkId) => {
      await queryClient.cancelQueries({ queryKey: CHECKS_HISTORY_QUERY_KEY })

      const previousChecks = queryClient.getQueryData<CheckSummary[]>(CHECKS_HISTORY_QUERY_KEY)

      queryClient.setQueryData<CheckSummary[]>(CHECKS_HISTORY_QUERY_KEY, (checks = []) =>
        checks.filter((check) => check.check_id !== checkId),
      )

      return { previousChecks }
    },
    onError: (_error, _checkId, context) => {
      if (context?.previousChecks) {
        queryClient.setQueryData(CHECKS_HISTORY_QUERY_KEY, context.previousChecks)
      }
    },
    onSettled: (_data, _error, checkId) => {
      void queryClient.invalidateQueries({ queryKey: CHECKS_HISTORY_QUERY_KEY })
      void queryClient.removeQueries({ queryKey: checksQueryKeys.detail(checkId) })
    },
  })
}
