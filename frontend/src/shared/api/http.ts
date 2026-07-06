const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export function getApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return API_URL ? `${API_URL}${normalizedPath}` : normalizedPath
}
