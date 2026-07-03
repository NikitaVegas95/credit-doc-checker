import { Route, Routes } from 'react-router-dom'

import { routeConfig, type AppRouteConfig } from '../config/routeConfig'

const renderRoute = (route: AppRouteConfig) => (
  <Route key={route.id} path={'path' in route ? route.path : undefined} element={route.element}>
    {'children' in route ? route.children?.map(renderRoute) : null}
  </Route>
)

export function AppRouter() {
  return <Routes>{routeConfig.map(renderRoute)}</Routes>
}
