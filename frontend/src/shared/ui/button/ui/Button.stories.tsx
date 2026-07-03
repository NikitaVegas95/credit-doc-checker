import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './Button'

const meta = {
  title: 'shared/ui/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Базовая кнопка приложения. Оборачивает нативный `button`, принимает все стандартные HTML-атрибуты кнопки и добавляет единый визуальный стиль.',
      },
    },
  },
  args: {
    children: 'Запустить проверку',
    type: 'button',
    disabled: false,
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'Содержимое кнопки: текст, иконка или любой ReactNode.',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    className: {
      control: 'text',
      description:
        'Дополнительный CSS-класс. Добавляется рядом с базовым классом кнопки и нужен для точечной композиции стилей.',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: 'boolean',
      description:
        'Отключает кнопку и включает disabled-состояние: приглушённый цвет и запрет клика.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description:
        'Нативный тип кнопки. Для действий вне формы безопаснее использовать `button`, для отправки формы - `submit`.',
      table: {
        type: { summary: "'button' | 'submit' | 'reset'" },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Обработчик клика. Получает стандартное событие кнопки.',
      table: {
        type: { summary: 'MouseEventHandler<HTMLButtonElement>' },
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Submit: Story = {
  args: {
    children: 'Отправить',
    type: 'submit',
  },
  parameters: {
    docs: {
      description: {
        story: 'Вариант для отправки формы. Используйте, когда кнопка находится внутри `form`.',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Disabled-состояние для недоступного действия, например пока пользователь не выбрал программу или файлы.',
      },
    },
  },
}
