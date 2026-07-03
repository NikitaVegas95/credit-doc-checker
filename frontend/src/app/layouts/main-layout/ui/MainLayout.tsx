import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'

import styles from './MainLayout.module.css'

export function MainLayout() {
  return (
    <main className={styles.layout}>
      <AppHeader />
      <Outlet />
    </main>
  )
}
