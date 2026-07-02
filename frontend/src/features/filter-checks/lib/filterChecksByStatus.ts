import type { CheckStatus, CheckSummary } from '@/entities/check'

export function filterChecksByStatus(checks: CheckSummary[], status: CheckStatus | 'all') {
  if (status === 'all') {
    return checks
  }

  return checks.filter((check) => check.status === status)
}

