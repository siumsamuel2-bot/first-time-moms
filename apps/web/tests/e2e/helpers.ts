import { expect, type Page } from '@playwright/test';

const QUESTION_COUNT = 7;

const OPTION_LABEL = 'label:has(button[role="radio"])';

async function clickFirstOption(page: Page): Promise<void> {
  await page.locator(OPTION_LABEL).first().click();
}

async function clickOption(page: Page, text: string | RegExp): Promise<void> {
  await page.locator(OPTION_LABEL).filter({ hasText: text }).first().click();
}

/**
 * Walks the shipped daily check-in and submits it.
 *
 * The question order is deterministic for a mother with no mood/sleep flags:
 *   1 sadness, 2 anxiety, 3 bleeding, 4 sleep_disruption,
 *   5 perineal_pain, 6 sleep_hours, 7 pain_level
 */
export async function completeCheckIn(page: Page, options: { painLevel?: number } = {}): Promise<void> {
  const painLevel = options.painLevel ?? 1;

  for (let step = 1; step <= QUESTION_COUNT; step++) {
    await expect(page.getByText(`Question ${step} of ${QUESTION_COUNT}`)).toBeVisible();

    if (step === 3) {
      await clickOption(page, /^None$/);
    } else if (step === QUESTION_COUNT) {
      await clickOption(page, new RegExp(`^${painLevel}$`));
    } else {
      await clickFirstOption(page);
    }
  }

  await page.getByRole('button', { name: 'Complete Check-in' }).click();
}
