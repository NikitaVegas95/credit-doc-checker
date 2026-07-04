import { getDocumentRequirementStates, type CheckResult } from '@/entities/check'

import styles from './UploadPanel.module.css'

type DocumentChecklistProps = {
  result: CheckResult
}

export function DocumentChecklist({ result }: DocumentChecklistProps) {
  const requirementStates = getDocumentRequirementStates(result.program, result.documents)

  return (
    <div className={styles.checklist}>
      <h4>Проверка состава пакета</h4>
      <ul>
        {requirementStates.map((requirement) => (
          <li key={requirement.type}>
            <span>{requirement.label}</span>
            <span className={requirement.found ? styles.checkFound : styles.checkMissing}>
              {requirement.found
                ? 'Найден'
                : requirement.required
                  ? 'Не найден'
                  : 'Не найден, рекомендуется'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
