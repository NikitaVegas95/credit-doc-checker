import { getApiUrl } from '@/shared/api/http'

import type { CheckResult, CheckSummary, Program } from '../model/types'

export async function createCheck(program: Program, files: File[]) {
  const formData = new FormData()

  formData.append('program', program)
  files.forEach((file) => formData.append('files', file))

  const response = await fetch(getApiUrl('/api/checks'), {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Не удалось запустить проверку документов.')
  }

  return response.json() as Promise<CheckResult>
}

export async function getChecks() {
  const response = await fetch(getApiUrl('/api/checks'))

  if (!response.ok) {
    throw new Error('Не удалось загрузить историю проверок.')
  }

  return response.json() as Promise<CheckSummary[]>
}

export async function getCheck(checkId: string) {
  const response = await fetch(getApiUrl(`/api/checks/${checkId}`))

  if (!response.ok) {
    throw new Error('Не удалось загрузить детали проверки.')
  }

  return response.json() as Promise<CheckResult>
}

export async function deleteCheck(checkId: string) {
  const response = await fetch(getApiUrl(`/api/checks/${checkId}`), {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Не удалось удалить проверку.')
  }
}
