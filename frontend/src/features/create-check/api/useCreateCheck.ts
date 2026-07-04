import { useMutation } from '@tanstack/react-query'
import { createCheck, type CheckResult, type Program } from '@/entities/check'

type CreateCheckMutationVariables = {
  files: File[]
  program: Program
}

type UseCreateCheckOptions = {
  onSuccess?: (result: CheckResult) => void
}

export function useCreateCheck({ onSuccess }: UseCreateCheckOptions) {
  return useMutation({
    mutationFn: ({ files, program }: CreateCheckMutationVariables) => createCheck(program, files),
    onSuccess,
  })
}
