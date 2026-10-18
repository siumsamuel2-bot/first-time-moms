import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import { afterAll, beforeAll, beforeEach, vi } from 'vitest';

const prisma = new PrismaClient();

beforeAll(async () => {
  try {
    execSync('pnpm exec prisma db push --skip-generate', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  } catch {
    console.warn('Database not available, skipping migrations');
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  try {
    await prisma.auditLog.deleteMany();
    await prisma.clinicalNote.deleteMany();
    await prisma.referral.deleteMany();
    await prisma.provider.deleteMany();
    await prisma.escalation.deleteMany();
    await prisma.checkIn.deleteMany();
    await prisma.onboarding.deleteMany();
    await prisma.user.deleteMany();
  } catch {
    console.warn('Database cleanup skipped');
  }
});

vi.setConfig({ testTimeout: 30000 });

export { prisma };
