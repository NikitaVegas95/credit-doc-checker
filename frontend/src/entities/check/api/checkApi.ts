import axios from 'axios'
import { getApiUrl } from '@/shared/api/http'
import { ApiRequestError } from '@/shared/lib/errors'

import type { CheckResult, CheckSummary, Program } from '../model/types'

type CreateCheckOptions = {
  onUploadProgress?: (progress: number) => void
}

function getErrorMessage(data: unknown, fallback: string) {
  if (data && typeof data === 'object') {
    if ('detail' in data && typeof data.detail === 'string') {
      return data.detail
    }

    if ('message' in data && typeof data.message === 'string') {
      return data.message
    }
  }

  return fallback
}

async function readFetchError(response: Response, fallback: string) {
  try {
    return getErrorMessage(await response.json(), fallback)
  } catch {
    return fallback
  }
}

export async function createCheck(program: Program, files: File[], options: CreateCheckOptions = {}) {
  const formData = new FormData()

  formData.append('program', program)
  files.forEach((file) => formData.append('files', file))

  try {
    const response = await axios.post<CheckResult>(getApiUrl('/api/checks'), formData, {
      onUploadProgress: (event) => {
        if (!event.total) {
          return
        }

        const progress = Math.round((event.loaded / event.total) * 100)
        options.onUploadProgress?.(progress)
      },
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiRequestError(
        getErrorMessage(error.response?.data, 'Не удалось запустить проверку документов.'),
        error.response?.status,
      )
    }

    throw new ApiRequestError('Не удалось запустить проверку документов.')
  }
}

export async function getChecks() {
  const response = await fetch(getApiUrl('/api/checks'))

  if (!response.ok) {
    throw new ApiRequestError(
      await readFetchError(response, 'Не удалось загрузить историю проверок.'),
      response.status,
    )
  }

  return response.json() as Promise<CheckSummary[]>
}

export async function getCheck(checkId: string) {
  const response = await fetch(getApiUrl(`/api/checks/${checkId}`))

  if (!response.ok) {
    throw new ApiRequestError(
      await readFetchError(response, 'Не удалось загрузить детали проверки.'),
      response.status,
    )
  }

  return response.json() as Promise<CheckResult>
}

export async function deleteCheck(checkId: string) {
  const response = await fetch(getApiUrl(`/api/checks/${checkId}`), {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new ApiRequestError(
      await readFetchError(response, 'Не удалось удалить проверку.'),
      response.status,
    )
  }
}
