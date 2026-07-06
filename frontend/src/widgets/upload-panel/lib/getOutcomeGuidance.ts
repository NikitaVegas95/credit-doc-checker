import type { CheckStatus } from '@/entities/check'

const OUTCOME_GUIDANCE: Record<CheckStatus, string> = {
  processing: 'Проверка выполняется. Результат появится после обработки документов.',
  approve: 'Пакет готов: можно переходить к заявке в банк.',
  reject: 'Исправьте ошибки в пакете и загрузите документы повторно.',
  manual: 'Перед подачей нужна ручная проверка специалистом.',
}

export function getOutcomeGuidance(status: CheckStatus) {
  return OUTCOME_GUIDANCE[status]
}
