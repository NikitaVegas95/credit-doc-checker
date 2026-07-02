import type { CheckStatus, Program } from './types'

export const PROGRAM_OPTIONS: Array<{ value: Program; label: string }> = [
  { value: 'federal', label: 'Федеральная' },
  { value: 'regional', label: 'Областная' },
]

export const STATUS_META: Record<CheckStatus, { tone: 'success' | 'danger' | 'warning' }> = {
  approve: { tone: 'success' },
  reject: { tone: 'danger' },
  manual: { tone: 'warning' },
}

