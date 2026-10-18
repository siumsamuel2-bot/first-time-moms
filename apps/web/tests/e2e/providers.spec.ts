import { test, expect } from '@playwright/test';
import { storageStatePath } from './e2e-auth';

test.use({ storageState: storageStatePath('mom') });

test.describe('Provider Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/providers');
  });

  test('shows the provider search page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Find a Provider' })).toBeVisible();
    await expect(page.getByText('Search for screened providers matched to your recovery needs')).toBeVisible();
  });

  test('shows the filter controls', async ({ page }) => {
    await expect(page.getByText('Filters')).toBeVisible();
    await expect(page.getByText('Specialty', { exact: true })).toBeVisible();
    await expect(page.getByText('Insurance', { exact: true })).toBeVisible();
    await expect(page.getByText('Location', { exact: true })).toBeVisible();
  });

  test('filters providers by specialty', async ({ page }) => {
    await page.locator('#specialty').click();
    await page.getByRole('option', { name: 'Perinatal Mental Health' }).click();

    await expect(page.locator('#specialty')).toContainText('Perinatal Mental Health');
    await expect(page.getByText('% Match').first()).toBeVisible();
  });

  test('shows provider cards with match score, screening and availability', async ({ page }) => {
    await expect(page.getByText('% Match').first()).toBeVisible();
    await expect(page.getByText('Screened & Approved').first()).toBeVisible();
    await expect(page.getByText(/Available in \d+ day/).first()).toBeVisible();
  });

  test('links through to the referral list', async ({ page }) => {
    await page.goto('/referrals');
    await expect(page.getByRole('heading', { name: 'My Referrals' })).toBeVisible();
    await expect(page.getByText('Needs Your Action')).toBeVisible();
  });
});
