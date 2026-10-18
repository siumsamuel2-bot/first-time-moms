import Fastify from 'fastify';
import { beforeEach, describe, expect, it } from 'vitest';
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

describe('Push Notification Integration Tests', () => {
  let app: Awaited<ReturnType<typeof createApp>>;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeEach(async () => {
    app = await createApp();

    const signupResponse = await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: {
        email: 'test@example.com',
        password: 'password123',
        role: 'MOM',
      },
    });

    const cookies = signupResponse.cookies;
    accessToken = cookies.find((c) => c.name === 'accessToken')?.value || '';
    refreshToken = cookies.find((c) => c.name === 'refreshToken')?.value || '';

    const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
    userId = user?.id || '';
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /push/public-key', () => {
    it('should return VAPID public key', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/push/public-key',
        cookies: { accessToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.publicKey).toBeDefined();
    });

    it('should reject without authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/push/public-key',
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /push/subscribe', () => {
    it('should save push subscription', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/push/subscribe',
        payload: {
          endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint',
          keys: {
            p256dh: 'test-p256dh-key',
            auth: 'test-auth-key',
          },
        },
        cookies: { accessToken },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);

      const subscription = await prisma.pushSubscription.findUnique({
        where: { userId_endpoint: { userId, endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint' } },
      });
      expect(subscription).toBeDefined();
      expect(subscription?.p256dh).toBe('test-p256dh-key');
      expect(subscription?.auth).toBe('test-auth-key');
    });

    it('should update existing subscription', async () => {
      await app.inject({
        method: 'POST',
        url: '/push/subscribe',
        payload: {
          endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint',
          keys: {
            p256dh: 'test-p256dh-key',
            auth: 'test-auth-key',
          },
        },
        cookies: { accessToken },
      });

      const response = await app.inject({
        method: 'POST',
        url: '/push/subscribe',
        payload: {
          endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint',
          keys: {
            p256dh: 'updated-p256dh-key',
            auth: 'updated-auth-key',
          },
        },
        cookies: { accessToken },
      });

      expect(response.statusCode).toBe(201);

      const subscription = await prisma.pushSubscription.findUnique({
        where: { userId_endpoint: { userId, endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint' } },
      });
      expect(subscription?.p256dh).toBe('updated-p256dh-key');
      expect(subscription?.auth).toBe('updated-auth-key');
    });
  });

  describe('DELETE /push/unsubscribe', () => {
    it('should delete push subscription', async () => {
      await app.inject({
        method: 'POST',
        url: '/push/subscribe',
        payload: {
          endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint',
          keys: {
            p256dh: 'test-p256dh-key',
            auth: 'test-auth-key',
          },
        },
        cookies: { accessToken },
      });

      const response = await app.inject({
        method: 'DELETE',
        url: '/push/unsubscribe',
        payload: { endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint' },
        cookies: { accessToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);

      const subscription = await prisma.pushSubscription.findUnique({
        where: { userId_endpoint: { userId, endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint' } },
      });
      expect(subscription).toBeNull();
    });
  });

  describe('POST /push/test-daily-reminder', () => {
    it('should send daily check-in reminder', async () => {
      await app.inject({
        method: 'POST',
        url: '/push/subscribe',
        payload: {
          endpoint: 'https://fcm.googleapis.com/fcm/send/test-endpoint',
          keys: {
            p256dh: 'test-p256dh-key',
            auth: 'test-auth-key',
          },
        },
        cookies: { accessToken },
      });

      const response = await app.inject({
        method: 'POST',
        url: '/push/test-daily-reminder',
        cookies: { accessToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.sent).toBeGreaterThanOrEqual(0);
    });
  });
});