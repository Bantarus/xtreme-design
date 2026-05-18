import { expect, test } from '@playwright/test';

test('home page smoke @visual', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('home.png', { maxDiffPixelRatio: 0.01 });
});

test('tokens page smoke @visual', async ({ page }) => {
  await page.goto('/tokens');
  await expect(page).toHaveScreenshot('tokens.png', { maxDiffPixelRatio: 0.01 });
});
