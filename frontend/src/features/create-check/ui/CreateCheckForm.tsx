import { PROGRAM_OPTIONS } from '@/entities/check'
import { Button } from '@/shared/ui/button'

import styles from './CreateCheckForm.module.css'

export function CreateCheckForm() {
  return (
    <form className={styles.form}>
      <label className={styles.field}>
        <span>Льготная программа</span>
        <select name="program" defaultValue="">
          <option value="" disabled>
            Выберите программу
          </option>
          {PROGRAM_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.dropzone}>
        <span>Перетащите файлы сюда или выберите на компьютере</span>
        <input multiple name="files" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
      </label>

      <Button type="button" disabled>
        Запустить проверку
      </Button>
    </form>
  )
}

