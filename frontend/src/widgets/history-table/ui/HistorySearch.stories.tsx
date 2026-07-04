import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { HistorySearch } from './HistorySearch'

const meta = {
  title: 'widgets/HistorySearch',
  component: HistorySearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Поле поиска по истории проверок. В родительском виджете фильтрует записи по ID, статусу, программе и количеству документов.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Текущее значение поисковой строки.',
      table: {
        type: { summary: 'string' },
      },
    },
    onChange: {
      action: 'changed',
      description:
        'Callback изменения строки поиска. Получает уже нормальное строковое значение из input.',
      table: {
        type: { summary: '(value: string) => void' },
      },
    },
  },
} satisfies Meta<typeof HistorySearch>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    onChange: () => undefined,
    value: '',
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value)

    return <HistorySearch value={value} onChange={setValue} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Пустое состояние поиска до ввода пользователя.',
      },
    },
  },
}

export const Filled: Story = {
  args: {
    onChange: () => undefined,
    value: 'manual',
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value)

    return <HistorySearch value={value} onChange={setValue} />
  },
  parameters: {
    docs: {
      description: {
        story: 'Состояние с введённым запросом.',
      },
    },
  },
}
