import styles from './HistoryTable.module.css'

type HistorySearchProps = {
  value: string
  onChange: (value: string) => void
}

export function HistorySearch({ value, onChange }: HistorySearchProps) {
  return (
    <label className={styles.search}>
      <span>Поиск по истории</span>
      <input
        type="search"
        value={value}
        placeholder="ID, статус или программа"
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
