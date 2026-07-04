export const APP_ROUTE_PATHS = {
  check: '/',
  history: '/history',
  historyDetails: '/history/:checkId',
  notFound: '*',
} as const

export type AppRoutePath = (typeof APP_ROUTE_PATHS)[keyof typeof APP_ROUTE_PATHS]

export function getHistoryDetailsPath(checkId: string) {
  return `/history/${checkId}`
}
