import type { ExtractedFields } from '@/entities/check'

import styles from './UploadPanel.module.css'

type ExtractedFieldsListProps = {
  extracted: ExtractedFields
}

const EXTRACTED_FIELD_LABELS: Array<{ key: keyof ExtractedFields; label: string }> = [
  { key: 'contractor', label: 'Контрагент' },
  { key: 'inn', label: 'ИНН' },
  { key: 'amount', label: 'Сумма' },
  { key: 'date', label: 'Дата' },
  { key: 'subject', label: 'Предмет' },
]

export function ExtractedFieldsList({ extracted }: ExtractedFieldsListProps) {
  return (
    <dl className={styles.extracted}>
      {EXTRACTED_FIELD_LABELS.map((field) => (
        <div key={field.key}>
          <dt>{field.label}</dt>
          <dd>{extracted[field.key]}</dd>
        </div>
      ))}
    </dl>
  )
}
