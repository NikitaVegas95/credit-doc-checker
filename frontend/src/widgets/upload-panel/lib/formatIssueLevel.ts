export function formatIssueLevel(level: 'error' | 'warning') {
  return level === 'error' ? 'Ошибка' : 'Предупреждение'
}
