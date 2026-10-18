import { test, expect } from '@playwright/test';
import { ACCOUNTS, storageStatePath } from './e2e-auth';

test.describe('Signup Flow', () => {
  test('creates an account and lands in onboarding', async ({ page }) => {
    const email = `e2e-signup-${Date.now()}@firstweeks.test`;

    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();

    await page.locator('#email').fill(email);
    await page.locator('#password').fill('E2eSignup123!');
    await page.locator('#confirmPassword').fill('E2eSignup123!');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/onboarding/);
    await expect(page.getByRole('heading', { name: 'Delivery Details' })).toBeVisible();
  });
});

test.describe('Mom: referral response', () => {
  test.use({ storageState: storageStatePath('mom') });

  test('reviews a referral from the dashboard flow', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('Good morning')).toBeVisible();

    await page.goto('/referrals');
    await expect(page.getByRole('heading', { name: 'My Referrals' })).toBeVisible();

    await page.getByRole('link', { name: 'Review & Respond' }).first().click();
    await expect(page.getByRole('heading', { name: 'Referral Details' })).toBeVisible();
    await expect(page.getByText('Referral Context')).toBeVisible();
  });
});

test.describe('Clinician: patient review', () => {
  test.use({ storageState: storageStatePath('clinician') });

  test('opens a patient and records a clinical note', async ({ page }) => {
    await page.goto('/clinician');
    await expect(page.getByRole('heading', { name: 'Clinician Dashboard' })).toBeVisible();

    const patientLink = page
      .locator('a[href*="/clinician/patient/"]', { hasText: ACCOUNTS.mom })
      .first();
    await patientLink.click();

    await expect(page).toHaveURL(/\/clinician\/patient\//);
    await expect(page.getByRole('heading', { name: new RegExp(ACCOUNTS.mom) })).toBeVisible();

    const note = `E2E note ${Date.now()}`;
    await page.getByRole('tab', { name: /Notes/ }).click();
    await page.getByRole('button', { name: 'Add Note' }).last().click();
    await page.locator('textarea[placeholder="Enter clinical note..."]').fill(note);
    await page.getByRole('button', { name: 'Save Note' }).click();

    await expect(page.getByText(note)).toBeVisible();
  });
});
