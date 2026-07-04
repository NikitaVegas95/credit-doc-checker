import type { CheckSummary } from '@/entities/check'

const PROGRAM_SEARCH_LABELS: Record<CheckSummary['program'], string[]> = {
  federal: ['federal', 'федеральная', 'федеральный'],
  regional: ['regional', 'областная', 'региональная', 'областной', 'региональный'],
}

export function filterChecksBySearchQuery(checks: CheckSummary[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return checks
  }

  return checks.filter((check) => {
    const searchableValues = [
      check.check_id,
      check.status,
      check.status_label,
      check.doc_count.toString(),
      ...PROGRAM_SEARCH_LABELS[check.program],
    ]

    return searchableValues.some((value) => value.toLowerCase().includes(normalizedQuery))
  })
}
