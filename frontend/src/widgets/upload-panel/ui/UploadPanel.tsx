import { CreateCheckForm } from '@/features/create-check'

import styles from './UploadPanel.module.css'

export function UploadPanel() {
  return (
    <section className={styles.section} aria-labelledby="upload-title">
      <div className={styles.heading}>
        <h2 id="upload-title">Новая проверка</h2>
        <p>Загрузите документы и выберите льготную программу.</p>
      </div>
      <CreateCheckForm />
    </section>
  )
}

