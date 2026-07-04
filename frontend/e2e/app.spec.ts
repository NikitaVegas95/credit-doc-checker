import { expect, test } from '@playwright/test'

test('opens check page and highlights required fields after submit attempt', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Проверка льготных кредитов' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Новая проверка' })).toBeVisible()
  await expect(page.getByLabel('Льготная программа')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Запустить проверку' })).toBeEnabled()

  await page.getByRole('button', { name: 'Запустить проверку' }).click()

  await expect(page.getByText('Выберите льготную программу', { exact: true })).toBeVisible()
  await expect(page.getByText('Добавьте хотя бы один документ для проверки.')).toBeVisible()
})

test('submits documents and renders check result', async ({ page }) => {
  await page.route('**/api/checks', async (route) => {
    await page.waitForTimeout(150)
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
  await expect(page.getByText('Состав пакета')).toBeVisible()
  await expect(page.getByText('Спецификация')).toBeVisible()
  await page
    .getByLabel('Перетащите файлы сюда или выберите на компьютере')
    .setInputFiles({
      name: 'договор.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('contract'),
    })

  await expect(page.getByRole('button', { name: 'Запустить проверку' })).toBeEnabled()
  await expect(page.getByText('Файлы готовы к загрузке')).toBeVisible()

  await page.getByRole('button', { name: 'Запустить проверку' }).click()

  await expect(page.getByText('Загружаем документы')).toBeVisible()
  await expect(page.getByText(/Выполняется запрос/)).toBeVisible()

  await expect(page.getByRole('heading', { name: 'Результат проверки' })).toBeVisible()
  await expect(page.getByText('Проверка состава пакета')).toBeVisible()
  await expect(page.getByText('Можно заявлять в банк')).toBeVisible()
  await expect(page.getByText('ООО «ТехАгро»')).toBeVisible()
})

test('preserves check form state when navigating to history and back', async ({ page }) => {
  await page.route('**/api/checks', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        contentType: 'application/json',
        json: [
          {
            check_id: 'history-keep-1',
            program: 'federal',
            status: 'approve',
            status_label: 'Можно заявлять в банк',
            doc_count: 4,
            checked_at: '2026-07-03T00:00:00.000Z',
          },
        ],
      })
      return
    }

    await page.waitForTimeout(150)
    await route.fulfill({
      contentType: 'application/json',
      json: {
        check_id: 'keep-1',
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
  await page.getByRole('button', { name: 'Запустить проверку' }).click()

  await expect(page.getByRole('heading', { name: 'Результат проверки' })).toBeVisible()

  await page.getByRole('link', { name: 'История' }).click()
  await expect(page).toHaveURL('/history')

  await page.getByRole('link', { name: 'Проверка' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByLabel('Льготная программа')).toHaveValue('federal')
  await expect(page.getByText('договор.pdf', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Результат проверки' })).toBeVisible()
})

test('blocks submit for unsupported file format', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Льготная программа').selectOption('federal')
  await page
    .getByLabel('Перетащите файлы сюда или выберите на компьютере')
    .setInputFiles({
      name: 'notes.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('text'),
    })

  await expect(page.getByText(/Недопустимый формат/)).toBeVisible()
  await expect(page.getByRole('button', { name: 'Запустить проверку' })).toBeEnabled()
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

test('searches checks in history and resets filters', async ({ page }) => {
  await page.route('**/api/checks', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: [
        {
          check_id: 'federal-approve-1',
          program: 'federal',
          status: 'approve',
          status_label: 'Можно заявлять в банк',
          doc_count: 4,
          checked_at: '2026-07-03T00:00:00.000Z',
        },
        {
          check_id: 'regional-manual-1',
          program: 'regional',
          status: 'manual',
          status_label: 'Требуется ручная проверка',
          doc_count: 5,
          checked_at: '2026-07-03T01:00:00.000Z',
        },
      ],
    })
  })

  await page.goto('/history')

  await expect(page.getByText('federal-approve-1')).toBeVisible()
  await expect(page.getByText('regional-manual-1')).toBeVisible()

  await page.getByRole('searchbox', { name: 'Поиск по истории' }).fill('manual')

  await expect(page.getByText('federal-approve-1')).toBeHidden()
  await expect(page.getByText('regional-manual-1')).toBeVisible()

  await page.getByRole('button', { name: 'Сбросить фильтры' }).click()

  await expect(page.getByText('federal-approve-1')).toBeVisible()
  await expect(page.getByText('regional-manual-1')).toBeVisible()
})

test('opens check details from history', async ({ page }) => {
  await page.route('**/api/checks', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: [
        {
          check_id: 'details-1',
          program: 'federal',
          status: 'approve',
          status_label: 'Можно заявлять в банк',
          doc_count: 4,
          checked_at: '2026-07-03T00:00:00.000Z',
        },
      ],
    })
  })
  await page.route('**/api/checks/details-1', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: {
        check_id: 'details-1',
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

  await page.goto('/history')
  await page.getByRole('link', { name: 'Открыть' }).click()

  await expect(page).toHaveURL('/history/details-1')
  await expect(page.getByRole('heading', { name: 'Детали проверки' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Результат проверки' })).toBeVisible()
  await expect(page.getByText('ООО «ТехАгро»')).toBeVisible()
})

test('deletes check from history', async ({ page }) => {
  let isDeleted = false

  await page.route('**/api/checks', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        contentType: 'application/json',
        json: isDeleted
          ? []
          : [
              {
                check_id: 'delete-1',
                program: 'federal',
                status: 'reject',
                status_label: 'Нельзя заявлять в банк',
                doc_count: 2,
                checked_at: '2026-07-03T00:00:00.000Z',
              },
            ],
      })
      return
    }

    await route.fallback()
  })
  await page.route('**/api/checks/delete-1', async (route) => {
    if (route.request().method() === 'DELETE') {
      isDeleted = true
      await route.fulfill({ status: 204 })
      return
    }

    await route.fallback()
  })
  page.on('dialog', (dialog) => dialog.accept())

  await page.goto('/history')
  await expect(page.getByText('delete-1')).toBeVisible()

  await page.getByRole('button', { name: 'Удалить' }).click()

  await expect(page.getByText('delete-1')).toBeHidden()
})

test('redirects unknown route to check page', async ({ page }) => {
  await page.goto('/unknown')

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Новая проверка' })).toBeVisible()
})
