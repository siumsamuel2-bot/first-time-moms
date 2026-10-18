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
  const email = `${role.toLowerCase()}-an-${Date.now()}-${userSeq++}@example.com`;
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

describe('Analytics Export Integration Tests', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects unauthenticated requests', async () => {
    const response = await app.inject({ method: 'POST', url: '/analytics/export' });
    expect(response.statusCode).toBe(401);
  });

  it('forbids a MOM', async () => {
    const mom = await createAuthedUser(app);
    const response = await app.inject({
      method: 'POST',
      url: '/analytics/export',
      cookies: { accessToken: mom.token },
    });
    expect(response.statusCode).toBe(403);
  });

  it('forbids a CLINICIAN', async () => {
    const clinician = await createAuthedUser(app, 'CLINICIAN');
    const response = await app.inject({
      method: 'POST',
      url: '/analytics/export',
      cookies: { accessToken: clinician.token },
    });
    expect(response.statusCode).toBe(403);
  });

  it('blocks an ADMIN outside production/staging with FORBIDDEN', async () => {
    const admin = await createAuthedUser(app, 'ADMIN');
    const response = await app.inject({
      method: 'POST',
      url: '/analytics/export',
      cookies: { accessToken: admin.token },
    });

    expect(response.statusCode).toBe(403);
    expect(JSON.parse(response.body).error.code).toBe('FORBIDDEN');
  });
});
