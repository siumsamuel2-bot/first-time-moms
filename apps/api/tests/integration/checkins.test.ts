import Fastify from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { registerPlugins } from '../../src/plugins/index.js';
import { registerRoutes } from '../../src/routes/index.js';
import { prisma } from './setup.js';

async function createApp() {
  const app = Fastify({
    logger: false,
    ajv: { customOptions: { coerceTypes: 'array' } },
  });
  await registerPlugins(app);
  await registerRoutes(app);
  await app.ready();
  return app;
}

let userSeq = 0;

async function createAuthedUser(app: Awaited<ReturnType<typeof createApp>>, role: string) {
  const email = `${role.toLowerCase()}-${Date.now()}-${userSeq++}@example.com`;
  const signup = await app.inject({
    method: 'POST',
    url: '/auth/signup',
    payload: { email, password: 'password123', role },
  });
  expect(signup.statusCode).toBe(201);
  const token = signup.cookies.find((c) => c.name === 'accessToken')?.value ?? '';
  const user = await prisma.user.update({ where: { email }, data: { emailVerified: true } });
  return { id: user.id, email, token };
}

async function seedOnboardedMom(email = `mom-${Date.now()}-${userSeq++}@example.com`) {
  const user = await prisma.user.create({
    data: { email, passwordHash: 'x', role: 'MOM', emailVerified: true },
  });
  await prisma.onboarding.create({
    data: {
      userId: user.id,
      deliveryDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      deliveryType: 'VAGINAL',
      feedingMethod: 'BREASTFEEDING',
      mentalHealthBaseline: { phq2Score: 1, gad2Score: 1 },
      complications: [],
      completedAt: new Date(),
    },
  });
  return user;
}

function isoDay(daysAgo: number): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo));
  return d.toISOString().slice(0, 10);
}

