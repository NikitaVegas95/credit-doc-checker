import { Route, Routes } from 'react-router-dom'

import { routeConfig } from '../config/routeConfig'

export function AppRouter() {
  return (
    <Routes>
      {routeConfig.map((route) => (
        <Route key={route.id} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}
