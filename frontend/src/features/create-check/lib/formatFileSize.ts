export function formatFileSize(sizeBytes: number) {
  return `${Math.max(Math.round(sizeBytes / 1024), 1)} КБ`
}
