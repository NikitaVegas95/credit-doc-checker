import type { Meta, StoryObj } from '@storybook/react-vite'

import { HistoryTable } from './HistoryTable'

const meta = {
  title: 'widgets/HistoryTable',
  component: HistoryTable,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof HistoryTable>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {}

