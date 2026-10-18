import { test, expect } from '@playwright/test';
import { ACCOUNTS, storageStatePath } from './e2e-auth';

test.use({ storageState: storageStatePath('clinician') });

test.describe('Clinician Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/clinician');
  });

  test('shows the dashboard summary', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Clinician Dashboard' })).toBeVisible();
    await expect(page.getByText(/\d+ patients • \d+ active escalations/)).toBeVisible();
  });

  test('shows the escalation queue and patient overview', async ({ page }) => {
    await expect(page.getByText('Escalation Queue')).toBeVisible();
    await expect(page.getByText('Patient Overview')).toBeVisible();
  });

  test('shows the seeded escalation in the queue', async ({ page }) => {
    await expect(page.getByText(ACCOUNTS.mom).first()).toBeVisible();
    await expect(page.getByText(/PAIN[ _]SPIKE/).first()).toBeVisible();
    await expect(page.getByText('HIGH', { exact: true }).first()).toBeVisible();
  });

  test('navigates to a patient detail page', async ({ page }) => {
    await page
      .locator('a[href*="/clinician/patient/"]', { hasText: ACCOUNTS.mom })
      .first()
      .click();
    await expect(page).toHaveURL(/\/clinician\/patient\//);
    await expect(page.getByRole('heading', { name: new RegExp(ACCOUNTS.mom) })).toBeVisible();
  });
});

test.describe('Patient Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/clinician');
    await page
      .locator('a[href*="/clinician/patient/"]', { hasText: ACCOUNTS.mom })
      .first()
      .click();
    await expect(page).toHaveURL(/\/clinician\/patient\//);
  });

  test('shows the patient detail tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Check-ins' })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Escalations/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Referrals/ })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Notes/ })).toBeVisible();
  });

  test('relates the seeded escalation', async ({ page }) => {
    await page.getByRole('tab', { name: /Escalations/ }).click();
    await expect(page.getByText('PAIN SPIKE')).toBeVisible();
  });

  test('allows opening the clinical note editor', async ({ page }) => {
    await page.getByRole('tab', { name: /Notes/ }).click();
    await page.getByRole('button', { name: 'Add Note' }).last().click();
    await expect(page.locator('textarea[placeholder="Enter clinical note..."]')).toBeVisible();
  });
});
