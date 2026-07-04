import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  checksQueryKeys,
  createCheck,
  toCheckSummary,
  type CheckResult,
  type CheckSummary,
  type Program,
} from '@/entities/check'
import { useCreateCheckFormStore } from '../model/createCheckFormStore'

type CreateCheckMutationVariables = {
  files: File[]
  program: Program
}

type UseCreateCheckOptions = {
  onSuccess?: (result: CheckResult) => void
  onUploadProgress?: (progress: number) => void
}

export function useCreateCheck({ onSuccess, onUploadProgress }: UseCreateCheckOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ files, program }: CreateCheckMutationVariables) =>
      createCheck(program, files, { onUploadProgress }),
    onSuccess: (result) => {
      useCreateCheckFormStore.getState().setResult(result)
      queryClient.setQueryData<CheckSummary[]>(checksQueryKeys.all, (checks = []) => [
        toCheckSummary(result),
        ...checks.filter((check) => check.check_id !== result.check_id),
      ])
      queryClient.setQueryData(checksQueryKeys.detail(result.check_id), result)
      onSuccess?.(result)
    },
  })
}
