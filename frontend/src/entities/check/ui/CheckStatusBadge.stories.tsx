import type { Meta, StoryObj } from '@storybook/react-vite'

import { CheckStatusBadge } from './CheckStatusBadge'

const meta = {
  title: 'entities/check/CheckStatusBadge',
  component: CheckStatusBadge,
} satisfies Meta<typeof CheckStatusBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Approve: Story = {
  args: {
    status: 'approve',
    label: 'Можно заявлять в банк',
  },
}

export const Reject: Story = {
  args: {
    status: 'reject',
    label: 'Нельзя заявлять в банк',
  },
}

export const Manual: Story = {
  args: {
    status: 'manual',
    label: 'Требуется ручная проверка',
  },
}

