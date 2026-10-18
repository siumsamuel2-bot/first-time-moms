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
  const email = `${role.toLowerCase()}-onb-${Date.now()}-${userSeq++}@example.com`;
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

function isoDay(daysAgo: number): string {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysAgo));
  return d.toISOString().slice(0, 10);
}

function quiz(overrides: Record<string, unknown> = {}) {
  return {
    deliveryDate: isoDay(21),
    deliveryType: 'VAGINAL',
    feedingMethod: 'BREASTFEEDING',
    mentalHealthBaseline: { phq2Score: 1, gad2Score: 1 },
    complications: [],
    ...overrides,
  };
}

describe('Onboarding Integration Tests', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /onboarding/quiz', () => {
    it('rejects unauthenticated requests', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/onboarding/quiz',
        payload: quiz(),
      });
      expect(response.statusCode).toBe(401);
    });

    it('creates onboarding, marks it complete, and audits', async () => {
      const mom = await createAuthedUser(app);
      const response = await app.inject({
        method: 'POST',
        url: '/onboarding/quiz',
        cookies: { accessToken: mom.token },
        payload: quiz(),
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.userId).toBe(mom.id);
      expect(body.data.deliveryType).toBe('VAGINAL');
      expect(body.data.completedAt).toBeDefined();

      const audit = await prisma.auditLog.findFirst({
        where: { action: 'ONBOARDING_COMPLETE', resourceId: body.data.id },
      });
      expect(audit).not.toBeNull();
    });

    it('rejects a second onboarding with 409', async () => {
      const mom = await createAuthedUser(app);
      await app.inject({
        method: 'POST',
        url: '/onboarding/quiz',
        cookies: { accessToken: mom.token },
        payload: quiz(),
      });
      const response = await app.inject({
        method: 'POST',
        url: '/onboarding/quiz',
        cookies: { accessToken: mom.token },
        payload: quiz(),
      });
      expect(response.statusCode).toBe(409);
      expect(JSON.parse(response.body).error.code).toBe('ONBOARDING_EXISTS');
    });

    it('rejects an invalid delivery type', async () => {
      const mom = await createAuthedUser(app);
      const response = await app.inject({
        method: 'POST',
        url: '/onboarding/quiz',
        cookies: { accessToken: mom.token },
        payload: quiz({ deliveryType: 'TELEPORT' }),
      });
      expect(response.statusCode).toBe(400);
    });

    it('rejects an out-of-range mental health score', async () => {
      const mom = await createAuthedUser(app);
      const response = await app.inject({
        method: 'POST',
        url: '/onboarding/quiz',
        cookies: { accessToken: mom.token },
        payload: quiz({ mentalHealthBaseline: { phq2Score: 9, gad2Score: 1 } }),
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /onboarding/quiz', () => {
    it('returns 404 before onboarding', async () => {
      const mom = await createAuthedUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/onboarding/quiz',
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(404);
    });

    it('returns the saved onboarding after completion', async () => {
      const mom = await createAuthedUser(app);
      await app.inject({
        method: 'POST',
        url: '/onboarding/quiz',
        cookies: { accessToken: mom.token },
        payload: quiz({ feedingMethod: 'PUMPING' }),
      });
      const response = await app.inject({
        method: 'GET',
        url: '/onboarding/quiz',
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).data.feedingMethod).toBe('PUMPING');
    });
  });

  describe('GET /onboarding/profile', () => {
    it('returns 404 before onboarding', async () => {
      const mom = await createAuthedUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/onboarding/profile',
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(404);
    });

    it('derives risk flags and needs for a high-risk C-section mom', async () => {
      const mom = await createAuthedUser(app);
      await app.inject({
        method: 'POST',
        url: '/onboarding/quiz',
        cookies: { accessToken: mom.token },
        payload: quiz({
          deliveryType: 'C_SECTION',
          feedingMethod: 'COMBO',
          mentalHealthBaseline: { phq2Score: 4, gad2Score: 3 },
          complications: ['preeclampsia'],
        }),
      });

      const response = await app.inject({
        method: 'GET',
        url: '/onboarding/profile',
        cookies: { accessToken: mom.token },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.body).data;
      expect(data.riskFlags).toEqual(
        expect.arrayContaining(['elevated_phq2', 'elevated_gad2', 'c_section', 'preeclampsia'])
      );
      expect(data.needsMentalHealth).toBe(true);
      expect(data.needsLactation).toBe(true);
      expect(data.needsPelvicFloor).toBe(false);
      expect(data.weeksPostpartum).toBeGreaterThanOrEqual(0);
    });

    it('derives needs for a low-risk vaginal/formula mom', async () => {
      const mom = await createAuthedUser(app);
      await app.inject({
        method: 'POST',
        url: '/onboarding/quiz',
        cookies: { accessToken: mom.token },
        payload: quiz({
          deliveryType: 'VAGINAL',
          feedingMethod: 'FORMULA',
          mentalHealthBaseline: { phq2Score: 0, gad2Score: 0 },
        }),
      });

      const response = await app.inject({
        method: 'GET',
        url: '/onboarding/profile',
        cookies: { accessToken: mom.token },
      });

      const data = JSON.parse(response.body).data;
      expect(data.riskFlags).toEqual([]);
      expect(data.needsMentalHealth).toBe(false);
      expect(data.needsLactation).toBe(false);
      expect(data.needsPelvicFloor).toBe(true);
    });
  });

  describe('GET /questions/today', () => {
    it('returns 400 before onboarding', async () => {
      const mom = await createAuthedUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/questions/today',
        cookies: { accessToken: mom.token },
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).error.code).toBe('ONBOARDING_REQUIRED');
    });

    it('returns today questions after onboarding', async () => {
      const mom = await createAuthedUser(app);
      await app.inject({
        method: 'POST',
        url: '/onboarding/quiz',
        cookies: { accessToken: mom.token },
        payload: quiz(),
      });
      const response = await app.inject({
        method: 'GET',
        url: '/questions/today',
        cookies: { accessToken: mom.token },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body.data.questions)).toBe(true);
      expect(typeof body.data.maxQuestions).toBe('number');
    });
  });
});
