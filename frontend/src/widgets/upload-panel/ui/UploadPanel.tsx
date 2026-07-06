import { useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { checksQueryKeys, getCheck, toCheckSummary, type CheckSummary } from '@/entities/check'
import { CreateCheckForm } from '@/features/create-check'
import { useCreateCheckFormStore } from '@/features/create-check/model/createCheckFormStore'
import { useCreateCheckFormPersistence } from '@/features/create-check/model/useCreateCheckFormPersistence'
import { getHistoryDetailsPath } from '@/shared/config/routes'

import { CheckResultPanel } from './CheckResultPanel'
import styles from './UploadPanel.module.css'

export function UploadPanel() {
  const result = useCreateCheckFormStore((state) => state.result)
  const setResult = useCreateCheckFormStore((state) => state.setResult)
  const reset = useCreateCheckFormStore((state) => state.reset)
  const queryClient = useQueryClient()
  const resultRef = useRef<HTMLElement | null>(null)
  const lastFocusedResultId = useRef<string | null>(null)
  const activeCheckId = result?.check_id ?? ''

  useCreateCheckFormPersistence()

  const activeCheckQuery = useQuery({
    enabled: activeCheckId.length > 0 && result?.status === 'processing',
    queryFn: () => getCheck(activeCheckId),
    queryKey: checksQueryKeys.detail(activeCheckId),
    refetchInterval: (query) => (query.state.data?.status === 'processing' ? 1000 : false),
  })

  useEffect(() => {
    if (!activeCheckQuery.data || activeCheckQuery.data.check_id !== activeCheckId) {
      return
    }

    setResult(activeCheckQuery.data)
    queryClient.setQueryData<CheckSummary[]>(checksQueryKeys.all, (checks = []) => [
      toCheckSummary(activeCheckQuery.data),
      ...checks.filter((check) => check.check_id !== activeCheckQuery.data.check_id),
    ])
  }, [activeCheckId, activeCheckQuery.data, queryClient, setResult])

  useEffect(() => {
    if (!result || result.status === 'processing') {
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

      {result?.status === 'processing' ? (
        <div className={styles.processingNotice} role="status" aria-live="polite">
          <div>
            <strong>Проверка запущена</strong>
            <p>Можно продолжать работу с сайтом. Результат появится здесь после завершения.</p>
          </div>
          <Link className={styles.noticeLink} to={getHistoryDetailsPath(result.check_id)}>
            Открыть детали
          </Link>
        </div>
      ) : null}

      {result && result.status !== 'processing' ? (
        <CheckResultPanel ref={resultRef} result={result} onReset={reset} />
      ) : null}
    </section>
  )
}
