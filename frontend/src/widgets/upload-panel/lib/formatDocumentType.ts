const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  act: 'акт / УПД',
  closing: 'закрывающий документ',
  contract: 'договор',
  invoice: 'счёт на оплату',
  spec: 'спецификация',
  unknown: 'не определён',
}

export function formatDocumentType(documentType: string) {
  return DOCUMENT_TYPE_LABELS[documentType] ?? documentType
}
