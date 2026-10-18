export const E2E_PASSWORD = 'E2eTest123!';

export const AUTH_DIR = 'tests/e2e/.auth';

export const ACCOUNTS = {
  mom: 'e2e.mom@firstweeks.test',
  escalation: 'e2e.escalation@firstweeks.test',
  onboarding: 'e2e.onboarding@firstweeks.test',
  clinician: 'e2e.clinician@firstweeks.test',
} as const;

export type E2ERole = keyof typeof ACCOUNTS;

export function storageStatePath(role: E2ERole): string {
  return `${AUTH_DIR}/${role}.json`;
}
