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

async function seedOnboardedMom(email = 'mom-patient@example.com') {
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

const providerPayload = {
  name: 'Dr. Rivera',
  specialties: ['PERINATAL_MH'],
  location: { lat: 33.4, lng: -112.0, address: 'Phoenix, AZ', radiusMiles: 25 },
  insuranceAccepted: ['Aetna'],
  contactInfo: { phone: '555-0100', email: 'rivera@example.com' },
  availability: {
    nextSlotDays: 3,
    slots: [{ date: '2026-11-01', times: ['09:00', '10:00'] }],
  },
};

describe('Clinician Integration Tests', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('authorization', () => {
    it('rejects unauthenticated GET /clinician/patients', async () => {
      const response = await app.inject({ method: 'GET', url: '/clinician/patients' });
      expect(response.statusCode).toBe(401);
    });

    it('forbids MOM from GET /clinician/patients', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      const response = await app.inject({
        method: 'GET',
        url: '/clinician/patients',
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(403);
      expect(JSON.parse(response.body).error.code).toBe('FORBIDDEN');
    });

    it('forbids MOM from GET /clinician/escalations', async () => {
      const mom = await createAuthedUser(app, 'MOM');
      const response = await app.inject({
        method: 'GET',
        url: '/clinician/escalations',
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(403);
    });

    it('rejects unauthenticated GET /providers', async () => {
      const response = await app.inject({ method: 'GET', url: '/providers' });
      expect(response.statusCode).toBe(401);
    });

    it('forbids CLINICIAN from creating providers (ADMIN only)', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const response = await app.inject({
        method: 'POST',
        url: '/providers',
        cookies: { accessToken: clinician.token },
        payload: providerPayload,
      });
      expect(response.statusCode).toBe(403);
    });
  });

  describe('GET /clinician/patients', () => {
    it('returns patient summaries for clinicians', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const mom = await seedOnboardedMom();

      const response = await app.inject({
        method: 'GET',
        url: '/clinician/patients',
        cookies: { accessToken: clinician.token },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      const row = body.data.find((r: { userId: string }) => r.userId === mom.id);
      expect(row).toBeDefined();
      expect(row.email).toBe('mom-patient@example.com');
      expect(row.riskLevel).toBe('low');
      expect(row.activeEscalationCount).toBe(0);
    });
  });

  describe('GET /clinician/escalations', () => {
    it('lists pending escalations with the patient email', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const mom = await seedOnboardedMom();
      await prisma.escalation.create({
        data: {
          userId: mom.id,
          trigger: 'SLEEP_SADNESS_5DAY',
          severity: 'HIGH',
          status: 'PENDING',
          contextSummary: '5 days of sleep disruption and sadness',
        },
      });

      const response = await app.inject({
        method: 'GET',
        url: '/clinician/escalations',
        cookies: { accessToken: clinician.token },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].userEmail).toBe('mom-patient@example.com');
      expect(body.data[0].severity).toBe('HIGH');
      expect(body.data[0].trigger).toBe('SLEEP_SADNESS_5DAY');
    });
  });

  describe('GET /clinician/patients/:id', () => {
    it('returns patient detail for clinicians', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const mom = await seedOnboardedMom();

      const response = await app.inject({
        method: 'GET',
        url: `/clinician/patients/${mom.id}`,
        cookies: { accessToken: clinician.token },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.user.email).toBe('mom-patient@example.com');
      expect(body.data.onboarding.deliveryType).toBe('VAGINAL');
    });

    it('returns 404 for an unknown patient', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const response = await app.inject({
        method: 'GET',
        url: '/clinician/patients/does-not-exist',
        cookies: { accessToken: clinician.token },
      });
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body).error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /clinician/patients/:id/notes', () => {
    it('creates a clinical note and writes an audit log', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const mom = await seedOnboardedMom();

      const response = await app.inject({
        method: 'POST',
        url: `/clinician/patients/${mom.id}/notes`,
        cookies: { accessToken: clinician.token },
        payload: { content: 'Patient reports improving sleep.' },
      });

      expect(response.statusCode).toBe(201);
      const noteId = JSON.parse(response.body).data.id;

      const note = await prisma.clinicalNote.findUnique({ where: { id: noteId } });
      expect(note?.clinicianId).toBe(clinician.id);
      expect(note?.userId).toBe(mom.id);

      const audit = await prisma.auditLog.findFirst({
        where: { action: 'CLINICAL_NOTE_CREATED', resourceId: noteId },
      });
      expect(audit).not.toBeNull();
    });

    it('rejects empty note content', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const mom = await seedOnboardedMom();
      const response = await app.inject({
        method: 'POST',
        url: `/clinician/patients/${mom.id}/notes`,
        cookies: { accessToken: clinician.token },
        payload: { content: '' },
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe('PATCH /clinician/escalations/:id', () => {
    it('updates the escalation status and writes an audit log', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const mom = await seedOnboardedMom();
      const escalation = await prisma.escalation.create({
        data: {
          userId: mom.id,
          trigger: 'SLEEP_SADNESS_5DAY',
          severity: 'HIGH',
          status: 'PENDING',
          contextSummary: 'context',
        },
      });

      const response = await app.inject({
        method: 'PATCH',
        url: `/clinician/escalations/${escalation.id}`,
        cookies: { accessToken: clinician.token },
        payload: { status: 'REFERRED' },
      });

      expect(response.statusCode).toBe(200);
      const updated = await prisma.escalation.findUnique({ where: { id: escalation.id } });
      expect(updated?.status).toBe('REFERRED');

      const audit = await prisma.auditLog.findFirst({
        where: { action: 'ESCALATION_UPDATED', resourceId: escalation.id },
      });
      expect(audit).not.toBeNull();
    });

    it('returns 404 for an unknown escalation', async () => {
      const clinician = await createAuthedUser(app, 'CLINICIAN');
      const response = await app.inject({
        method: 'PATCH',
        url: '/clinician/escalations/does-not-exist',
        cookies: { accessToken: clinician.token },
        payload: { status: 'REFERRED' },
      });
      expect(response.statusCode).toBe(404);
    });
  });

  describe('providers', () => {
    it('lets ADMIN create a provider and CLINICIAN list it', async () => {
      const admin = await createAuthedUser(app, 'ADMIN');
      const clinician = await createAuthedUser(app, 'CLINICIAN');

      const create = await app.inject({
        method: 'POST',
        url: '/providers',
        cookies: { accessToken: admin.token },
        payload: providerPayload,
      });
      expect(create.statusCode).toBe(201);
      const providerId = JSON.parse(create.body).data.id;

      const audit = await prisma.auditLog.findFirst({
        where: { action: 'PROVIDER_CREATED', resourceId: providerId },
      });
      expect(audit).not.toBeNull();

      const list = await app.inject({
        method: 'GET',
        url: '/providers',
        cookies: { accessToken: clinician.token },
      });
      expect(list.statusCode).toBe(200);
      const body = JSON.parse(list.body);
      expect(body.data.some((p: { id: string }) => p.id === providerId)).toBe(true);
    });

    it('rejects an invalid provider payload', async () => {
      const admin = await createAuthedUser(app, 'ADMIN');
      const response = await app.inject({
        method: 'POST',
        url: '/providers',
        cookies: { accessToken: admin.token },
        payload: { name: '' },
      });
      expect(response.statusCode).toBe(400);
    });
  });
});
