import { CheckPage } from '@/pages/check-page'
import { HistoryPage } from '@/pages/history-page'

import styles from './App.module.css'

export function App() {
  return (
    <main className={styles.layout}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>AI-агент</p>
          <h1>Проверка льготных кредитов</h1>
        </div>
      </header>

      <div className={styles.grid}>
        <CheckPage />
        <HistoryPage />
      </div>
    </main>
  )
}
