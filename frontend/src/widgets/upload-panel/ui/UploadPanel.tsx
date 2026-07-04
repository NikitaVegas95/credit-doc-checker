import { CreateCheckForm } from '@/features/create-check'
import { useCreateCheckFormStore } from '@/features/create-check/model/createCheckFormStore'

import { CheckResultPanel } from './CheckResultPanel'
import styles from './UploadPanel.module.css'

export function UploadPanel() {
  const result = useCreateCheckFormStore((state) => state.result)

  return (
    <section className={styles.section} aria-labelledby="upload-title">
      <div className={styles.heading}>
        <h2 id="upload-title">Новая проверка</h2>
        <p>Загрузите документы и выберите льготную программу.</p>
      </div>
      <CreateCheckForm />

      {result ? <CheckResultPanel result={result} /> : null}
    </section>
  )
}
