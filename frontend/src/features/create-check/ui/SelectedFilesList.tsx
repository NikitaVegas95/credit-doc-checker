import { formatFileSize } from '../lib/formatFileSize'

import styles from './CreateCheckForm.module.css'

type SelectedFilesListProps = {
  files: File[]
  onClear: () => void
}

export function SelectedFilesList({ files, onClear }: SelectedFilesListProps) {
  if (files.length === 0) {
    return null
  }

  return (
    <div className={styles.fileList}>
      <div className={styles.fileListHeader}>
        <span>Выбрано файлов: {files.length}</span>
        <button type="button" onClick={onClear}>
          Очистить
        </button>
      </div>
      <ul>
        {files.map((file) => (
          <li key={`${file.name}-${file.lastModified}`}>
            <span>{file.name}</span>
            <span>{formatFileSize(file.size)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
