import type { Meta, StoryObj } from '@storybook/react-vite'

import { HistoryTable } from './HistoryTable'

const meta = {
  title: 'widgets/HistoryTable',
  component: HistoryTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Виджет истории проверок. В текущей реализации показывает empty-state и не принимает props. Позже должен загружать данные из `GET /api/checks`, поддерживать фильтр по статусу и переход к деталям проверки.',
      },
    },
  },
} satisfies Meta<typeof HistoryTable>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {}

Empty.parameters = {
  docs: {
    description: {
      story:
        'Пустое состояние истории до появления выполненных проверок или до подключения загрузки из mock API.',
    },
  },
}
