import { expect, test } from '@playwright/test';

test.describe('authentication role onboarding', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('heading', { name: 'Create your Fitness Assistant account' }).scrollIntoViewIfNeeded();
  });

  test('limits public signup roles to providers and clients', async ({ page }) => {
    const roleSelect = page.getByLabel('Account role');

    await expect(roleSelect).toBeVisible();
    await expect(roleSelect).toContainText('Provider');
    await expect(roleSelect).toContainText('Client');
    await expect(roleSelect).not.toContainText('Admin');
    await expect(roleSelect).not.toContainText('Moderator');
  });

  test('shows managed roles as invite-only instead of public signup options', async ({ page }) => {
    await expect(page.getByText('Admin and moderator roles are invite-only.')).toBeVisible();
    await expect(page.getByText('Public signup creates provider or client accounts only.')).toBeVisible();
  });

  test('shows a clear setup error when Supabase is unavailable', async ({ page }) => {
    await page.route('**/auth/v1/signup', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ msg: 'Invalid API key' }),
      });
    });

    await page.getByLabel('Full name').fill('Taylor Fit');
    await page.getByLabel('Email').fill('taylor@example.com');
    await page.getByLabel('Password').fill('correct-horse-battery');
    await page.getByLabel('Account role').selectOption('provider');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByRole('status')).toContainText(/VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY/);
  });
});
