import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { MainLayout } from './MainLayout'

const meta = {
  title: 'app/layouts/main-layout/MainLayout',
  component: MainLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Основной layout приложения. Задаёт ширину, вертикальные отступы, шапку `AppHeader` и место для вложенного маршрута через `Outlet`. Компонент не принимает props и используется как родительский route element.',
      },
    },
  },
} satisfies Meta<typeof MainLayout>

export default meta

type Story = StoryObj<typeof meta>

export const WithCheckContent: Story = {
  render: () => (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <section style={{ padding: 20, border: '1px dashed #c8d2e0', borderRadius: 8 }}>
                Контент вложенного маршрута
              </section>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Пример layout с контентом вложенного маршрута. В реальном приложении здесь рендерятся страницы проверки или истории.',
      },
    },
  },
}
