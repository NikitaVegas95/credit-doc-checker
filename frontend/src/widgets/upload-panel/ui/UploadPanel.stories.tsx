import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { UploadPanel } from './UploadPanel'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const meta = {
  title: 'widgets/UploadPanel',
  component: UploadPanel,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Виджет страницы новой проверки. Объединяет заголовок сценария, форму `CreateCheckForm` и результат успешной проверки.',
      },
    },
  },
} satisfies Meta<typeof UploadPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

Default.parameters = {
  docs: {
    description: {
      story:
        'Основной виджет загрузки документов. Используется на странице проверки как первый экран сценария.',
    },
  },
}
