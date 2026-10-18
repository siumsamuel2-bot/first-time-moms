import crypto from 'node:crypto';
import { Role, type Role as SharedRole } from '@firstweeks/shared';
import { Type } from '@sinclair/typebox';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../config.js';
import { authenticate } from '../middleware/auth.js';
import {
  clearTokenCookies,
  generateTokens,
  hashPassword,
  setTokenCookies,
  verifyPassword,
} from '../utils/auth.js';
import { prisma } from '../utils/prisma.js';

const HealthResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    status: Type.String(),
    timestamp: Type.String(),
    version: Type.String(),
    environment: Type.String(),
  }),
});

const SignupBody = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String({ minLength: 8, maxLength: 128 }),
  role: Type.Optional(Type.Enum(Role)),
});

const LoginBody = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});

const AuthResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    user: Type.Object({
      id: Type.String(),
      email: Type.String(),
      role: Type.Enum(Role),
      emailVerified: Type.Boolean(),
    }),
    accessToken: Type.String(),
    refreshToken: Type.String(),
  }),
});

const ForgotPasswordBody = Type.Object({
  email: Type.String({ format: 'email' }),
});

const ResetPasswordBody = Type.Object({
  token: Type.String(),
  password: Type.String({ minLength: 8, maxLength: 128 }),
});

const MessageResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    message: Type.String(),
  }),
});

const VerifyEmailBody = Type.Object({
  token: Type.String(),
});

const ResendVerificationBody = Type.Object({
  email: Type.String({ format: 'email' }),
});

type SignupBodyType = {
  email: string;
  password: string;
  role?: SharedRole;
};

type LoginBodyType = {
  email: string;
  password: string;
};

type ForgotPasswordBodyType = {
  email: string;
};

type ResetPasswordBodyType = {
  token: string;
  password: string;
};

type VerifyEmailBodyType = {
  token: string;
};

type ResendVerificationBodyType = {
  email: string;
};

export async function healthRoutes(app: FastifyInstance) {
  app.get('/healthz', { schema: { response: { 200: HealthResponse } } }, async () => ({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      environment: config.NODE_ENV,
    },
  }));
}

