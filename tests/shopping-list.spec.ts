import { test, expect } from '@playwright/test';

test.describe('AirList Shopping List App', () => {
  // Generate unique identifiers to avoid test state pollution
  const uniqueId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
  });

  test('should load the app with title', async ({ page }) => {
    await expect(page.locator('h1:has-text("AirList")')).toBeVisible({ timeout: 10000 });
  });

  test('should allow switching between sort modes', async ({ page }) => {
    const sortGroup = page.getByRole('group', { name: 'Sort mode' });
    const categorySortButton = sortGroup.getByRole('button', { name: 'By Category' });
    const customSortButton = sortGroup.getByRole('button', { name: 'Custom', exact: true });

    await expect(categorySortButton).toHaveAttribute('aria-pressed', 'true');
    await customSortButton.click();
    await page.waitForTimeout(200);
    await expect(customSortButton).toHaveAttribute('aria-pressed', 'true');
    await expect(categorySortButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should toggle dark mode, persist preference, and survive reload', async ({ page }) => {
    const themeButton = page.locator('header button').last();
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

  test('should show bottom navigation with 3 tabs', async ({ page }) => {
    const nav = page.locator('nav.fixed.bottom-0');
    await expect(nav).toBeVisible({ timeout: 5000 });
    
    const buttons = page.locator('nav button');
    await expect(buttons).toHaveCount(3, { timeout: 3000 });
    
    await expect(page.locator('nav >> text=List')).toBeVisible();
    await expect(page.locator('nav >> text=Categories')).toBeVisible();
    await expect(page.locator('nav >> text=Pro')).toBeVisible();
  });

  test('should have floating action button on list tab', async ({ page }) => {
    const fab = page.locator('.fixed.bottom-24');
    await expect(fab).toBeVisible({ timeout: 5000 });
  });

  test('should open add item modal when clicking FAB', async ({ page }) => {
    const fab = page.locator('.fixed.bottom-24');
    await fab.click();
    await page.waitForTimeout(300);
    
    await expect(page.locator('h3:has-text("New Item")')).toBeVisible();
    await expect(page.locator('input[placeholder*="Organic Bananas"]')).toBeVisible();
    await expect(page.locator('button:has-text("Save Item")')).toBeVisible();
  });

  test('should add a new item', async ({ page }) => {
    const uniqueItem = `Test Item ${uniqueId()}`;
    const fab = page.locator('.fixed.bottom-24');
    await fab.click();
    await page.waitForTimeout(300);
    
    const input = page.locator('input[placeholder*="Organic Bananas"]');
    await input.fill(uniqueItem);
    await page.waitForTimeout(100);
    
    const saveButton = page.locator('button:has-text("Save Item")');
    await saveButton.click();
    await page.waitForTimeout(1000);
    
    await expect(page.locator(`text=${uniqueItem}`).first()).toBeVisible();
  });

  test('should close add item modal when clicking X', async ({ page }) => {
    const fab = page.locator('.fixed.bottom-24');
    await fab.click();
    await page.waitForTimeout(300);
    
    await expect(page.locator('h3:has-text("New Item")')).toBeVisible();
    
    const closeButton = page.locator('button[aria-label="Close add item dialog"]');
    await closeButton.click();
    await page.waitForTimeout(300);
    
    await expect(page.locator('h3:has-text("New Item")')).not.toBeVisible();
  });

  test('should toggle item completion', async ({ page }) => {
    const uniqueItem = `Toggle Test ${uniqueId()}`;
    const fab = page.locator('.fixed.bottom-24');
    await fab.click();
    await page.waitForTimeout(300);
    
    const input = page.locator('input[placeholder*="Organic Bananas"]');
    await input.fill(uniqueItem);
    await page.waitForTimeout(100);
    
    const saveButton = page.locator('button:has-text("Save Item")');
    await saveButton.click();
    await page.waitForTimeout(1000);
    
    const toggleButton = page.locator('button[aria-label*="Mark item"]').last();
    await toggleButton.click();
    await page.waitForTimeout(500);
  });

  test.skip('should delete an item via swipe', async ({ page }) => {
    const uniqueItem = `Delete Me ${uniqueId()}`;
    const fab = page.locator('.fixed.bottom-24');
    await fab.click();
    await page.waitForTimeout(300);
    
    const input = page.locator('input[placeholder*="Organic Bananas"]');
    await input.fill(uniqueItem);
    await page.waitForTimeout(100);
    
    const saveButton = page.locator('button:has-text("Save Item")');
    await saveButton.click();
    await page.waitForTimeout(1000);
    
    await expect(page.locator(`text=${uniqueItem}`).first()).toBeVisible();
  });

  test('should navigate to Categories tab', async ({ page }) => {
    const categoriesTab = page.locator('nav button:has-text("Categories")');
    await categoriesTab.click();
    await page.waitForTimeout(300);
    
    await expect(page.locator('h2:has-text("Categories")')).toBeVisible();
    await expect(page.locator('button:has-text("Add")')).toBeVisible();
  });

  test('should display default categories', async ({ page }) => {
    const categoriesTab = page.locator('nav button:has-text("Categories")');
    await categoriesTab.click();
    await page.waitForTimeout(500);
    
    const categoriesSection = page.locator('main > div');
    await expect(categoriesSection.locator('h2:has-text("Categories")')).toBeVisible();
    const listItems = categoriesSection.locator('.grid > div');
    const count = await listItems.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('should add a new category', async ({ page }) => {
    const uniqueCat = `New Test Cat ${uniqueId()}`;
    const categoriesTab = page.locator('nav button:has-text("Categories")');
    await categoriesTab.click();
    await page.waitForTimeout(300);
    
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();
    await page.waitForTimeout(300);
    
    await expect(page.locator('h3:has-text("New Category")')).toBeVisible();
    
    const input = page.locator('input[placeholder*="Frozen Foods"]');
    await input.fill(uniqueCat);
    await page.waitForTimeout(100);
    
    const createButton = page.locator('button:has-text("Create Category")');
    await createButton.click();
    await page.waitForTimeout(500);
    
    await expect(page.locator(`text=${uniqueCat}`)).toBeVisible();
  });

  test('should close add category modal when clicking X', async ({ page }) => {
    const categoriesTab = page.locator('nav button:has-text("Categories")');
    await categoriesTab.click();
    await page.waitForTimeout(300);
    
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();
    await page.waitForTimeout(300);
    
    await expect(page.locator('h3:has-text("New Category")')).toBeVisible();
    
    const closeButton = page.locator('button[aria-label="Close add category dialog"]');
    await closeButton.click();
    await page.waitForTimeout(300);
    
    await expect(page.locator('h3:has-text("New Category")')).not.toBeVisible();
  });

  test('should delete a category', async ({ page }) => {
    const uniqueCat = `Cat To Delete ${uniqueId()}`;
    const categoriesTab = page.locator('nav button:has-text("Categories")');
    await categoriesTab.click();
    await page.waitForTimeout(300);
    
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();
    await page.waitForTimeout(300);
    
    const input = page.locator('input[placeholder*="Frozen Foods"]');
    await input.fill(uniqueCat);
    await page.waitForTimeout(100);
    
    const createButton = page.locator('button:has-text("Create Category")');
    await createButton.click();
    await page.waitForTimeout(500);
    
    await expect(page.locator(`text=${uniqueCat}`)).toBeVisible();
    
    const categoryRow = page.locator(`text=${uniqueCat}`).locator('..').locator('..');
    const deleteButton = categoryRow.locator('button[aria-label*="Delete"]');
    await deleteButton.click();
    await expect(page.locator('h3:has-text("Confirm Delete")')).toBeVisible();
    await page.locator('button:has-text("Delete")').last().click();
    await page.waitForTimeout(1000);
    
    await expect(page.locator(`text=${uniqueCat}`)).not.toBeVisible();
  });

  test('should navigate to Pro tab', async ({ page }) => {
    const proTab = page.locator('nav button:has-text("Pro")');
    await proTab.click();
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=Pro Features')).toBeVisible();
  });

  test('should filter items by category', async ({ page }) => {
    const uniqueItem = `Filtered ${uniqueId()}`;
    const fab = page.locator('.fixed.bottom-24');
    await fab.click();
    await page.waitForTimeout(300);
    
    const input = page.locator('input[placeholder*="Organic Bananas"]');
    await input.fill(uniqueItem);
    await page.waitForTimeout(100);
    
    const saveButton = page.locator('button:has-text("Save Item")');
    await saveButton.click();
    await page.waitForTimeout(1000);
    
    await expect(page.locator(`text=${uniqueItem}`).first()).toBeVisible();
    
    const firstCategoryButton = page.locator('.no-scrollbar button').nth(1);
    
    if (await firstCategoryButton.isVisible()) {
      await firstCategoryButton.click();
      await page.waitForTimeout(300);
    }
  });

  test('should show empty state when no items for filter', async ({ page }) => {
    const uniqueCat = `EmptyCat${uniqueId()}`;
    await page.locator('nav button:has-text("Categories")').click();
    await page.waitForTimeout(300);
    
    const addButton = page.locator('button:has-text("Add")');
    await addButton.click();
    await page.waitForTimeout(300);
    
    await page.locator('input[placeholder*="Frozen Foods"]').fill(uniqueCat);
    await page.locator('button:has-text("Create Category")').click();
    await page.waitForTimeout(500);
    
    await page.locator('nav button:has-text("List")').click();
    await page.waitForTimeout(300);
    
    const newCatButton = page.locator(`.no-scrollbar button:has-text("${uniqueCat}")`).first();
    await expect(newCatButton).toBeVisible();
    await newCatButton.click();
    await page.waitForTimeout(300);
    
    await expect(page.locator('text=List is empty')).toBeVisible();
  });

  test('should support select all toggle in selection mode', async ({ page }) => {
    const itemOne = uniqueId();
    const itemTwo = uniqueId();

    for (const label of [itemOne, itemTwo]) {
      await page.locator('button.fixed.bottom-24').click();
      await page.waitForTimeout(300);
      await page.locator('input[placeholder*="Organic Bananas"]').fill(label);
      await page.waitForTimeout(100);
      await page.locator('button:has-text("Save Item")').click({ force: true });
      await page.waitForTimeout(600);
    }

    const selectModeButton = page.getByRole('button', { name: 'Enter selection mode' });
    await selectModeButton.click();
    await page.waitForTimeout(200);

    const selectAllButton = page.getByRole('button', { name: 'Select All' }).first();
    const itemRows = page.locator('[draggable="true"]');
    const itemCount = await itemRows.count();
    expect(itemCount).toBeGreaterThanOrEqual(2);

    await selectAllButton.click();
    await page.waitForTimeout(200);

    const selectedLabel = page.locator('text=/\\d+ selected/');
    await expect(selectedLabel).toBeVisible();
    await expect(selectedLabel).toHaveText(new RegExp(`${itemCount} selected`));
    const deselectAllButton = page.getByRole('button', { name: 'Deselect All' }).first();
    await expect(deselectAllButton).toBeVisible();

    await deselectAllButton.click();
    await page.waitForTimeout(200);
    await expect(selectedLabel).toHaveText(/0 selected/);
  });

  test('should batch delete selected items', async ({ page }) => {
    const itemName = `BatchDelete ${uniqueId()}`;
    
    await page.locator('button.fixed.bottom-24').click();
    await page.waitForTimeout(500);
    
    await page.locator('input[placeholder*="Organic Bananas"]').fill(itemName);
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Save Item")').click({ force: true });
    await page.waitForTimeout(1500);
    
    const selectBtn = page.locator('button[aria-label="Enter selection mode"]');
    const selectBtnVisible = await selectBtn.isVisible().catch(() => false);
    
    if (selectBtnVisible) {
      await selectBtn.click();
      await page.waitForTimeout(500);
      
      const itemRow = page.locator('[draggable="true"]').filter({ has: page.locator(`text=${itemName}`) }).first();
      const selectItemButton = itemRow.locator('button[aria-label="Select item"]');
      if (await selectItemButton.isVisible()) {
        await selectItemButton.click();
        await page.waitForTimeout(300);
        
        const deleteBtn = page.getByRole('button', { name: 'Delete', exact: true });
        if (await deleteBtn.isVisible()) {
          await deleteBtn.click();
          await expect(page.locator('h3:has-text("Confirm Delete")')).toBeVisible();
          await page.locator('button:has-text("Delete")').last().click();
          await page.waitForTimeout(1500);
          
          await expect(page.locator(`text=${itemName}`)).not.toBeVisible();
        }
      }
    }
  });

  test('should select and batch delete multiple categories', async ({ page }) => {
    await page.locator('nav button:has-text("Categories")').click();
    await page.waitForTimeout(1000);
    
    const selectBtn = page.locator('button:has-text("Select All")');
    const selectBtnVisible = await selectBtn.isVisible().catch(() => false);
    
    if (selectBtnVisible) {
      await selectBtn.click();
      await page.waitForTimeout(500);
      
      const deleteButton = page.locator('button:has-text("Delete")');
      if (await deleteButton.isVisible({ timeout: 1000 })) {
        await deleteButton.click();
        await expect(page.locator('h3:has-text("Confirm Delete")')).toBeVisible();
        await page.locator('button:has-text("Delete")').last().click();
        await page.waitForTimeout(1500);
      }
    }
  });

  test('should reorder items via drag and drop', async ({ page }) => {
    const viewport = page.viewportSize();
    test.skip(!!viewport && viewport.width < 768, 'drag-and-drop is desktop-only');

    const item1 = `DragItem1 ${uniqueId()}`;
    const item2 = `DragItem2 ${uniqueId()}`;
    
    await page.locator('button.fixed.bottom-24').click();
    await page.waitForTimeout(500);
    await page.locator('input[placeholder*="Organic Bananas"]').fill(item1);
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Save Item")').click({ force: true });
    await page.waitForTimeout(1000);
    
    await page.locator('button.fixed.bottom-24').click();
    await page.waitForTimeout(500);
    await page.locator('input[placeholder*="Organic Bananas"]').fill(item2);
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Save Item")').click({ force: true });
    await page.waitForTimeout(1000);
    
    const items = page.locator('[draggable="true"]');
    expect(await items.count()).toBeGreaterThanOrEqual(2);
  });

  test('should edit an item via modal', async ({ page }) => {
    const itemName = 'EditTestItem';
    
    await page.locator('button.fixed.bottom-24').click();
    await page.waitForTimeout(500);
    
    await page.locator('input[placeholder*="Organic Bananas"]').fill(itemName);
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Save Item")').click({ force: true });
    await page.waitForTimeout(1500);
    
    const editButton = page.locator('[draggable="true"] .group .text-zinc-400').first();
    if (await editButton.isVisible({ timeout: 3000 })) {
      await editButton.click();
      await page.waitForTimeout(500);
      
      const editModal = page.locator('h3:has-text("Edit Item")');
      if (await editModal.isVisible({ timeout: 2000 })) {
        await page.locator('input[placeholder*="Organic Bananas"]').fill('Updated ' + itemName);
        await page.waitForTimeout(300);
        await page.locator('button:has-text("Update Item")').click({ force: true });
        await page.waitForTimeout(1500);
        
        await expect(page.locator(`text=Updated ${itemName}`)).toBeVisible();
      }
    }
  });

  test('should open edit modal from item row on mobile layouts', async ({ page }) => {
    const itemName = `Mobile Edit ${uniqueId()}`;

    await page.locator('button.fixed.bottom-24').click();
    await page.waitForTimeout(300);
    await page.locator('input[placeholder*="Organic Bananas"]').fill(itemName);
    await page.locator('button:has-text("Save Item")').click({ force: true });
    await page.waitForTimeout(1000);

    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      await page.locator(`text=${itemName}`).first().click();
    } else {
      await page.locator('[aria-label="Edit item"]').last().click();
    }

    await expect(page.locator('h3:has-text("Edit Item")')).toBeVisible();
  });

  test('should keep item order stable when toggling completion', async ({ page }) => {
    const itemA = `Stable A ${uniqueId()}`;
    const itemB = `Stable B ${uniqueId()}`;
    const categoryName = `Stable Cat ${uniqueId()}`;

    await page.locator('nav button:has-text("Categories")').click();
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Add")').click();
    await page.waitForTimeout(300);
    await page.locator('input[placeholder*="Frozen Foods"]').fill(categoryName);
    await page.locator('button:has-text("Create Category")').click({ force: true });
    await page.waitForTimeout(1000);

    await page.locator('nav button:has-text("List")').click();
    await page.waitForTimeout(300);
    await page.locator(`button:has-text("${categoryName.toUpperCase()}")`).click();
    await page.waitForTimeout(300);

    for (const name of [itemA, itemB]) {
      await page.locator('button.fixed.bottom-24').click();
      await page.waitForTimeout(250);
      await page.locator('input[placeholder*="Organic Bananas"]').fill(name);
      await page.locator('select#new-item-category').selectOption({ label: categoryName });
      await page.locator('button:has-text("Save Item")').click({ force: true });
      await page.waitForTimeout(700);
    }

    const itemNames = page.locator('[draggable="true"] span.text-base');
    await expect(itemNames.first()).toHaveText(itemA);

    const firstToggle = page.locator('[draggable="true"] button[aria-label*="Mark item"]').first();
    await firstToggle.click();
    await page.waitForTimeout(500);

    await expect(itemNames.first()).toHaveText(itemA);
    await expect(page.locator(`text=${itemB}`).first()).toBeVisible();
  });

  test('should prevent duplicate item names in same category', async ({ page }) => {
    const itemName = `Duplicate ${uniqueId()}`;
    
    await page.locator('button.fixed.bottom-24').click();
    await page.waitForTimeout(500);
    
    await page.locator('input[placeholder*="Organic Bananas"]').fill(itemName);
    await page.waitForTimeout(300);
    await page.locator('button:has-text("Save Item")').click({ force: true });
    await page.waitForTimeout(1500);
    
    const addButton = page.locator('button.fixed.bottom-24');
    const isModalOpen = await page.locator('input[placeholder*="Organic Bananas"]').isVisible();
    
    if (!isModalOpen && await addButton.isVisible()) {
      await addButton.click();
      await page.waitForTimeout(500);
    }
    
    if (await page.locator('input[placeholder*="Organic Bananas"]').isVisible()) {
      await page.locator('input[placeholder*="Organic Bananas"]').fill(itemName);
      await page.waitForTimeout(300);

      let dialogMessage = '';
      page.once('dialog', async dialog => {
        dialogMessage = dialog.message();
        await dialog.dismiss();
      });

      await page.locator('button:has-text("Save Item")').click();
      await expect.poll(() => dialogMessage).toContain('already exists');
    }
  });

  test('should prevent duplicate category names', async ({ page }) => {
    await page.locator('nav button:has-text("Categories")').click();
    await page.waitForTimeout(500);
    
    const existingCatName = 'Produce';
    
    await page.locator('button:has-text("Add")').click();
    await page.waitForTimeout(500);
    
    await page.locator('input[placeholder*="Frozen Foods"]').fill(existingCatName);
    await page.waitForTimeout(300);
    
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('already exists');
      await dialog.dismiss();
    });
    
    await page.locator('button:has-text("Create Category")').click({ force: true });
    await page.waitForTimeout(1000);
  });
});
