import { formatFileSize } from './formatFileSize'

export const ACCEPTED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'] as const
export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024

export type FileValidationIssue = {
  fileName: string
  message: string
}

export function getFileExtension(fileName: string) {
  const extensionStart = fileName.lastIndexOf('.')

  if (extensionStart === -1) {
    return ''
  }

  return fileName.slice(extensionStart).toLowerCase()
}

export function validateFiles(files: File[]) {
  const issues: FileValidationIssue[] = []
  const seenNames = new Set<string>()

  for (const file of files) {
    const extension = getFileExtension(file.name)
    const normalizedName = file.name.toLowerCase()

    if (!ACCEPTED_FILE_EXTENSIONS.includes(extension as (typeof ACCEPTED_FILE_EXTENSIONS)[number])) {
      issues.push({
        fileName: file.name,
        message: `Недопустимый формат. Разрешены: ${ACCEPTED_FILE_EXTENSIONS.join(', ')}`,
      })
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      issues.push({
        fileName: file.name,
        message: `Файл больше ${formatFileSize(MAX_FILE_SIZE_BYTES)}`,
      })
    }

    if (seenNames.has(normalizedName)) {
      issues.push({
        fileName: file.name,
        message: 'Файл с таким именем уже выбран',
      })
    }

    seenNames.add(normalizedName)
  }

  return issues
}
