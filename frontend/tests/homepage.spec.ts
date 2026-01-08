import { test, expect } from '@playwright/test';

test('homepage loads and shows dropdowns', async ({ page }) => {
  await page.goto('http://127.0.0.1:4200/');
  await expect(page).toHaveTitle(/Fleet Frontend|Fleet Service Scheduler/);

  // Wait for the asset type select to appear
  const assetSelect = page.locator('select[formControlName="assetTypeId"]');
  await expect(assetSelect).toBeVisible({ timeout: 5000 });

  // Wait for the service center select to appear
  const centerSelect = page.locator('select[formControlName="serviceCenterId"]');
  await expect(centerSelect).toBeVisible({ timeout: 5000 });

  // Datepicker input
  const dateInput = page.locator('input[formControlName="appointmentDateTime"]');
  await expect(dateInput).toBeVisible();
});
