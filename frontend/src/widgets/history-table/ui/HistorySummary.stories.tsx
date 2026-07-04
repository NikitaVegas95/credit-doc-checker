import type { Meta, StoryObj } from '@storybook/react-vite'

import { HistorySummary } from './HistorySummary'

const meta = {
  title: 'widgets/HistorySummary',
  component: HistorySummary,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Сводка истории проверок. Показывает общее количество проверок и распределение по итоговым статусам.',
      },
    },
  },
  argTypes: {
    stats: {
      description:
        'Предрасчитанная статистика истории: `total`, `approve`, `reject`, `manual`. Обычно получается из `getHistoryStats(checks)`.',
      table: {
        type: { summary: 'HistoryStats' },
      },
    },
  },
} satisfies Meta<typeof HistorySummary>

export default meta

type Story = StoryObj<typeof meta>

export const WithChecks: Story = {
  args: {
    stats: {
      approve: 7,
      manual: 2,
      reject: 1,
      total: 10,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Сводка для истории с разными результатами проверок.',
      },
    },
  },
}

export const Empty: Story = {
  args: {
    stats: {
      approve: 0,
      manual: 0,
      reject: 0,
      total: 0,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Нулевые значения, когда история ещё пуста.',
      },
    },
  },
}