function dayValue(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

async function seedCheckIn(
  userId: string,
  iso: string,
  data: { sleepDisruption?: number; sadness?: number; sleepHours?: number }
) {
  await prisma.checkIn.create({
    data: { userId, date: dayValue(iso), ...data },
  });
}

async function seedApprovedProvider(name = `Provider ${Date.now()}-${userSeq++}`) {
  return prisma.provider.create({
    data: {
      name,
      specialties: ['PERINATAL_MH'],
      location: { lat: 33.45, lng: -112.07, address: 'Phoenix, AZ', radiusMiles: 25 },
      insuranceAccepted: ['Aetna'],
      screeningStatus: 'APPROVED',
      availability: { nextSlotDays: 2, slots: [] },
      contactInfo: { phone: '555-0100', email: 'provider@example.com' },
    },
  });
}

describe('Check-in & Escalation Integration Tests', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /check-ins', () => {
    it('rejects unauthenticated requests', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/check-ins',
        payload: { date: isoDay(0) },
      });
      expect(response.statusCode).toBe(401);
    });

    it('creates a benign check-in without escalating', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      const response = await app.inject({
        method: 'POST',
        url: '/check-ins',
        cookies: { accessToken: mom.token },
        payload: { date: isoDay(0), sleepHours: 7, sleepDisruption: 1, sadness: 1 },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.id).toBeDefined();
      expect(body.data.escalationCreated).toBe(false);

      const count = await prisma.escalation.count({ where: { userId: mom.id } });
      expect(count).toBe(0);
    });

    it('rejects out-of-range values', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      const response = await app.inject({
        method: 'POST',
        url: '/check-ins',
        cookies: { accessToken: mom.token },
        payload: { date: isoDay(0), sleepDisruption: 99 },
      });
      expect(response.statusCode).toBe(400);
    });

    it('upserts the same date instead of duplicating', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      await app.inject({
        method: 'POST',
        url: '/check-ins',
        cookies: { accessToken: mom.token },
        payload: { date: isoDay(0), sadness: 1 },
      });
      await app.inject({
        method: 'POST',
        url: '/check-ins',
        cookies: { accessToken: mom.token },
        payload: { date: isoDay(0), sadness: 4 },
      });

      const rows = await prisma.checkIn.findMany({ where: { userId: mom.id } });
      expect(rows).toHaveLength(1);
      expect(rows[0].sadness).toBe(4);
    });

    it('triggers an escalation after 5 consecutive days of sleep disruption + sadness', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      for (let i = 1; i <= 4; i++) {
        await seedCheckIn(mom.id, isoDay(i), { sleepDisruption: 4, sadness: 3 });
      }

      const response = await app.inject({
        method: 'POST',
        url: '/check-ins',
        cookies: { accessToken: mom.token },
        payload: { date: isoDay(0), sleepDisruption: 5, sadness: 4 },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.data.escalationCreated).toBe(true);

      const escalation = await prisma.escalation.findFirst({ where: { userId: mom.id } });
      expect(escalation).not.toBeNull();
      expect(escalation?.trigger).toBe('SLEEP_SADNESS_5DAY');
      expect(escalation?.severity).toBe('CRITICAL');
      expect(escalation?.status).toBe('PENDING');

      const audit = await prisma.auditLog.findFirst({
        where: { action: 'ESCALATION_CREATED', resourceId: escalation?.id },
      });
      expect(audit).not.toBeNull();
    });
  });

  describe('GET /check-ins', () => {
    it('lists the caller check-ins with pagination metadata', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      await seedCheckIn(mom.id, isoDay(1), { sadness: 2 });
      await seedCheckIn(mom.id, isoDay(2), { sadness: 2 });

      const response = await app.inject({
        method: 'GET',
        url: '/check-ins?page=1&limit=1',
        cookies: { accessToken: mom.token },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data).toHaveLength(1);
      expect(body.pagination.total).toBe(2);
      expect(body.pagination.totalPages).toBe(2);
    });

    it('only returns the caller own check-ins', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      const other = await createAuthedUser(app, 'MOM');
      await seedCheckIn(other.id, isoDay(1), { sadness: 5 });

      const response = await app.inject({
        method: 'GET',
        url: '/check-ins',
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).data).toHaveLength(0);
    });
  });

  describe('GET /check-ins/:id', () => {
    it('returns the caller own check-in', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      await seedCheckIn(mom.id, isoDay(1), { sadness: 2 });
      const checkIn = await prisma.checkIn.findFirst({ where: { userId: mom.id } });

      const response = await app.inject({
        method: 'GET',
        url: `/check-ins/${checkIn?.id}`,
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(200);
    });

    it('returns 404 for another user check-in (IDOR protection)', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      const other = await createAuthedUser(app, 'MOM');
      await seedCheckIn(other.id, isoDay(1), { sadness: 2 });
      const checkIn = await prisma.checkIn.findFirst({ where: { userId: other.id } });

      const response = await app.inject({
        method: 'GET',
        url: `/check-ins/${checkIn?.id}`,
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /check-ins/trends', () => {
    it('returns trend metrics for the caller', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      await seedCheckIn(mom.id, isoDay(1), { sleepHours: 6, sadness: 2 });
      await seedCheckIn(mom.id, isoDay(0), { sleepHours: 8, sadness: 1 });

      const response = await app.inject({
        method: 'GET',
        url: '/check-ins/trends',
        cookies: { accessToken: mom.token },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.userId).toBe(mom.id);
      expect(body.data.sleepHours.avg).toBeGreaterThan(0);
      expect(body.data.escalationRisk.riskLevel).toBeDefined();
    });
  });

  describe('GET /escalations', () => {
    it('shows a MOM only their own escalations', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      const other = await createAuthedUser(app, 'MOM');
      await prisma.escalation.create({
        data: {
          userId: other.id,
          trigger: 'SLEEP_7DAY',
          severity: 'HIGH',
          contextSummary: 'other',
        },
      });

      const response = await app.inject({
        method: 'GET',
        url: '/escalations',
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).data).toHaveLength(0);
    });
  });

  describe('GET /escalations/:id', () => {
    it('returns 404 when a MOM requests another user escalation', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      const other = await createAuthedUser(app, 'MOM');
      const escalation = await prisma.escalation.create({
        data: {
          userId: other.id,
          trigger: 'SLEEP_7DAY',
          severity: 'HIGH',
          contextSummary: 'other',
        },
      });

      const response = await app.inject({
        method: 'GET',
        url: `/escalations/${escalation.id}`,
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /escalations/:id/referral', () => {
    it('forbids a MOM from creating a referral', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      const escalation = await prisma.escalation.create({
        data: {
          userId: mom.id,
          trigger: 'SLEEP_SADNESS_5DAY',
          severity: 'CRITICAL',
          contextSummary: 'ctx',
        },
      });

      const response = await app.inject({
        method: 'POST',
        url: `/escalations/${escalation.id}/referral`,
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(403);
    });

    it('creates a referral, marks the escalation REFERRED, and audits', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const mom = await seedOnboardedMom();
      await seedApprovedProvider();
      const escalation = await prisma.escalation.create({
        data: {
          userId: mom.id,
          trigger: 'SLEEP_SADNESS_5DAY',
          severity: 'CRITICAL',
          contextSummary: 'ctx',
        },
      });

      const response = await app.inject({
        method: 'POST',
        url: `/escalations/${escalation.id}/referral`,
        cookies: { accessToken: clinician.token },
      });

      expect(response.statusCode).toBe(201);
      const referralId = JSON.parse(response.body).data.id;

      const referral = await prisma.referral.findUnique({ where: { id: referralId } });
      expect(referral?.escalationId).toBe(escalation.id);
      expect(referral?.userId).toBe(mom.id);

      const updated = await prisma.escalation.findUnique({ where: { id: escalation.id } });
      expect(updated?.status).toBe('REFERRED');

      const audit = await prisma.auditLog.findFirst({
        where: { action: 'REFERRAL_CREATED', resourceId: referralId },
      });
      expect(audit).not.toBeNull();
    });

    it('returns 409 when a referral already exists', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const mom = await seedOnboardedMom();
      await seedApprovedProvider();
      const escalation = await prisma.escalation.create({
        data: {
          userId: mom.id,
          trigger: 'SLEEP_SADNESS_5DAY',
          severity: 'CRITICAL',
          contextSummary: 'ctx',
        },
      });

      const first = await app.inject({
        method: 'POST',
        url: `/escalations/${escalation.id}/referral`,
        cookies: { accessToken: clinician.token },
      });
      expect(first.statusCode).toBe(201);

      const second = await app.inject({
        method: 'POST',
        url: `/escalations/${escalation.id}/referral`,
        cookies: { accessToken: clinician.token },
      });
      expect(second.statusCode).toBe(409);
      expect(JSON.parse(second.body).error.code).toBe('ALREADY_EXISTS');
    });

    it('returns 400 when the patient has no onboarding', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const mom = await prisma.user.create({
        data: { email: `noob-${Date.now()}@example.com`, passwordHash: 'x', role: 'MOM' },
      });
      const escalation = await prisma.escalation.create({
        data: {
          userId: mom.id,
          trigger: 'SLEEP_7DAY',
          severity: 'HIGH',
          contextSummary: 'ctx',
        },
      });

      const response = await app.inject({
        method: 'POST',
        url: `/escalations/${escalation.id}/referral`,
        cookies: { accessToken: clinician.token },
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error.code).toBe('ONBOARDING_REQUIRED');
    });

    it('returns 404 for an unknown escalation', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const response = await app.inject({
        method: 'POST',
        url: '/escalations/does-not-exist/referral',
        cookies: { accessToken: clinician.token },
      });
      expect(response.statusCode).toBe(404);
    });
  });
});
