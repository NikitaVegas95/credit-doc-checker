import styles from './CreateCheckForm.module.css'

type CreateCheckProgressProps = {
  fileCount?: number
  hasFiles: boolean
  isPending: boolean
  requestProgress?: number
  uploadProgress?: number
}

export function CreateCheckProgress({
  fileCount = 0,
  hasFiles,
  isPending,
  requestProgress,
  uploadProgress,
}: CreateCheckProgressProps) {
  const currentProgress = uploadProgress ?? requestProgress ?? 0

  if (isPending) {
    const progressValue = Math.max(0, Math.min(currentProgress, 100))
    const uploadStep = progressValue < 100 ? 'Загружаем файлы' : 'Загрузка завершена'
    const uploadDescription = progressValue < 100
      ? 'Передаем документы в API.'
      : 'Документы приняты, можно выполнять проверку.'

    return (
      <>
        <div className={styles.progressPanel} aria-live="polite">
          <div className={styles.progressHeader}>
            <strong>{uploadStep}</strong>
            <span className={styles.progressValue}>{progressValue}%</span>
          </div>
          <progress className={styles.progressBar} value={progressValue} max={100} />
          <p>{uploadDescription}</p>
        </div>
        <div className={styles.checkStatusPanel} role="status" aria-live="polite">
          <div className={styles.progressHeader}>
            <strong>Идет проверка документов</strong>
            <span className={styles.processingBadge}>В работе</span>
          </div>
          <p>Сверяем состав пакета, типы документов и требования выбранной льготной программы.</p>
        </div>
      </>
    )
  }

  if (hasFiles) {
    return (
      <div className={styles.progressPanel} aria-live="polite">
        <div className={styles.progressHeader}>
          <strong>Готово к проверке</strong>
          <span className={styles.progressValue}>{fileCount}</span>
        </div>
        <p>Документы добавлены и готовы к проверке.</p>
      </div>
    )
  }

  return null
}
