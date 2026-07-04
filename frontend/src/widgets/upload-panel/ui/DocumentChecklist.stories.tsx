import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CheckResult } from '@/entities/check'

import { DocumentChecklist } from './DocumentChecklist'

const fullResult: CheckResult = {
  check_id: 'check-approve',
  checked_at: '2026-07-03T00:00:00.000Z',
  documents: [
    { detected_type: 'contract', name: 'договор.pdf', size_kb: 120 },
    { detected_type: 'specification', name: 'спецификация.pdf', size_kb: 80 },
    { detected_type: 'invoice', name: 'счет.pdf', size_kb: 64 },
    { detected_type: 'closing', name: 'акт.pdf', size_kb: 96 },
  ],
  extracted: {
    amount: '450 000 ₽',
    contractor: 'ООО «ТехАгро»',
    date: '15.03.2025',
    inn: '7701234567',
    subject: 'Поставка минеральных удобрений',
  },
  issues: [],
  program: 'federal',
  reason: 'Пакет документов соответствует требованиям выбранной программы.',
  status: 'approve',
  status_label: 'Можно заявлять в банк',
}

const partialResult: CheckResult = {
  ...fullResult,
  check_id: 'check-reject',
  documents: [{ detected_type: 'contract', name: 'договор.pdf', size_kb: 120 }],
  issues: [
    {
      level: 'error',
      message: 'Отсутствует обязательный документ: счёт на оплату',
    },
  ],
  reason: 'В пакете отсутствуют обязательные документы.',
  status: 'reject',
  status_label: 'Нельзя заявлять в банк',
}

const meta = {
  title: 'widgets/DocumentChecklist',
  component: DocumentChecklist,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Чеклист состава пакета после проверки. Сравнивает требования выбранной программы с документами, которые backend распознал в результате проверки.',
      },
    },
  },
  argTypes: {
    result: {
      description:
        'Полный результат проверки. Компонент использует `program` и `documents`, чтобы посчитать найденные и отсутствующие документы.',
      table: {
        type: { summary: 'CheckResult' },
      },
    },
  },
} satisfies Meta<typeof DocumentChecklist>

export default meta

type Story = StoryObj<typeof meta>

export const CompletePackage: Story = {
  args: {
    result: fullResult,
  },
  parameters: {
    docs: {
      description: {
        story: 'Все обязательные документы найдены.',
      },
    },
  },
}

export const MissingDocuments: Story = {
  args: {
    result: partialResult,
  },
  parameters: {
    docs: {
      description: {
        story: 'Часть обязательных документов не найдена, пользователь видит конкретные пробелы пакета.',
      },
    },
  },
}
