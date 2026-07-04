import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  checksQueryKeys,
  createCheck,
  toCheckSummary,
  type CheckResult,
  type CheckSummary,
  type Program,
} from '@/entities/check'

type CreateCheckMutationVariables = {
  files: File[]
  program: Program
}

type UseCreateCheckOptions = {
  onSuccess?: (result: CheckResult) => void
}

export function useCreateCheck({ onSuccess }: UseCreateCheckOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ files, program }: CreateCheckMutationVariables) => createCheck(program, files),
    onSuccess: (result) => {
      queryClient.setQueryData<CheckSummary[]>(checksQueryKeys.all, (checks = []) => [
        toCheckSummary(result),
        ...checks.filter((check) => check.check_id !== result.check_id),
      ])
      queryClient.setQueryData(checksQueryKeys.detail(result.check_id), result)
      onSuccess?.(result)
    },
  })
}
