import type { CheckResult } from '@/entities/check'

export type DetailsStats = {
  documents: number
  errors: number
  warnings: number
}

export function getDetailsStats(result: CheckResult): DetailsStats {
  return {
    documents: result.documents.length,
    errors: result.issues.filter((issue) => issue.level === 'error').length,
    warnings: result.issues.filter((issue) => issue.level === 'warning').length,
  }
}
