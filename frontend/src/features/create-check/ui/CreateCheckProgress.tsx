import styles from './CreateCheckForm.module.css'

type CreateCheckProgressProps = {
  hasFiles: boolean
  isPending: boolean
  requestProgress?: number
  uploadProgress?: number
}

export function CreateCheckProgress({
  hasFiles,
  isPending,
  requestProgress,
  uploadProgress,
}: CreateCheckProgressProps) {
  const currentProgress = uploadProgress ?? requestProgress ?? 0

  if (isPending) {
    const progressValue = Math.max(0, Math.min(currentProgress, 100))
    const activeStep = progressValue < 100 ? 'Отправляем документы' : 'Проверяем пакет'

    return (
      <div className={styles.progressPanel} aria-live="polite">
        <div className={styles.progressHeader}>
          <strong>{activeStep}</strong>
          <span className={styles.progressValue}>{progressValue}%</span>
        </div>
        <progress className={styles.progressBar} value={progressValue} max={100} />
        <p>Выполняется запрос: файлы передаются в API, затем пакет анализируется по требованиям программы.</p>
      </div>
    )
  }

  if (hasFiles) {
    return (
      <div className={styles.progressPanel}>
        <div className={styles.progressHeader}>
          <strong>Файлы готовы к загрузке</strong>
          <span className={styles.progressValue}>100%</span>
        </div>
        <progress className={styles.progressBar} value={100} max={100} />
      </div>
    )
  }

  return null
}
