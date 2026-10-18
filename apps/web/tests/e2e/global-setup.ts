import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { request } from '@playwright/test';
import { ACCOUNTS, AUTH_DIR, E2E_PASSWORD, type E2ERole, storageStatePath } from './e2e-auth';

const API_BASE_URL = process.env.E2E_API_URL ?? 'http://localhost:8080';
const WEB_BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';

async function waitFor(url: string, timeoutMs = 120_000): Promise<void> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

export default async function globalSetup(): Promise<void> {
  execSync('pnpm --filter @firstweeks/api db:seed:e2e', { stdio: 'inherit' });

  await waitFor(`${API_BASE_URL}/healthz`);
  await waitFor(WEB_BASE_URL);

  fs.mkdirSync(AUTH_DIR, { recursive: true });

  for (const [role, email] of Object.entries(ACCOUNTS) as [E2ERole, string][]) {
    const context = await request.newContext({ baseURL: API_BASE_URL });
    const response = await context.post('/auth/login', {
      data: { email, password: E2E_PASSWORD },
    });

    if (!response.ok()) {
      throw new Error(`E2E login failed for ${email}: ${response.status()} ${await response.text()}`);
    }

    await context.storageState({ path: storageStatePath(role) });
    await context.dispose();
  }
}
