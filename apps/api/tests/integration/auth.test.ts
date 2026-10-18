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

describe('Auth Integration Tests', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeEach(async () => {
    app = await createApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/signup', () => {
    it('should create a new user and return tokens', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'test@example.com',
          password: 'password123',
          role: 'MOM',
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.user.email).toBe('test@example.com');
      expect(body.data.user.role).toBe('MOM');
      expect(body.data.user.emailVerified).toBe(false);
      expect(body.data.accessToken).toBeDefined();
      expect(body.data.refreshToken).toBeDefined();
      expect(response.cookies.find((c) => c.name === 'accessToken')?.value).toBeDefined();
      expect(response.cookies.find((c) => c.name === 'refreshToken')?.value).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      });

      const response = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(409);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('EMAIL_EXISTS');
    });

    it('should validate email format', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'invalid-email',
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should validate password length', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'test@example.com',
          password: 'short',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      });

      await prisma.user.update({
        where: { email: 'test@example.com' },
        data: { emailVerified: true },
      });
    });

    it('should login with valid credentials', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.user.email).toBe('test@example.com');
      expect(body.data.accessToken).toBeDefined();
      expect(body.data.refreshToken).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject non-existent user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'nonexistent@example.com',
          password: 'password123',
        },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('POST /auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const signupResponse = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const cookies = signupResponse.cookies;
      refreshToken = cookies.find((c) => c.name === 'refreshToken')?.value || '';
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        cookies: { refreshToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.accessToken).toBeDefined();
      expect(body.data.refreshToken).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        cookies: { refreshToken: 'invalid-token' },
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('INVALID_REFRESH_TOKEN');
    });

    it('should reject missing refresh token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
      });

      expect(response.statusCode).toBe(401);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('NO_REFRESH_TOKEN');
    });
  });

  describe('POST /auth/logout', () => {
    it('should clear cookies', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/logout',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      const accessTokenCookie = response.cookies.find((c) => c.name === 'accessToken');
      const refreshTokenCookie = response.cookies.find((c) => c.name === 'refreshToken');
      expect(accessTokenCookie).toBeDefined();
      expect(accessTokenCookie?.value).toBe('');
      expect(refreshTokenCookie?.value).toBe('');
    });
  });

  describe('GET /auth/me', () => {
    let accessToken: string;

    beforeEach(async () => {
      const signupResponse = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
      const cookies = signupResponse.cookies;
      accessToken = cookies.find((c) => c.name === 'accessToken')?.value || '';
    });

    it('should return user with valid access token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
        cookies: { accessToken },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.user.email).toBe('test@example.com');
    });

    it('should reject missing access token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/me',
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /auth/forgot-password', () => {
    beforeEach(async () => {
      await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
    });

    it('should return success for existing email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/forgot-password',
        payload: { email: 'test@example.com' },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.message).toContain('reset link has been sent');
    });

    it('should return success for non-existent email (to prevent enumeration)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/forgot-password',
        payload: { email: 'nonexistent@example.com' },
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /auth/reset-password', () => {
    let resetToken: string;

    beforeEach(async () => {
      await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      });

      await prisma.user.update({
        where: { email: 'test@example.com' },
        data: { emailVerified: true },
      });

      const forgotResponse = await app.inject({
        method: 'POST',
        url: '/auth/forgot-password',
        payload: { email: 'test@example.com' },
      });
      void forgotResponse;

      const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
      resetToken = user?.passwordResetToken || '';
    });

    it('should reset password with valid token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/reset-password',
        payload: { token: resetToken, password: 'newpassword123' },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.message).toBe('Password has been reset successfully');

      const loginResponse = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { email: 'test@example.com', password: 'newpassword123' },
      });
      expect(loginResponse.statusCode).toBe(200);
    });

    it('should reject invalid token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/reset-password',
        payload: { token: 'invalid-token', password: 'newpassword123' },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('INVALID_TOKEN');
    });

    it('should reject expired token', async () => {
      await prisma.user.update({
        where: { email: 'test@example.com' },
        data: { passwordResetExpires: new Date(Date.now() - 1000) },
      });

      const response = await app.inject({
        method: 'POST',
        url: '/auth/reset-password',
        payload: { token: resetToken, password: 'newpassword123' },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('GET /auth/verify-email', () => {
    let verificationToken: string;

    beforeEach(async () => {
      await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      });

      const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
      verificationToken = user?.emailVerificationToken || '';
    });

    it('should verify email with valid token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/auth/verify-email?token=${verificationToken}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.message).toBe('Email verified successfully');

      const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
      expect(user?.emailVerified).toBe(true);
    });

    it('should reject invalid token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/auth/verify-email?token=invalid-token',
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('INVALID_TOKEN');
    });

    it('should reject expired token', async () => {
      await prisma.user.update({
        where: { email: 'test@example.com' },
        data: { emailVerificationExpires: new Date(Date.now() - 1000) },
      });

      const response = await app.inject({
        method: 'GET',
        url: `/auth/verify-email?token=${verificationToken}`,
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /auth/resend-verification', () => {
    beforeEach(async () => {
      await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      });
    });

    it('should resend verification email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/resend-verification',
        payload: { email: 'test@example.com' },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.message).toContain('verification link has been sent');
    });

    it('should reject already verified email', async () => {
      await prisma.user.update({
        where: { email: 'test@example.com' },
        data: { emailVerified: true },
      });

      const response = await app.inject({
        method: 'POST',
        url: '/auth/resend-verification',
        payload: { email: 'test@example.com' },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('ALREADY_VERIFIED');
    });

    it('should return success for non-existent email (to prevent enumeration)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/resend-verification',
        payload: { email: 'nonexistent@example.com' },
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('NOT_FOUND');
    });
  });
});
