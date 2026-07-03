import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'

import { AppHeader } from './AppHeader'

const meta = {
  title: 'app/layouts/main-layout/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Шапка основного layout. Показывает название сценария и навигацию по маршрутам приложения. Компонент не принимает props: ссылки строятся из `navRoutes`, а активное состояние рассчитывает `NavLink` из React Router.',
      },
    },
  },
} satisfies Meta<typeof AppHeader>

export default meta

type Story = StoryObj<typeof meta>

export const CheckRoute: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Состояние шапки на маршруте новой проверки. Активна ссылка “Проверка”.',
      },
    },
  },
}

export const HistoryRoute: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/history']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Состояние шапки на маршруте истории. Активна ссылка “История”.',
      },
    },
  },
}
