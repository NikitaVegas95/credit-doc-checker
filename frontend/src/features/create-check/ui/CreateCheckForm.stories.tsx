import type { Meta, StoryObj } from '@storybook/react-vite'

import { CreateCheckForm } from './CreateCheckForm'

const meta = {
  title: 'features/CreateCheckForm',
  component: CreateCheckForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Форма создания проверки. Сейчас компонент не принимает props: он рендерит выбор льготной программы, поле выбора файлов и disabled-кнопку запуска. На следующем этапе сюда будет подключено состояние формы и отправка в API.',
      },
    },
  },
  argTypes: {
    children: {
      table: {
        disable: true,
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
        'Базовое состояние формы до подключения интерактива. Кнопка запуска намеренно отключена, потому что сценарий отправки ещё не реализован.',
    },
  },
}
