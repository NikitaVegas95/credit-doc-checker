import { useState } from 'react'
import type { CheckResult } from '@/entities/check'
import { CreateCheckForm } from '@/features/create-check'

import { CheckResultPanel } from './CheckResultPanel'
import styles from './UploadPanel.module.css'

export function UploadPanel() {
  const [result, setResult] = useState<CheckResult | null>(null)

  return (
    <section className={styles.section} aria-labelledby="upload-title">
      <div className={styles.heading}>
        <h2 id="upload-title">Новая проверка</h2>
        <p>Загрузите документы и выберите льготную программу.</p>
      </div>
      <CreateCheckForm onSuccess={setResult} />

      {result ? <CheckResultPanel result={result} /> : null}
    </section>
  )
}
