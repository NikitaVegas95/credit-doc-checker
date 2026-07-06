describe('getApiUrl', () => {
  const originalEnv = { ...import.meta.env }

  afterEach(() => {
    vi.unstubAllEnvs()
    Object.assign(import.meta.env, originalEnv)
    vi.resetModules()
  })

  it('normalizes trailing slash in configured API URL', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:8000/')

    const { getApiUrl } = await import('./http')

    expect(getApiUrl('/api/checks')).toBe('http://localhost:8000/api/checks')
    expect(getApiUrl('api/checks')).toBe('http://localhost:8000/api/checks')
  })

  it('falls back to relative API paths without configured API URL', async () => {
    vi.stubEnv('VITE_API_URL', '')

    const { getApiUrl } = await import('./http')

    expect(getApiUrl('/api/checks')).toBe('/api/checks')
    expect(getApiUrl('api/checks')).toBe('/api/checks')
  })
})
