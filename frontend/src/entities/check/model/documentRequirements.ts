import type { CheckDocument, Program } from './types'

export type DocumentRequirementType = 'contract' | 'spec' | 'invoice' | 'act'

export type DocumentRequirement = {
  type: DocumentRequirementType
  label: string
  required: boolean
}

export type DocumentRequirementState = DocumentRequirement & {
  found: boolean
}

const DOCUMENT_REQUIREMENTS: Record<Program, DocumentRequirement[]> = {
  federal: [
    { type: 'contract', label: 'Договор', required: true },
    { type: 'spec', label: 'Спецификация', required: true },
    { type: 'invoice', label: 'Счёт на оплату', required: true },
    { type: 'act', label: 'Акт / УПД', required: true },
  ],
  regional: [
    { type: 'contract', label: 'Договор', required: true },
    { type: 'invoice', label: 'Счёт на оплату', required: true },
    { type: 'act', label: 'Акт / УПД', required: true },
    { type: 'spec', label: 'Спецификация', required: false },
  ],
}

export function getDocumentRequirements(program: Program | '') {
  if (!program) {
    return []
  }

  return DOCUMENT_REQUIREMENTS[program]
}

export function getDocumentRequirementStates(program: Program, documents: CheckDocument[]) {
  const detectedTypes = new Set(documents.map((document) => document.detected_type))

  return DOCUMENT_REQUIREMENTS[program].map<DocumentRequirementState>((requirement) => ({
    ...requirement,
    found: detectedTypes.has(requirement.type),
  }))
}
