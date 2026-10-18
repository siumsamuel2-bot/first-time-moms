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
  const email = `${role.toLowerCase()}-search-${Date.now()}-${userSeq++}@example.com`;
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

async function onboard(userId: string) {
  await prisma.onboarding.create({
    data: {
      userId,
      deliveryDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      deliveryType: 'VAGINAL',
      feedingMethod: 'BREASTFEEDING',
      mentalHealthBaseline: { phq2Score: 4, gad2Score: 2 },
      complications: [],
      completedAt: new Date(),
    },
  });
}

// A provider row written by the legacy `seed-providers.ts` shape. The rest of
// the system expects canonical `lat/lng/radiusMiles` + `nextSlotDays`.
async function createLegacyShapedProvider(email: string) {
  return prisma.provider.create({
    data: {
      name: 'Legacy Shape Provider',
      specialties: ['PERINATAL_MH'],
      location: {
        address: '1200 Medical Center Dr',
        city: 'Atlanta',
        state: 'GA',
        zipCode: '30322',
        latitude: 33.8321,
        longitude: -84.3213,
      },
      insuranceAccepted: ['Aetna'],
      screeningStatus: 'APPROVED',
      availability: {
        days: ['Monday', 'Wednesday'],
        hours: { start: '09:00', end: '17:00' },
        virtual: true,
        inPerson: true,
      },
      contactInfo: { phone: '(404) 555-0999', email, website: 'https://legacy.example.com' },
    },
  });
}

describe('Provider search normalization', () => {
  let app: Awaited<ReturnType<typeof createApp>>;
  const createdProviderIds: string[] = [];

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await prisma.provider.deleteMany({ where: { id: { in: createdProviderIds } } });
    await app.close();
  });

  it('matches a legacy-shaped seeded provider instead of returning an empty list', async () => {
    const mom = await createAuthedUser(app, 'MOM');
    await onboard(mom.id);
    const provider = await createLegacyShapedProvider(`legacy-${Date.now()}@example.com`);
    createdProviderIds.push(provider.id);

    const response = await app.inject({
      method: 'GET',
      url: '/providers/search?insurance=Aetna',
      cookies: { accessToken: mom.token },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    const match = body.data.find((m: { provider: { id: string } }) => m.provider.id === provider.id);

    expect(match).toBeDefined();
    expect(Number.isFinite(match.score)).toBe(true);
    expect(match.score).toBeGreaterThanOrEqual(30);
    expect(match.provider.location.lat).toBeCloseTo(33.8321);
    expect(match.provider.location.lng).toBeCloseTo(-84.3213);
    expect(match.provider.location.radiusMiles).toBeGreaterThan(0);
    expect(match.provider.availability.nextSlotDays).toBeGreaterThanOrEqual(0);
  });

  it('returns an empty list when the mom has not onboarded', async () => {
    const mom = await createAuthedUser(app, 'MOM');

    const response = await app.inject({
      method: 'GET',
      url: '/providers/search',
      cookies: { accessToken: mom.token },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).data).toEqual([]);
  });

  it('normalizes provider rows for the clinician directory', async () => {
    const provider = await createLegacyShapedProvider(`legacy-clinical-${Date.now()}@example.com`);
    createdProviderIds.push(provider.id);
    const clinician = await createAuthedUser(app, 'CLINICIAN');

    const response = await app.inject({
      method: 'GET',
      url: '/providers',
      cookies: { accessToken: clinician.token },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    const row = body.data.find((p: { id: string }) => p.id === provider.id);

    expect(row).toBeDefined();
    expect(row.location.lat).toBeCloseTo(33.8321);
    expect(row.location.lng).toBeCloseTo(-84.3213);
    expect(row.availability.nextSlotDays).toBeGreaterThanOrEqual(0);
  });
});
