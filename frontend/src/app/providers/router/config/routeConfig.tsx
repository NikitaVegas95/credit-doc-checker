import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { CheckPage } from '@/pages/check-page'
import { HistoryPage } from '@/pages/history-page'
import { APP_ROUTE_PATHS, type AppRoutePath } from '@/shared/config/routes'

type AppRouteObject = {
  id: string
  path: AppRoutePath
  element: ReactNode
  navLabel?: string
  end?: boolean
}

const DEFAULT_ROUTE_PATH = APP_ROUTE_PATHS.check

export const routeConfig = [
  {
    id: 'check',
    path: APP_ROUTE_PATHS.check,
    element: <CheckPage />,
    navLabel: 'Проверка',
    end: true,
  },
  {
    id: 'history',
    path: APP_ROUTE_PATHS.history,
    element: <HistoryPage />,
    navLabel: 'История',
    end: false,
  },
  {
    id: 'notFound',
    path: APP_ROUTE_PATHS.notFound,
    element: <Navigate to={DEFAULT_ROUTE_PATH} replace />,
  },
] as const satisfies readonly AppRouteObject[]

export type AppRoute = (typeof routeConfig)[number]['id']
export type AppRouteConfig = (typeof routeConfig)[number]
export type AppNavRoute = Extract<AppRouteConfig, { navLabel: string }>

export const navRoutes = routeConfig.filter((route): route is AppNavRoute => 'navLabel' in route)
