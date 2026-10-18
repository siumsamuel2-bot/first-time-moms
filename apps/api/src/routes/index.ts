import type { FastifyInstance } from 'fastify';
import { analyticsRoutes } from './analytics.js';
import { authRoutes } from './auth.js';
import { checkinRoutes } from './checkins.js';
import { clinicianRoutes } from './clinician.js';
import { cronRoutes } from './cron.js';
import { healthRoutes } from './health.js';
import { onboardingRoutes } from './onboarding.js';
import { pushRoutes } from './push.js';
import { referralRoutes } from './referrals.js';

export async function registerRoutes(app: FastifyInstance) {
  await healthRoutes(app);
  await authRoutes(app);
  await onboardingRoutes(app);
  await checkinRoutes(app);
  await clinicianRoutes(app);
  await referralRoutes(app);
  await pushRoutes(app);
  await analyticsRoutes(app);
  await cronRoutes(app);
}
