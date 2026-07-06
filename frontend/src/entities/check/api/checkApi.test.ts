import axios from 'axios'
import { ApiRequestError } from '@/shared/lib/errors'

import { createCheck, getChecks } from './checkApi'

vi.mock('axios', () => ({
  default: {
    isAxiosError: vi.fn(),
    post: vi.fn(),
  },
}))

describe('checkApi', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('preserves backend message for axios create errors', async () => {
    vi.mocked(axios.isAxiosError).mockReturnValue(true)
    vi.mocked(axios.post).mockRejectedValue({
      response: {
        data: { detail: 'Файл слишком большой' },
        status: 413,
      },
    })

    await expect(createCheck('federal', [])).rejects.toMatchObject({
      message: 'Файл слишком большой',
      status: 413,
    } satisfies Partial<ApiRequestError>)
  })

  it('preserves backend message for fetch errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ detail: 'История недоступна' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 503,
      }),
    )

    await expect(getChecks()).rejects.toMatchObject({
      message: 'История недоступна',
      status: 503,
    } satisfies Partial<ApiRequestError>)
  })
})
