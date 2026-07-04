import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CheckResult } from '@/entities/check'

import { CheckDetailsSummary } from './CheckDetailsSummary'

const result: CheckResult = {
  check_id: 'details-1',
  checked_at: '2026-07-03T00:00:00.000Z',
  documents: [
    { detected_type: 'contract', name: 'договор.pdf', size_kb: 120 },
    { detected_type: 'invoice', name: 'счет.pdf', size_kb: 64 },
  ],
  extracted: {
    amount: '450 000 ₽',
    contractor: 'ООО «ТехАгро»',
    date: '15.03.2025',
    inn: '7701234567',
    subject: 'Поставка минеральных удобрений',
  },
  issues: [
    {
      level: 'warning',
      message: 'Не удалось определить тип документа: scan0041.jpg',
    },
  ],
  program: 'regional',
  reason: 'Пакет документов требует дополнительной проверки специалиста.',
  status: 'manual',
  status_label: 'Требуется ручная проверка',
}

const meta = {
  title: 'pages/CheckDetailsSummary',
  component: CheckDetailsSummary,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Верхняя сводка страницы деталей проверки. Собирает ключевые метаданные результата и быстрый доступ к скачиванию JSON-отчёта.',
      },
    },
  },
  argTypes: {
    result: {
      description:
        'Полный результат проверки из `GET /api/checks/{check_id}`. Используется для отображения ID, даты, программы, статуса, документов и количества замечаний.',
      table: {
        type: { summary: 'CheckResult' },
      },
    },
  },
} satisfies Meta<typeof CheckDetailsSummary>

export default meta

type Story = StoryObj<typeof meta>

export const ManualReview: Story = {
  args: {
    result,
  },
  parameters: {
    docs: {
      description: {
        story: 'Сводка проверки, которая требует ручного решения из-за предупреждения.',
      },
    },
  },
}

export const Approved: Story = {
  args: {
    result: {
      ...result,
      documents: [
        ...result.documents,
        { detected_type: 'specification', name: 'спецификация.pdf', size_kb: 80 },
        { detected_type: 'closing', name: 'акт.pdf', size_kb: 96 },
      ],
      issues: [],
      program: 'federal',
      reason: 'Пакет документов соответствует требованиям выбранной программы.',
      status: 'approve',
      status_label: 'Можно заявлять в банк',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Положительный результат без ошибок и предупреждений.',
      },
    },
  },
}
