import { NavLink } from 'react-router-dom'
import { getNavLinkClassName } from '@/app/lib/getNavLinkClassName'
import { navRoutes } from '@/app/providers/router'

import styles from './AppHeader.module.css'

const getHeaderNavLinkClassName = getNavLinkClassName({
  base: styles.navLink,
  active: styles.navLinkActive,
})

export function AppHeader() {
  return (
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
            className={getHeaderNavLinkClassName}
            end={route.end}
          >
            {route.navLabel}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
