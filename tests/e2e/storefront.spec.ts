import { expect, test } from '@playwright/test';

test('shows the storefront and product catalogue', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Fashion & Style' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Products \(\d+\)/ })).toBeVisible();
  await expect(page.locator('a[href^="/product/"]').first()).toBeVisible();
});

test('opens a product detail page from the catalogue', async ({ page }) => {
  await page.goto('/');
  await page.locator('a[href^="/product/"]').first().click();

  await expect(page).toHaveURL(/\/product\/\d+$/);
  // Wait up to 15 s — first visit triggers a Next.js dev-server compilation
  await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeVisible({ timeout: 15_000 });
});

test('opens the shopping assistant', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open chat' }).click();

  // Allow time for the panel's open animation to complete
  await expect(page.getByText('Shopping Assistant')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByPlaceholder('Ask about products…')).toBeVisible();
});
