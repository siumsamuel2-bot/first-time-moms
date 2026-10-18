import { test, expect } from '@playwright/test';
import { storageStatePath } from './e2e-auth';
import { completeCheckIn } from './helpers';

test.describe.configure({ mode: 'serial' });

test.use({ storageState: storageStatePath('escalation') });

test.describe('Check-in Escalation & History', () => {
  test('flags a check-in for review when pain spikes', async ({ page }) => {
    await page.goto('/check-in');
    await expect(page.getByText('Question 1 of 7')).toBeVisible();

    await completeCheckIn(page, { painLevel: 9 });

    await expect(page.getByRole('heading', { name: 'Check-in Complete' })).toBeVisible();
    await expect(page.getByText('flagged this for review')).toBeVisible();

    await page.getByRole('button', { name: 'Go to Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('shows 30-day trends on the history page', async ({ page }) => {
    await page.goto('/history');
    await page.getByRole('tab', { name: 'Trends' }).click();
    await expect(page.getByText('30-Day Trends')).toBeVisible();
  });
});
