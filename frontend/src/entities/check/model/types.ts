export type Program = 'federal' | 'regional'

export type CheckStatus = 'approve' | 'reject' | 'manual'

export type CheckIssue = {
  level: 'error' | 'warning'
  message: string
}

export type CheckDocument = {
  name: string
  detected_type: string
  size_kb: number
}

export type ExtractedFields = {
  contractor: string
  inn: string
  amount: string
  date: string
  subject: string
}

export type CheckResult = {
  check_id: string
  program: Program
  status: CheckStatus
  status_label: string
  reason: string
  issues: CheckIssue[]
  documents: CheckDocument[]
  extracted: ExtractedFields
  checked_at: string
}

export type CheckSummary = {
  check_id: string
  program: Program
  status: CheckStatus
  status_label: string
  doc_count: number
  checked_at: string
}

