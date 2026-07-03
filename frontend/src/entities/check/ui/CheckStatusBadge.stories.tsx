import type { Meta, StoryObj } from '@storybook/react-vite'

import { CheckStatusBadge } from './CheckStatusBadge'

const meta = {
  title: 'entities/check/CheckStatusBadge',
  component: CheckStatusBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Бейдж результата проверки документов. Цвет выбирается по машинному статусу, а отображаемый текст передаётся отдельно через `label`.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['approve', 'reject', 'manual'],
      description:
        'Машинный статус проверки. Определяет визуальный тон бейджа: success, danger или warning.',
      table: {
        type: { summary: "'approve' | 'reject' | 'manual'" },
      },
    },
    label: {
      control: 'text',
      description:
        'Человекочитаемая подпись статуса. Обычно приходит из API в поле `status_label`.',
      table: {
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof CheckStatusBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Approve: Story = {
  args: {
    status: 'approve',
    label: 'Можно заявлять в банк',
  },
  parameters: {
    docs: {
      description: {
        story: 'Положительный результат: пакет документов можно заявлять в банк.',
      },
    },
  },
}

export const Reject: Story = {
  args: {
    status: 'reject',
    label: 'Нельзя заявлять в банк',
  },
  parameters: {
    docs: {
      description: {
        story: 'Отрицательный результат: в пакете есть ошибки, например отсутствует обязательный документ.',
      },
    },
  },
}

export const Manual: Story = {
  args: {
    status: 'manual',
    label: 'Требуется ручная проверка',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Промежуточный результат: критичных ошибок нет, но есть предупреждения для ручной проверки.',
      },
    },
  },
}
