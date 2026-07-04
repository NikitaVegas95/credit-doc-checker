import { expect, test } from '@playwright/test'

test('opens check page and shows disabled submit before files are selected', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Проверка льготных кредитов' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Новая проверка' })).toBeVisible()
  await expect(page.getByLabel('Льготная программа')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Запустить проверку' })).toBeDisabled()
})

test('submits documents and renders check result', async ({ page }) => {
  await page.route('**/api/checks', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: {
        check_id: 'e2e-1',
        program: 'federal',
        status: 'approve',
        status_label: 'Можно заявлять в банк',
        reason: 'Пакет документов соответствует требованиям выбранной программы.',
        issues: [],
        documents: [
          {
            name: 'договор.pdf',
            detected_type: 'contract',
            size_kb: 1,
          },
        ],
        extracted: {
          contractor: 'ООО «ТехАгро»',
          inn: '7701234567',
          amount: '450 000 ₽',
          date: '15.03.2025',
          subject: 'Поставка минеральных удобрений',
        },
        checked_at: '2026-07-03T00:00:00.000Z',
      },
    })
  })

  await page.goto('/')
  await page.getByLabel('Льготная программа').selectOption('federal')
  await page
    .getByLabel('Перетащите файлы сюда или выберите на компьютере')
    .setInputFiles({
      name: 'договор.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('contract'),
    })

  await expect(page.getByRole('button', { name: 'Запустить проверку' })).toBeEnabled()

  await page.getByRole('button', { name: 'Запустить проверку' }).click()

  await expect(page.getByRole('heading', { name: 'Результат проверки' })).toBeVisible()
  await expect(page.getByText('Можно заявлять в банк')).toBeVisible()
  await expect(page.getByText('ООО «ТехАгро»')).toBeVisible()
})

test('navigates between check and history pages', async ({ page }) => {
  await page.route('**/api/checks', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: [
        {
          check_id: 'history-1',
          program: 'federal',
          status: 'manual',
          status_label: 'Требуется ручная проверка',
          doc_count: 5,
          checked_at: '2026-07-03T00:00:00.000Z',
        },
      ],
    })
  })

  await page.goto('/')

  await page.getByRole('link', { name: 'История' }).click()

  await expect(page).toHaveURL('/history')
  await expect(page.getByRole('heading', { name: 'История' })).toBeVisible()
  await expect(page.getByText('history-1')).toBeVisible()

  await page.getByRole('link', { name: 'Проверка' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Новая проверка' })).toBeVisible()
})

test('redirects unknown route to check page', async ({ page }) => {
  await page.goto('/unknown')

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Новая проверка' })).toBeVisible()
})
