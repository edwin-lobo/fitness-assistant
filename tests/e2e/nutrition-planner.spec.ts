import { expect, test } from '@playwright/test';

test.describe('nutrition planner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('heading', { name: 'Plan a low-friction week of food' }).scrollIntoViewIfNeeded();
  });

  test('renders the household meal planner and grocery checklist', async ({ page }) => {
    const groceryChecklist = page.getByRole('heading', { name: 'Grocery checklist' }).locator('..');

    await expect(page.getByRole('heading', { name: 'Household profile' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Weekly meal plan' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Grocery checklist' })).toBeVisible();
    await expect(groceryChecklist.getByText('Chicken breast', { exact: true })).toBeVisible();
    await expect(groceryChecklist.getByText('Bell peppers', { exact: true })).toBeVisible();
    await expect(page.getByText('90% low processed')).toBeVisible();
  });

  test('allows member profile editing and meal changes', async ({ page }) => {
    const groceryChecklist = page.getByRole('heading', { name: 'Grocery checklist' }).locator('..');

    await page.getByLabel('Member name').first().fill('Member One');
    await page.getByLabel('Preference').first().fill('Simple high-protein meals');
    await page.getByLabel('Convenience need').first().selectOption('high');

    await expect(page.getByLabel('Member name').first()).toHaveValue('Member One');
    await expect(page.getByLabel('Preference').first()).toHaveValue('Simple high-protein meals');
    await expect(page.getByLabel('Convenience need').first()).toHaveValue('high');

    await page.getByRole('row', { name: /Wed/ }).getByRole('combobox').nth(2).selectOption('turkey-chili');

    await expect(groceryChecklist.getByText('Ground turkey', { exact: true })).toBeVisible();
    await expect(groceryChecklist.getByText('Canned beans', { exact: true })).toBeVisible();
  });

  test('keeps share output in sync with the selected plan', async ({ page }) => {
    const shareOutput = page.getByRole('textbox').last();

    await expect(shareOutput).toContainText('Fitness Assistant weekly nutrition plan');
    await expect(shareOutput).toContainText('Mon: Breakfast - Protein overnight oats');
    await expect(shareOutput).toContainText('Grocery checklist');

    await page.getByRole('row', { name: /Mon/ }).getByRole('combobox').nth(2).selectOption('turkey-chili');

    await expect(shareOutput).toContainText('Mon: Breakfast - Protein overnight oats; Lunch - Chicken grain bowls; Dinner - Turkey bean chili');
    await expect(shareOutput).toContainText('Ground turkey');
  });

  test('copies the share output for grocery app handoff', async ({ browserName, context, page }) => {
    test.skip(browserName !== 'chromium', 'clipboard permission is only configured for Chromium CI');

    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: 'Copy grocery handoff' }).click();

    await expect(page.getByText('Copied plan and grocery list')).toBeVisible();
    await expect(page.evaluate(() => navigator.clipboard.readText())).resolves.toContain('Grocery checklist');
  });
});
