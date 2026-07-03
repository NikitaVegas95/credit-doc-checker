import type { Meta, StoryObj } from '@storybook/react-vite'

import { UploadPanel } from './UploadPanel'

const meta = {
  title: 'widgets/UploadPanel',
  component: UploadPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Виджет страницы новой проверки. Объединяет заголовок сценария и форму `CreateCheckForm`. Компонент не принимает props и служит композиционным блоком страницы.',
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
