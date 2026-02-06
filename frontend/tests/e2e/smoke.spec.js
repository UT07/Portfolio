const { test, expect } = require('@playwright/test');

test('loads professional mode hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('professional-hero-headline')).toBeVisible();
});

test('toggles to DJ mode', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('mode-toggle-switch').click();
  await expect(page.getByTestId('dj-hero-headline')).toBeVisible();
});
