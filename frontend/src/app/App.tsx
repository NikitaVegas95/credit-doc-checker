import { NavLink } from 'react-router-dom'
import { getNavLinkClassName } from './lib/getNavLinkClassName'
import { AppRouter, navRoutes } from './providers/router'

import styles from './App.module.css'

const getAppNavLinkClassName = getNavLinkClassName({
  base: styles.navLink,
  active: styles.navLinkActive,
})

export function App() {
  return (
    <main className={styles.layout}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>AI-агент</p>
          <h1>Проверка льготных кредитов</h1>
        </div>

        <nav className={styles.nav} aria-label="Разделы приложения">
          {navRoutes.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={getAppNavLinkClassName}
              end={route.end}
            >
              {route.navLabel}
            </NavLink>
          ))}
        </nav>
      </header>

      <AppRouter />
    </main>
  )
}
