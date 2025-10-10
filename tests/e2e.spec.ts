import { expect, test } from '@playwright/test'

const TITLE_REGEX = /Cursor Commands Explorer/
const HEADING_REGEX = /Master Your Workflow/i
const COMMANDS_URL_REGEX = /\/commands\//
const SEARCH_QUERY_REGEX = /q=go\+to\+definition/
const OS_FILTER_REGEX = /os=mac/
const COMMAND_DETAIL_REGEX = /\/commands\/[^/]+$/
const OPERATING_SYSTEM_REGEX = /Operating System/i

test.describe('Cursor Commands Explorer', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(TITLE_REGEX)
    await expect(
      page.getByRole('heading', { name: HEADING_REGEX }),
    ).toBeVisible()
  })

  test('should navigate to commands page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'View All Commands' }).click()
    await expect(page).toHaveURL(COMMANDS_URL_REGEX)
    await expect(
      page.getByRole('heading', { name: 'Search Commands' }),
    ).toBeVisible()
  })

  test('should search for commands', async ({ page }) => {
    await page.goto('/commands')
    await page.getByPlaceholder('Search commands...').fill('go to definition')
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page).toHaveURL(SEARCH_QUERY_REGEX)
  })

  test('should filter commands by OS', async ({ page }) => {
    await page.goto('/commands')
    await page.getByRole('combobox', { name: OPERATING_SYSTEM_REGEX }).click()
    await page.getByRole('option', { name: 'Mac' }).click()
    await expect(page).toHaveURL(OS_FILTER_REGEX)
  })

  test('should navigate to command detail page', async ({ page }) => {
    await page.goto('/commands')
    const firstCommand = page.locator('[href^="/commands/"]').first()
    await firstCommand.click()
    await expect(page).toHaveURL(COMMAND_DETAIL_REGEX)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
