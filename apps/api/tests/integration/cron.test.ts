import Fastify from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { config } from '../../src/config.js';
import { registerPlugins } from '../../src/plugins/index.js';
import { registerRoutes } from '../../src/routes/index.js';

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

describe('Cron Sweeper Integration Tests', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects a request with no cron secret', async () => {
    const response = await app.inject({ method: 'POST', url: '/api/cron/sweeper' });
    expect(response.statusCode).toBe(401);
  });

  it('rejects a request with the wrong cron secret', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/cron/sweeper',
      headers: { 'x-cron-secret': 'definitely-not-the-secret' },
    });
    expect(response.statusCode).toBe(401);
  });

  it('rejects a wrong secret passed as a query param', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/cron/sweeper?cron_secret=wrong',
    });
    expect(response.statusCode).toBe(401);
  });

  it('does not treat a missing configured secret as open access', async () => {
    const original = config.CRON_SECRET;
    (config as { CRON_SECRET: string | undefined }).CRON_SECRET = undefined;
    try {
      const response = await app.inject({
        method: 'POST',
        url: '/api/cron/sweeper',
        headers: { 'x-cron-secret': 'anything' },
      });
      expect(response.statusCode).toBe(401);
    } finally {
      (config as { CRON_SECRET: string | undefined }).CRON_SECRET = original;
    }
  });
});
