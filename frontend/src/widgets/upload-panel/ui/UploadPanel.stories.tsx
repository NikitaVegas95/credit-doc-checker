import type { Meta, StoryObj } from '@storybook/react-vite'

import { UploadPanel } from './UploadPanel'

const meta = {
  title: 'widgets/UploadPanel',
  component: UploadPanel,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof UploadPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

