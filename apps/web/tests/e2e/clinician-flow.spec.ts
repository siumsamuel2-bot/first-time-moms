import { test, expect } from '@playwright/test';
import { ACCOUNTS, storageStatePath } from './e2e-auth';

test.use({ storageState: storageStatePath('clinician') });

async function openSeededPatient(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/clinician');
  await page
    .locator('a[href*="/clinician/patient/"]', { hasText: ACCOUNTS.mom })
    .first()
    .click();
  await expect(page).toHaveURL(/\/clinician\/patient\//);
}

test.describe('Clinician Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/clinician');
  });

  test('shows the dashboard with escalation queue and patient overview', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Clinician Dashboard' })).toBeVisible();
    await expect(page.getByText('Escalation Queue')).toBeVisible();
    await expect(page.getByText('Patient Overview')).toBeVisible();
  });

  test('lists escalation cards with a severity badge', async ({ page }) => {
    await expect(page.getByText(/PAIN[ _]SPIKE/).first()).toBeVisible();
    await expect(page.getByText('HIGH', { exact: true }).first()).toBeVisible();
  });

  test('navigates into the seeded patient timeline', async ({ page }) => {
    await openSeededPatient(page);
    const user = ACCOUNTS.mom;
    await expect(page.getByRole('heading', { name: new RegExp(user) })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Overview' })).toBeVisible();
  });

  test('shows escalation detail on the patient page', async ({ page }) => {
    await openSeededPatient(page);
    await page.getByRole('tab', { name: /Escalations/ }).click();
    await expect(page.getByText('PAIN SPIKE')).toBeVisible();
    await expect(page.getByText('HIGH', { exact: true })).toBeVisible();
  });

  test('adds a clinical note for the patient', async ({ page }) => {
    await openSeededPatient(page);
    const note = `Follow-up ${Date.now()}`;

    await page.getByRole('tab', { name: /Notes/ }).click();
    await page.getByRole('button', { name: 'Add Note' }).last().click();
    await page.locator('textarea[placeholder="Enter clinical note..."]').fill(note);
    await page.getByRole('button', { name: 'Save Note' }).click();

    await expect(page.getByText(note)).toBeVisible();
  });
});
