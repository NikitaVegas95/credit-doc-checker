import type { Meta, StoryObj } from '@storybook/react-vite'

import { DocumentRequirementsList } from './DocumentRequirementsList'

const meta = {
  title: 'features/DocumentRequirementsList',
  component: DocumentRequirementsList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Список требований к пакету документов для выбранной льготной программы. Используется в форме перед загрузкой файлов, чтобы пользователь заранее видел обязательные и рекомендуемые документы.',
      },
    },
  },
  argTypes: {
    program: {
      control: 'select',
      options: ['', 'federal', 'regional'],
      description:
        'Выбранная льготная программа. Пустая строка показывает подсказку выбора, `federal` и `regional` отображают состав пакета.',
      table: {
        type: { summary: "Program | ''" },
      },
    },
  },
} satisfies Meta<typeof DocumentRequirementsList>

export default meta

type Story = StoryObj<typeof meta>

export const EmptyProgram: Story = {
  args: {
    program: '',
  },
  parameters: {
    docs: {
      description: {
        story: 'Состояние до выбора программы: компонент объясняет, что список появится после выбора.',
      },
    },
  },
}

export const Federal: Story = {
  args: {
    program: 'federal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Федеральная программа: все документы пакета обязательны.',
      },
    },
  },
}

export const Regional: Story = {
  args: {
    program: 'regional',
  },
  parameters: {
    docs: {
      description: {
        story: 'Областная программа: спецификация отображается как рекомендуемый документ.',
      },
    },
  },
}