export async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: SignupBodyType }>(
    '/auth/signup',
    {
      schema: { body: SignupBody, response: { 201: AuthResponse } },
    },
    async (request, reply) => {
      const { email, password, role = Role.MOM } = request.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return reply.code(409).send({
          success: false,
          error: { code: 'EMAIL_EXISTS', message: 'Email already registered' },
        });
      }

      const passwordHash = await hashPassword(password);
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role,
          emailVerificationToken: verificationToken,
          emailVerificationExpires: expires,
        },
        select: { id: true, email: true, role: true, emailVerified: true },
      });

      const { accessToken, refreshToken } = generateTokens(app, user);
      setTokenCookies(reply, accessToken, refreshToken);

      await prisma.auditLog.create({
        data: { userId: user.id, action: 'SIGNUP', resource: 'user', resourceId: user.id },
      });

      console.log(`[DEV] Email verification token for ${email}: ${verificationToken}`);

      return reply.code(201).send({ success: true, data: { user, accessToken, refreshToken } });
    }
  );

  app.post<{ Body: LoginBodyType }>(
    '/auth/login',
    {
      schema: { body: LoginBody, response: { 200: AuthResponse } },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        return reply.code(401).send({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        });
      }

      if (!user.emailVerified) {
        return reply.code(403).send({
          success: false,
          error: {
            code: 'EMAIL_NOT_VERIFIED',
            message: 'Please verify your email before logging in',
          },
        });
      }

      const { accessToken, refreshToken } = generateTokens(app, user);
      setTokenCookies(reply, accessToken, refreshToken);

      await prisma.auditLog.create({
        data: { userId: user.id, action: 'LOGIN', resource: 'user', resourceId: user.id },
      });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
          },
          accessToken,
          refreshToken,
        },
      };
    }
  );

  app.post('/auth/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = request.cookies.refreshToken;
    if (!refreshToken) {
      return reply.code(401).send({
        success: false,
        error: { code: 'NO_REFRESH_TOKEN', message: 'Refresh token required' },
      });
    }

    try {
      const payload = app.jwt.verify<{ sub: string; role: SharedRole }>(refreshToken);
      const user = await prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new Error('User not found');

      const tokens = generateTokens(app, user);
      setTokenCookies(reply, tokens.accessToken, tokens.refreshToken);

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            emailVerified: user.emailVerified,
          },
          ...tokens,
        },
      };
    } catch {
      clearTokenCookies(reply);
      return reply.code(401).send({
        success: false,
        error: { code: 'INVALID_REFRESH_TOKEN', message: 'Invalid or expired refresh token' },
      });
    }
  });

  app.post('/auth/logout', async (_request: FastifyRequest, reply: FastifyReply) => {
    clearTokenCookies(reply);
    return { success: true, data: { message: 'Logged out successfully' } };
  });

  app.post<{ Body: ForgotPasswordBodyType }>(
    '/auth/forgot-password',
    {
      schema: { body: ForgotPasswordBody, response: { 200: MessageResponse } },
    },
    async (request, reply) => {
      const { email } = request.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return reply.code(404).send({
          success: false,
          error: { code: 'NOT_FOUND', message: 'User not found' },
        });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordResetToken: resetToken, passwordResetExpires: expires },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'FORGOT_PASSWORD_REQUESTED',
          resource: 'user',
          resourceId: user.id,
        },
      });

      console.log(`[DEV] Password reset token for ${email}: ${resetToken}`);

      return {
        success: true,
        data: { message: 'If the email exists, a reset link has been sent' },
      };
    }
  );

  app.post<{ Body: ResetPasswordBodyType }>(
    '/auth/reset-password',
    {
      schema: { body: ResetPasswordBody, response: { 200: MessageResponse } },
    },
    async (request, reply) => {
      const { token, password } = request.body;

      const user = await prisma.user.findFirst({
        where: {
          passwordResetToken: token,
          passwordResetExpires: { gt: new Date() },
        },
      });

      if (!user) {
        return reply.code(400).send({
          success: false,
          error: { code: 'INVALID_TOKEN', message: 'Invalid or expired reset token' },
        });
      }

      const passwordHash = await hashPassword(password);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'PASSWORD_RESET',
          resource: 'user',
          resourceId: user.id,
        },
      });

      return { success: true, data: { message: 'Password has been reset successfully' } };
    }
  );

  app.get<{ Querystring: VerifyEmailBodyType }>(
    '/auth/verify-email',
    {
      schema: { querystring: VerifyEmailBody, response: { 200: MessageResponse } },
    },
    async (request, reply) => {
      const { token } = request.query;

      const user = await prisma.user.findFirst({
        where: {
          emailVerificationToken: token,
          emailVerificationExpires: { gt: new Date() },
        },
      });

      if (!user) {
        return reply.code(400).send({
          success: false,
          error: { code: 'INVALID_TOKEN', message: 'Invalid or expired verification token' },
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'EMAIL_VERIFIED',
          resource: 'user',
          resourceId: user.id,
        },
      });

      return { success: true, data: { message: 'Email verified successfully' } };
    }
  );

  app.post<{ Body: ResendVerificationBodyType }>(
    '/auth/resend-verification',
    {
      schema: { body: ResendVerificationBody, response: { 200: MessageResponse } },
    },
    async (request, reply) => {
      const { email } = request.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return reply.code(404).send({
          success: false,
          error: { code: 'NOT_FOUND', message: 'User not found' },
        });
      }

      if (user.emailVerified) {
        return reply.code(400).send({
          success: false,
          error: { code: 'ALREADY_VERIFIED', message: 'Email is already verified' },
        });
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerificationToken: verificationToken, emailVerificationExpires: expires },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'VERIFICATION_EMAIL_RESENT',
          resource: 'user',
          resourceId: user.id,
        },
      });

      console.log(`[DEV] Email verification token for ${email}: ${verificationToken}`);

      return {
        success: true,
        data: { message: 'If the email exists, a verification link has been sent' },
      };
    }
  );

  app.get(
    '/auth/me',
    { preHandler: [authenticate()] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = request.user as { sub?: string; id?: string };
      const userId = payload.sub ?? payload.id;

      if (!userId) {
        return reply.code(401).send({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true, emailVerified: true },
      });

      if (!user) {
        return reply.code(404).send({
          success: false,
          error: { code: 'NOT_FOUND', message: 'User not found' },
        });
      }

      return { success: true, data: { user } };
    }
  );
}
