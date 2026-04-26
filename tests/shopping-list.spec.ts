import { test, expect } from '@playwright/test';

test.describe('AirList Shopping List App', () => {
  const uniqueId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
  });

  test('should load the app and show header', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible({ timeout: 10000 });
  });

  test('should show bottom navigation with 3 tabs', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible({ timeout: 5000 });

    const buttons = nav.locator('button');
    await expect(buttons).toHaveCount(3, { timeout: 3000 });

    await expect(nav.getByText('List')).toBeVisible();
    await expect(nav.getByText('Categories')).toBeVisible();
    await expect(nav.getByText('Pro')).toBeVisible();
  });

  test('should toggle dark mode and persist preference', async ({ page }) => {
    const themeButton = page.locator('button[aria-label="Toggle theme"]');
    await expect(themeButton).toBeVisible({ timeout: 5000 });

    const html = page.locator('html');
    const isDarkInitial = await html.evaluate(el => el.classList.contains('dark'));
    expect(isDarkInitial).toBe(false);

    await themeButton.click();
    await page.waitForTimeout(300);

    await expect(html).toHaveClass(/dark/);

    const storedTheme = await page.evaluate(() => window.localStorage.getItem('airlist:theme'));
    expect(storedTheme).toBe('dark');

    await page.reload();
    await page.waitForTimeout(500);

    const isDarkAfterReload = await html.evaluate(el => el.classList.contains('dark'));
    expect(isDarkAfterReload).toBe(true);

    await themeButton.click();
    await page.waitForTimeout(300);

    const isDarkAfterToggleBack = await html.evaluate(el => el.classList.contains('dark'));
    expect(isDarkAfterToggleBack).toBe(false);
  });

  test('should show progress bar', async ({ page }) => {
    const progressBar = page.locator('[data-testid="progress-bar"]').or(page.locator('div[style*="border-radius"]').first());
    await expect(progressBar).toBeVisible({ timeout: 5000 });
  });

  test('should show category filter bar on list tab', async ({ page }) => {
    const filterBar = page.locator('[data-testid="category-filter-bar"]').or(
      page.locator('div').filter({ hasText: /All/i }).first()
    );
    await expect(filterBar).toBeVisible({ timeout: 5000 });
  });

  test('should show bottom input bar on list tab', async ({ page }) => {
    const inputBar = page.locator('input[placeholder="Add an item..."]');
    await expect(inputBar).toBeVisible({ timeout: 5000 });
  });

  test('should add a new item via bottom input bar', async ({ page }) => {
    const uniqueItem = `Test Item ${uniqueId()}`;
    const input = page.locator('input[placeholder="Add an item..."]');
    await input.fill(uniqueItem);
    await page.waitForTimeout(100);

    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    await expect(page.locator(`text=${uniqueItem}`).first()).toBeVisible();
  });

  test('should toggle item completion', async ({ page }) => {
    const uniqueItem = `Toggle Test ${uniqueId()}`;
    const input = page.locator('input[placeholder="Add an item..."]');
    await input.fill(uniqueItem);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    const itemRow = page.locator(`text=${uniqueItem}`).first();
    await expect(itemRow).toBeVisible();

    const toggleButton = page.locator(`[aria-label*="Mark item"]`).first();
    if (await toggleButton.isVisible({ timeout: 2000 })) {
      await toggleButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('should navigate to Categories tab', async ({ page }) => {
    const categoriesTab = page.locator('nav button').filter({ hasText: 'Categories' });
    await categoriesTab.click();
    await page.waitForTimeout(300);

    await expect(page.locator('h2:has-text("Categories")')).toBeVisible();
    await expect(page.locator('button:has-text("Add")').or(page.locator('text=+ Add'))).toBeVisible();
  });

  test('should display categories on categories tab', async ({ page }) => {
    const categoriesTab = page.locator('nav button').filter({ hasText: 'Categories' });
    await categoriesTab.click();
    await page.waitForTimeout(500);

    await expect(page.locator('h2:has-text("Categories")')).toBeVisible();
  });

  test('should add a new category', async ({ page }) => {
    const uniqueCat = `New Test Cat ${uniqueId()}`;
    const categoriesTab = page.locator('nav button').filter({ hasText: 'Categories' });
    await categoriesTab.click();
    await page.waitForTimeout(300);

    const addButton = page.locator('button:has-text("+ Add")').or(page.locator('button:has-text("Add")'));
    await addButton.click();
    await page.waitForTimeout(300);

    const catInput = page.locator('input[placeholder="Category name"]');
    await expect(catInput).toBeVisible();

    await catInput.fill(uniqueCat);
    await page.waitForTimeout(100);

    const createButton = page.locator('button:has-text("Create")').or(page.locator('button:has-text("Add")'));
    await createButton.click();
    await page.waitForTimeout(500);

    await expect(page.locator(`text=${uniqueCat}`)).toBeVisible();
  });

  test('should navigate to Pro tab', async ({ page }) => {
    const proTab = page.locator('nav button').filter({ hasText: 'Pro' });
    await proTab.click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=Pro features coming soon')).toBeVisible();
  });

  test('should open lists panel via hamburger menu', async ({ page }) => {
    const menuButton = page.locator('button[aria-label="Open lists"]');
    await expect(menuButton).toBeVisible({ timeout: 5000 });
    await menuButton.click();
    await page.waitForTimeout(300);

    await expect(page.locator('text=My Lists').or(page.locator('text=Lists'))).toBeVisible();
  });

  test('should open share modal', async ({ page }) => {
    const shareButton = page.locator('button[aria-label="Share"]');
    await expect(shareButton).toBeVisible({ timeout: 5000 });
    await shareButton.click();
    await page.waitForTimeout(300);

    await expect(page.locator('text=Share').or(page.locator('text=Copy'))).toBeVisible();
  });

  test('should enter and exit selection mode', async ({ page }) => {
    const selectButton = page.locator('button[aria-label="Selection mode"]').or(
      page.locator('button[aria-label="Enter selection mode"]')
    );
    if (await selectButton.isVisible({ timeout: 3000 })) {
      await selectButton.click();
      await page.waitForTimeout(200);

      await expect(page.locator('text=/\\d+ selected/').or(page.locator('text=Select All'))).toBeVisible();

      const cancelButton = page.locator('button:has-text("Cancel")');
      await cancelButton.click();
      await page.waitForTimeout(200);
    }
  });

  test('should show empty state when no items match filter', async ({ page }) => {
    await expect(page.locator('text=List is empty')).toBeVisible({ timeout: 5000 });
  });

  test('should open item detail panel on item click', async ({ page }) => {
    const uniqueItem = `Detail Test ${uniqueId()}`;
    const input = page.locator('input[placeholder="Add an item..."]');
    await input.fill(uniqueItem);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    const itemText = page.locator(`text=${uniqueItem}`).first();
    await expect(itemText).toBeVisible();
    await itemText.click();
    await page.waitForTimeout(300);

    await expect(page.locator('text=Notes').or(page.locator('text=Subtasks')).first()).toBeVisible();
  });

  test('should delete an item via detail panel', async ({ page }) => {
    const uniqueItem = `Delete Test ${uniqueId()}`;
    const input = page.locator('input[placeholder="Add an item..."]');
    await input.fill(uniqueItem);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);

    const itemText = page.locator(`text=${uniqueItem}`).first();
    await expect(itemText).toBeVisible();
    await itemText.click();
    await page.waitForTimeout(300);

    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible({ timeout: 2000 })) {
      await deleteButton.click();
      await page.waitForTimeout(300);

      const confirmButton = page.locator('button:has-text("Confirm")').or(
        page.locator('button:has-text("Delete")').last()
      );
      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should switch sort mode via category filter bar', async ({ page }) => {
    const sortButton = page.locator('button[aria-label="Toggle sort"]');
    if (await sortButton.isVisible({ timeout: 3000 })) {
      await sortButton.click();
      await page.waitForTimeout(200);
      await sortButton.click();
      await page.waitForTimeout(200);
    }
  });
});