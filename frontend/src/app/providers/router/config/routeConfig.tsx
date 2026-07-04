import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { MainLayout } from '@/app/layouts/main-layout'
import { CheckDetailsPage } from '@/pages/check-details-page'
import { CheckPage } from '@/pages/check-page'
import { HistoryPage } from '@/pages/history-page'
import { APP_ROUTE_PATHS, type AppRoutePath } from '@/shared/config/routes'

type AppPageRouteObject = {
  id: string
  path: AppRoutePath
  element: ReactNode
  navLabel?: string
  end?: boolean
}

type AppLayoutRouteObject = {
  id: string
  element: ReactNode
  children: readonly AppPageRouteObject[]
}

const DEFAULT_ROUTE_PATH = APP_ROUTE_PATHS.check

export const routeConfig = [
  {
    id: 'mainLayout',
    element: <MainLayout />,
    children: [
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
        id: 'historyDetails',
        path: APP_ROUTE_PATHS.historyDetails,
        element: <CheckDetailsPage />,
      },
      {
        id: 'notFound',
        path: APP_ROUTE_PATHS.notFound,
        element: <Navigate to={DEFAULT_ROUTE_PATH} replace />,
      },
    ],
  },
] as const satisfies readonly AppLayoutRouteObject[]

type AppRouteConfigItem = (typeof routeConfig)[number]
type AppRouteChildConfig = NonNullable<AppRouteConfigItem['children']>[number]

export type AppRoute = AppRouteConfigItem['id'] | AppRouteChildConfig['id']
export type AppRouteConfig = AppRouteConfigItem | AppRouteChildConfig
export type AppNavRoute = Extract<AppRouteConfig, { navLabel: string }>

export const navRoutes = routeConfig
  .flatMap((route) => route.children ?? [])
  .filter((route): route is AppNavRoute => 'navLabel' in route)
