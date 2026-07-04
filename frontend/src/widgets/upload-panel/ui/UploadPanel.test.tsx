import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren, ReactElement } from 'react'
import { useCreateCheckFormStore } from '@/features/create-check/model/createCheckFormStore'

import { UploadPanel } from './UploadPanel'

function renderWithQueryProvider(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  })

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper })
}

describe('UploadPanel', () => {
  beforeEach(() => {
    useCreateCheckFormStore.getState().reset()
  })

  it('renders upload scenario heading and form controls', () => {
    renderWithQueryProvider(<UploadPanel />)

    expect(screen.getByRole('heading', { name: 'Новая проверка' })).toBeInTheDocument()
    expect(screen.getByText('Загрузите документы и выберите льготную программу.')).toBeInTheDocument()
    expect(screen.getByLabelText('Льготная программа')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Запустить проверку' })).toBeInTheDocument()
  })
})
