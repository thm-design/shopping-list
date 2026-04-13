import { test, expect } from '@playwright/test';

test.describe('AirList Shopping List App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3500);
  });

  test('should load the app with title', async ({ page }) => {
    await expect(page.locator('h1:has-text("AirList")')).toBeVisible({ timeout: 10000 });
  });

  test('should have dark mode toggle', async ({ page }) => {
    const themeButton = page.locator('header button').first();
    await expect(themeButton).toBeVisible({ timeout: 5000 });
  });

  test('should toggle dark mode', async ({ page }) => {
    const themeButton = page.locator('header button').first();
    await expect(themeButton).toBeVisible({ timeout: 5000 });
    
    const html = page.locator('html');
    const isDarkInitial = await html.evaluate(el => el.classList.contains('dark'));
    await themeButton.click();
    await page.waitForTimeout(200);
    const isDarkAfter = await html.evaluate(el => el.classList.contains('dark'));
    expect(isDarkAfter).not.toBe(isDarkInitial);
  });

  test('should show bottom navigation', async ({ page }) => {
    const nav = page.locator('nav.fixed.bottom-0');
    await expect(nav).toBeVisible({ timeout: 5000 });
    
    const buttons = page.locator('nav button');
    await expect(buttons).toHaveCount(3, { timeout: 3000 });
  });

  test('should have floating action button', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const fab = page.locator('.fixed.bottom-24');
    await expect(fab).toBeVisible({ timeout: 5000 });
  });
});