import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/app'
import { UiErrorBoundary } from '@/app/providers/error-boundaries'
import { QueryProvider } from '@/app/providers/query'
import '@/app/styles/global.css'

createRoot(document.getElementById('root')!).render(
  <UiErrorBoundary>
    <QueryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryProvider>
  </UiErrorBoundary>,
)
