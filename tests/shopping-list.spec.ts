import { test, expect } from '@playwright/test';

test.describe('AirList Shopping List App', () => {
  const uniqueId = () => `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the splash screen to disappear and data to load
    await expect(page.locator('header')).toBeVisible({ timeout: 15000 });
  });

  test('should load the app and show header', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
  });

  test('should toggle dark mode and persist preference', async ({ page }) => {
    const themeButton = page.locator('button[aria-label="Toggle theme"]');
    const html = page.locator('html');
    
    // Toggle to dark
    await themeButton.click();
    await expect(html).toHaveClass(/dark/);

    // Persist check
    await page.reload();
    await expect(page.locator('header')).toBeVisible();
    await expect(html).toHaveClass(/dark/);

    // Toggle back to light
    await themeButton.click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test('should create a new list and it should appear immediately', async ({ page }) => {
    const listName = `List ${uniqueId()}`;
    
    // Open lists panel
    await page.locator('button[aria-label="Open lists"]').click();
    await expect(page.getByText('My Lists')).toBeVisible();

    // Click New list button
    await page.getByRole('button', { name: 'New list', exact: true }).click();
    const input = page.locator('input[placeholder="List name"]');
    await input.fill(listName);
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    // Verify it appears in the sidebar - use filter to find the specific list button
    const listEntry = page.locator('button').filter({ hasText: listName }).first();
    await expect(listEntry).toBeVisible();
    
    // Select it
    await listEntry.click();
    
    // Verify it is active and header/progress bar show it
    await expect(page.getByRole('heading', { name: listName, exact: true }).first()).toBeVisible();
  });

  test('should add an item to a freshly created list', async ({ page }) => {
    const listName = `Fresh ${uniqueId()}`;
    const itemName = `Item ${uniqueId()}`;

    // Create list
    await page.locator('button[aria-label="Open lists"]').click();
    await page.getByRole('button', { name: 'New list', exact: true }).click();
    await page.locator('input[placeholder="List name"]').fill(listName);
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    
    await page.locator('button').filter({ hasText: listName }).first().click();

    // Add item
    const input = page.locator('input[placeholder="Add an item..."]');
    await input.fill(itemName);
    await page.keyboard.press('Enter');

    // Verify item appears
    await expect(page.getByText(itemName)).toBeVisible();
  });

  test('should prevent rapid duplicate item additions', async ({ page }) => {
    const itemName = `Rapid ${uniqueId()}`;
    const input = page.locator('input[placeholder="Add an item..."]');
    
    await input.fill(itemName);
    // Rapidly press Enter multiple times
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(2000);
    
    // Should only have one item with that text
    const items = page.getByText(itemName);
    await expect(items).toHaveCount(1);
  });

  test('should allow renaming a category in the categories tab', async ({ page }) => {
    // Navigate to categories
    await page.getByRole('button', { name: 'Categories' }).click();
    
    // Find first category input and change it
    const catInput = page.locator('input[type="text"]').filter({ has: page.locator('..').filter({ hasText: '' }) }).first();
    const newName = `Cat ${uniqueId()}`;
    
    await catInput.fill(newName);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Reload and verify
    await page.reload();
    await page.getByRole('button', { name: 'Categories' }).click();
    await expect(page.locator(`input[value="${newName}"]`)).toBeVisible();
  });

  test('should update quantity and subtasks in item detail view', async ({ page }) => {
    const itemName = `DTest ${uniqueId()}`;
    const subtaskName = `Sub ${uniqueId()}`;
    
    // Add item
    const input = page.locator('input[placeholder="Add an item..."]');
    await input.fill(itemName);
    await page.keyboard.press('Enter');
    
    // Open detail
    await page.getByText(itemName).click();
    
    // Update quantity
    const plusButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-plus"]') }).last();
    await plusButton.click();
    
    await page.waitForTimeout(500);
    
    // Rename item in detail
    const nameInput = page.locator('input[type="text"]').nth(0);
    const renamedItem = itemName + " v2";
    await nameInput.fill(renamedItem);
    await page.keyboard.press('Enter');
    
    // Add subtask
    const subInput = page.locator('input[placeholder="Add a new subtask…"]');
    await subInput.fill(subtaskName);
    await page.keyboard.press('Enter');
    
    // Verify subtask
    await expect(page.getByText(subtaskName)).toBeVisible();
    
    // Close detail
    await page.locator('button').filter({ has: page.locator('svg[class*="lucide-x"]') }).first().click();
    
    // Verify name updated in main list
    await expect(page.getByText(renamedItem)).toBeVisible();
  });

  test('should switch to custom sort mode when dragging items', async ({ page }) => {
    // Add two items
    await page.locator('input[placeholder="Add an item..."]').fill('Item A');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    await page.locator('input[placeholder="Add an item..."]').fill('Item B');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);

    // Drag Item B above Item A
    const gripB = page.locator('div[data-grip]').last();
    
    await gripB.hover();
    await page.mouse.down();
    await page.mouse.move(0, -100, { steps: 10 });
    await page.mouse.up();
    
    await page.waitForTimeout(1000);
    
    // Sort mode should now be custom (indicated by the sort button being active/accented)
    const sortToggle = page.locator('button[aria-label="Toggle sort"]');
    await expect(sortToggle).toHaveAttribute('style', /var\(--accent-bg\)/);
  });
});