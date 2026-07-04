export const checksQueryKeys = {
  all: ['checks'] as const,
  detail: (checkId: string) => ['checks', checkId] as const,
}
