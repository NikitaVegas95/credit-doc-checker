import { expect, test } from '@playwright/test'

test('opens check page and shows disabled submit before files are selected', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Проверка льготных кредитов' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Новая проверка' })).toBeVisible()
  await expect(page.getByLabel('Льготная программа')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Запустить проверку' })).toBeDisabled()
})

test('navigates between check and history pages', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'История' }).click()

  await expect(page).toHaveURL('/history')
  await expect(page.getByRole('heading', { name: 'История' })).toBeVisible()
  await expect(page.getByText('Пока нет данных')).toBeVisible()

  await page.getByRole('link', { name: 'Проверка' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Новая проверка' })).toBeVisible()
})

test('redirects unknown route to check page', async ({ page }) => {
  await page.goto('/unknown')

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Новая проверка' })).toBeVisible()
})
