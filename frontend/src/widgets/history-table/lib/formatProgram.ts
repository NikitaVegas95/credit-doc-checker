import type { Program } from '@/entities/check'

const PROGRAM_LABELS: Record<Program, string> = {
  federal: 'Федеральная',
  regional: 'Областная',
}

export function formatProgram(program: Program) {
  return PROGRAM_LABELS[program]
}
