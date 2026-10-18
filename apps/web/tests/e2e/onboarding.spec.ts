import { test, expect } from '@playwright/test';
import { storageStatePath } from './e2e-auth';

test.describe.configure({ mode: 'serial' });

test.use({ storageState: storageStatePath('onboarding') });

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/onboarding');
  });

  test('shows the delivery details step', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Delivery Details' })).toBeVisible();
    await expect(page.getByText('Step 1 of 5')).toBeVisible();
    await expect(page.getByLabel('Delivery Date')).toBeVisible();
  });

  test('advances from delivery to feeding method', async ({ page }) => {
    await page.locator('input[type="date"]').fill('2026-01-15');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Feeding Method' })).toBeVisible();
    await expect(page.getByText('Step 2 of 5')).toBeVisible();
  });

  test('advances from feeding to mental health baseline', async ({ page }) => {
    await page.locator('input[type="date"]').fill('2026-01-15');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Mental Health Baseline' })).toBeVisible();
  });

  test('advances to the complications step', async ({ page }) => {
    await page.locator('input[type="date"]').fill('2026-01-15');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Complications' })).toBeVisible();
  });

  test('completes onboarding and lands on the dashboard', async ({ page }) => {
    await page.locator('input[type="date"]').fill('2026-01-15');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Skip for Now' })).toBeVisible();

    await page.getByRole('button', { name: 'Complete Onboarding' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Good morning')).toBeVisible();
  });
});
