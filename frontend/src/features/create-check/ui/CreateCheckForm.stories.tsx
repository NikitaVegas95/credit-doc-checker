import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { CreateCheckForm } from './CreateCheckForm'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const meta = {
  title: 'features/CreateCheckForm',
  component: CreateCheckForm,
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
          'Форма создания проверки документов. Управление полями реализовано через React Hook Form, отправка в mock API - через TanStack Query mutation.',
      },
    },
  },
  argTypes: {
    onSuccess: {
      description:
        'Callback успешной проверки. Получает полный `CheckResult` из API и используется родительским виджетом для отображения результата.',
      table: {
        type: { summary: '(result: CheckResult) => void' },
      },
    },
  },
} satisfies Meta<typeof CreateCheckForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

Default.parameters = {
  docs: {
    description: {
      story:
        'Базовое состояние формы. Кнопка запуска включается после выбора программы и добавления хотя бы одного файла.',
    },
  },
}
