import { test, expect } from '@playwright/test';
import { storageStatePath } from './e2e-auth';

test.use({ storageState: storageStatePath('mom') });

test.describe('Provider Search & Referral Flow', () => {
  test('shows the provider search page with filters', async ({ page }) => {
    await page.goto('/providers');
    await expect(page.getByRole('heading', { name: 'Find a Provider' })).toBeVisible();
    await expect(page.getByText('Search for screened providers matched to your recovery needs')).toBeVisible();
    await expect(page.getByText('Specialty', { exact: true })).toBeVisible();
    await expect(page.getByText('Insurance', { exact: true })).toBeVisible();
    await expect(page.getByText('Location', { exact: true })).toBeVisible();
  });

  test('filters providers by specialty', async ({ page }) => {
    await page.goto('/providers');
    await page.locator('#specialty').click();
    await page.getByRole('option', { name: 'Perinatal Mental Health' }).click();
    await expect(page.locator('#specialty')).toContainText('Perinatal Mental Health');
    await expect(page.getByText('% Match').first()).toBeVisible();
  });

  test('shows provider details with distance and availability', async ({ page }) => {
    await page.goto('/providers');
    await expect(page.getByText('miles away').first()).toBeVisible();
    await expect(page.getByText('Screened & Approved').first()).toBeVisible();
    await expect(page.getByText(/Available in \d+ day/).first()).toBeVisible();
  });

  test('shows the referral list page', async ({ page }) => {
    await page.goto('/referrals');
    await expect(page.getByRole('heading', { name: 'My Referrals' })).toBeVisible();
    await expect(page.getByText('Track and manage referrals from your care team')).toBeVisible();
    await expect(page.getByText('Needs Your Action')).toBeVisible();
  });

  test('opens a pending referral detail page', async ({ page }) => {
    await page.goto('/referrals');
    await page.getByRole('link', { name: 'Review & Respond' }).first().click();

    await expect(page).toHaveURL(/\/referrals\/.+/);
    await expect(page.getByRole('heading', { name: 'Referral Details' })).toBeVisible();
    await expect(page.getByText('Referral Context')).toBeVisible();
    await expect(page.getByText('Screened & Approved Provider')).toBeVisible();
    await expect(page.getByText('Information Shared')).toBeVisible();
  });

  test('shows consent and decline actions on a pending referral', async ({ page }) => {
    await page.goto('/referrals');
    await page.getByRole('link', { name: 'Review & Respond' }).first().click();

    await expect(
      page.getByRole('button', { name: 'I Consent & Share My Summary' })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Decline Referral' })).toBeVisible();
  });
});

test.describe('Profile & Notifications', () => {
  test('shows profile page with notification settings', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
    await expect(page.getByText('Daily Check-in Reminder')).toBeVisible();
    await expect(page.getByText('Escalation Alerts')).toBeVisible();
  });

  test('shows the appearance section', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByText('Dark Mode')).toBeVisible();
  });

  test('shows account settings', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByText('Email', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Current Password')).toBeVisible();
    await expect(page.getByLabel('New Password', { exact: true })).toBeVisible();
  });
});
