import type { CheckDocument } from '@/entities/check'
import { formatDocumentType } from '../lib/formatDocumentType'

import styles from './UploadPanel.module.css'

type DocumentsListProps = {
  documents: CheckDocument[]
}

export function DocumentsList({ documents }: DocumentsListProps) {
  return (
    <div className={styles.block}>
      <h4>Документы</h4>
      <ul>
        {documents.map((document) => (
          <li key={document.name}>
            {document.name} - {formatDocumentType(document.detected_type)}, {document.size_kb} КБ
          </li>
        ))}
      </ul>
    </div>
  )
}
