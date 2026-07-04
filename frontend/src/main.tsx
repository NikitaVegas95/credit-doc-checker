import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/app'
import { QueryProvider } from '@/app/providers/query'
import '@/app/styles/global.css'

createRoot(document.getElementById('root')!).render(
  <QueryProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryProvider>,
)
