import type { CheckResult, CheckSummary } from '../model/types'

export function toCheckSummary(result: CheckResult): CheckSummary {
  return {
    check_id: result.check_id,
    checked_at: result.checked_at,
    doc_count: result.documents.length,
    program: result.program,
    status: result.status,
    status_label: result.status_label,
  }
}
