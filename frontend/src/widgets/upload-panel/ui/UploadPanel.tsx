import { useEffect, useRef } from 'react'
import { CreateCheckForm } from '@/features/create-check'
import { useCreateCheckFormStore } from '@/features/create-check/model/createCheckFormStore'
import { useCreateCheckFormPersistence } from '@/features/create-check/model/useCreateCheckFormPersistence'

import { CheckResultPanel } from './CheckResultPanel'
import styles from './UploadPanel.module.css'

export function UploadPanel() {
  const result = useCreateCheckFormStore((state) => state.result)
  const reset = useCreateCheckFormStore((state) => state.reset)
  const resultRef = useRef<HTMLElement | null>(null)
  const lastFocusedResultId = useRef<string | null>(null)

  useCreateCheckFormPersistence()

  useEffect(() => {
    if (!result) {
      lastFocusedResultId.current = null
      return
    }

    if (lastFocusedResultId.current === result.check_id) {
      return
    }

    lastFocusedResultId.current = result.check_id
    resultRef.current?.focus()
  }, [result])

  return (
    <section className={styles.section} aria-labelledby="upload-title">
      <div className={styles.heading}>
        <h2 id="upload-title">Новая проверка</h2>
        <p>Загрузите документы и выберите льготную программу.</p>
      </div>
      <CreateCheckForm />

      {result ? <CheckResultPanel ref={resultRef} result={result} onReset={reset} /> : null}
    </section>
  )
}
