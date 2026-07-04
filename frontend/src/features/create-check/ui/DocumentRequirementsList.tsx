import { getDocumentRequirements, type Program } from '@/entities/check'

import styles from './CreateCheckForm.module.css'

type DocumentRequirementsListProps = {
  program: Program | ''
}

export function DocumentRequirementsList({ program }: DocumentRequirementsListProps) {
  const requirements = getDocumentRequirements(program)

  if (requirements.length === 0) {
    return (
      <div className={styles.requirements}>
        <h3>Состав пакета</h3>
        <p>Выберите программу, чтобы увидеть список обязательных документов.</p>
      </div>
    )
  }

  return (
    <div className={styles.requirements}>
      <h3>Состав пакета</h3>
      <ul>
        {requirements.map((requirement) => (
          <li key={requirement.type}>
            <span>{requirement.label}</span>
            <span>{requirement.required ? 'Обязательно' : 'Рекомендуется'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
