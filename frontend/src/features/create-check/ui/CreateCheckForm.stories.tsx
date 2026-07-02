import type { Meta, StoryObj } from '@storybook/react-vite'

import { CreateCheckForm } from './CreateCheckForm'

const meta = {
  title: 'features/CreateCheckForm',
  component: CreateCheckForm,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof CreateCheckForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

