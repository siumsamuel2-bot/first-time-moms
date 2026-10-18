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

async function createAuthedUser(app: Awaited<ReturnType<typeof createApp>>, role = 'MOM') {
  const email = `${role.toLowerCase()}-ref-${Date.now()}-${userSeq++}@example.com`;
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

async function seedReferral(userId: string, status = 'PENDING') {
  const provider = await prisma.provider.create({
    data: {
      name: `Dr Referral ${Date.now()}-${userSeq++}`,
      specialties: ['PERINATAL_MH'],
      location: { lat: 40.7, lng: -74, address: '1 Main St', radiusMiles: 25 },
      insuranceAccepted: ['Aetna'],
      screeningStatus: 'APPROVED',
      availability: { nextSlotDays: 3, slots: [] },
      contactInfo: { phone: '555-0100', email: 'provider@example.com' },
    },
  });
  const escalation = await prisma.escalation.create({
    data: {
      userId,
      trigger: 'SLEEP_SADNESS_5DAY',
      severity: 'CRITICAL',
      status: 'REFERRED',
      contextSummary: 'Five days of poor sleep and low mood',
    },
  });
  const referral = await prisma.referral.create({
    data: {
      userId,
      escalationId: escalation.id,
      providerId: provider.id,
      status: status as never,
      contextSummary: 'Warm referral following escalation',
    },
  });
  return { referral, provider, escalation };
}

describe('Referral Integration Tests', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /referrals/:id', () => {
    it('rejects unauthenticated requests', async () => {
      const response = await app.inject({ method: 'GET', url: '/referrals/whatever' });
      expect(response.statusCode).toBe(401);
    });

    it('returns the caller own referral with provider name', async () => {
      const mom = await createAuthedUser(app);
      const { referral, provider } = await seedReferral(mom.id);

      const response = await app.inject({
        method: 'GET',
        url: `/referrals/${referral.id}`,
        cookies: { accessToken: mom.token },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body).data;
      expect(data.id).toBe(referral.id);
      expect(data.status).toBe('PENDING');
      expect(data.provider.name).toBe(provider.name);
    });

    it('returns 404 when a MOM requests another user referral', async () => {
      const owner = await createAuthedUser(app);
      const other = await createAuthedUser(app);
      const { referral } = await seedReferral(owner.id);

      const response = await app.inject({
        method: 'GET',
        url: `/referrals/${referral.id}`,
        cookies: { accessToken: other.token },
      });
      expect(response.statusCode).toBe(404);
    });

    it('lets a CLINICIAN view any referral', async () => {
      const owner = await createAuthedUser(app);
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const { referral } = await seedReferral(owner.id);

      const response = await app.inject({
        method: 'GET',
        url: `/referrals/${referral.id}`,
        cookies: { accessToken: clinician.token },
      });
      expect(response.statusCode).toBe(200);
    });

    it('returns 404 for an unknown referral', async () => {
      const mom = await createAuthedUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/referrals/does-not-exist',
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /referrals/:id/consent', () => {
    it('consents a pending referral and audits', async () => {
      const mom = await createAuthedUser(app);
      const { referral } = await seedReferral(mom.id);

      const response = await app.inject({
        method: 'POST',
        url: `/referrals/${referral.id}/consent`,
        cookies: { accessToken: mom.token },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).data.status).toBe('MOM_CONSENTED');

      const stored = await prisma.referral.findUnique({ where: { id: referral.id } });
      expect(stored?.momConsent).toBe(true);
      expect(stored?.status).toBe('MOM_CONSENTED');

      const audit = await prisma.auditLog.findFirst({
        where: { action: 'REFERRAL_CONSENTED', resourceId: referral.id },
      });
      expect(audit).not.toBeNull();
    });

    it('returns 404 when another MOM tries to consent', async () => {
      const owner = await createAuthedUser(app);
      const other = await createAuthedUser(app);
      const { referral } = await seedReferral(owner.id);

      const response = await app.inject({
        method: 'POST',
        url: `/referrals/${referral.id}/consent`,
        cookies: { accessToken: other.token },
      });
      expect(response.statusCode).toBe(404);
    });

    it('rejects consenting a referral in an invalid state', async () => {
      const mom = await createAuthedUser(app);
      const { referral } = await seedReferral(mom.id, 'COMPLETED');

      const response = await app.inject({
        method: 'POST',
        url: `/referrals/${referral.id}/consent`,
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error.code).toBe('INVALID_STATE');
    });
  });

  describe('POST /referrals/:id/decline', () => {
    it('declines a pending referral and audits', async () => {
      const mom = await createAuthedUser(app);
      const { referral } = await seedReferral(mom.id);

      const response = await app.inject({
        method: 'POST',
        url: `/referrals/${referral.id}/decline`,
        cookies: { accessToken: mom.token },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).data.status).toBe('DECLINED');

      const stored = await prisma.referral.findUnique({ where: { id: referral.id } });
      expect(stored?.status).toBe('DECLINED');
      expect(stored?.momConsent).toBe(false);

      const audit = await prisma.auditLog.findFirst({
        where: { action: 'REFERRAL_DECLINED', resourceId: referral.id },
      });
      expect(audit).not.toBeNull();
    });

    it('rejects declining a referral in an invalid state', async () => {
      const mom = await createAuthedUser(app);
      const { referral } = await seedReferral(mom.id, 'COMPLETED');

      const response = await app.inject({
        method: 'POST',
        url: `/referrals/${referral.id}/decline`,
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /referrals', () => {
    it('lists only the caller own referrals for a MOM', async () => {
      const mom = await createAuthedUser(app);
      const other = await createAuthedUser(app);
      await seedReferral(mom.id);
      await seedReferral(other.id);

      const response = await app.inject({
        method: 'GET',
        url: '/referrals',
        cookies: { accessToken: mom.token },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body).data;
      expect(data.length).toBe(1);
      expect(data[0].provider.name).toBeDefined();
    });

    it('shows a CLINICIAN referrals across patients', async () => {
      const momA = await createAuthedUser(app);
      const momB = await createAuthedUser(app);
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      await seedReferral(momA.id);
      await seedReferral(momB.id);

      const response = await app.inject({
        method: 'GET',
        url: '/referrals',
        cookies: { accessToken: clinician.token },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('PATCH /referrals/:id', () => {
    it('forbids a MOM from updating referral status', async () => {
      const mom = await createAuthedUser(app);
      const { referral } = await seedReferral(mom.id);

      const response = await app.inject({
        method: 'PATCH',
        url: `/referrals/${referral.id}`,
        cookies: { accessToken: mom.token },
        payload: { status: 'PROVIDER_NOTIFIED' },
      });
      expect(response.statusCode).toBe(403);
    });

    it('lets a CLINICIAN update status and audits', async () => {
      const mom = await createAuthedUser(app);
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const { referral } = await seedReferral(mom.id);

      const response = await app.inject({
        method: 'PATCH',
        url: `/referrals/${referral.id}`,
        cookies: { accessToken: clinician.token },
        payload: { status: 'PROVIDER_NOTIFIED' },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).success).toBe(true);

      const stored = await prisma.referral.findUnique({ where: { id: referral.id } });
      expect(stored?.status).toBe('PROVIDER_NOTIFIED');

      const audit = await prisma.auditLog.findFirst({
        where: { action: 'REFERRAL_UPDATED', resourceId: referral.id },
      });
      expect(audit).not.toBeNull();
    });

    it('returns 404 for an unknown referral', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const response = await app.inject({
        method: 'PATCH',
        url: '/referrals/does-not-exist',
        cookies: { accessToken: clinician.token },
        payload: { status: 'PROVIDER_NOTIFIED' },
      });
      expect(response.statusCode).toBe(404);
    });

    it('rejects an invalid status value', async () => {
      const mom = await createAuthedUser(app);
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const { referral } = await seedReferral(mom.id);

      const response = await app.inject({
        method: 'PATCH',
        url: `/referrals/${referral.id}`,
        cookies: { accessToken: clinician.token },
        payload: { status: 'NOT_A_STATUS' },
      });
      expect(response.statusCode).toBe(400);
    });
  });
});
