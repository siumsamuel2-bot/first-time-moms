import { test, expect } from '@playwright/test';
import { storageStatePath } from './e2e-auth';
import { completeCheckIn } from './helpers';

test.describe.configure({ mode: 'serial' });

test.use({ storageState: storageStatePath('mom') });

test.describe('Daily Check-in Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/check-in');
    await expect(page.getByText('Question 1 of 7')).toBeVisible();
  });

  test('shows the first question and progress indicator', async ({ page }) => {
    await expect(page.getByText('How sad or down have you felt today?')).toBeVisible();
  });

  test('advances to the next question after answering', async ({ page }) => {
    await page.locator('label:has(button[role="radio"])').first().click();
    await expect(page.getByText('Question 2 of 7')).toBeVisible();
  });

  test('allows going back to the previous question', async ({ page }) => {
    await page.locator('label:has(button[role="radio"])').first().click();
    await expect(page.getByText('Question 2 of 7')).toBeVisible();
    await page.getByRole('button', { name: 'Back' }).click();
    await expect(page.getByText('Question 1 of 7')).toBeVisible();
  });

  test('completes a full check-in and returns to the dashboard', async ({ page }) => {
    await completeCheckIn(page);
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Good morning')).toBeVisible();
  });

  test('shows the check-in history page', async ({ page }) => {
    await page.goto('/history');
    await expect(page.getByRole('heading', { name: 'History' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Check-ins' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Trends' })).toBeVisible();
  });
});
