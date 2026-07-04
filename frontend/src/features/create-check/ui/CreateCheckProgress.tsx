import styles from './CreateCheckForm.module.css'

type CreateCheckProgressProps = {
  hasFiles: boolean
  isPending: boolean
}

export function CreateCheckProgress({ hasFiles, isPending }: CreateCheckProgressProps) {
  if (isPending) {
    return (
      <div className={styles.progressPanel} aria-live="polite">
        <div className={styles.progressHeader}>
          <strong>Загружаем документы</strong>
          <span className={styles.progressValue}>1 из 2</span>
        </div>
        <progress className={styles.progressBar} />
        <div className={styles.progressHeader}>
          <strong>Проверяем пакет</strong>
          <span className={styles.progressValue}>2 из 2</span>
        </div>
        <progress className={styles.progressBar} />
        <p>Файлы передаются в API, затем пакет анализируется по требованиям программы.</p>
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
