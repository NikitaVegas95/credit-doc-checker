export const APP_ROUTE_PATHS = {
  check: '/',
  history: '/history',
  notFound: '*',
} as const

export type AppRoutePath = (typeof APP_ROUTE_PATHS)[keyof typeof APP_ROUTE_PATHS]
