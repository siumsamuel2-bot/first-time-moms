import type { FastifyInstance } from 'fastify';
import { config } from '../config.js';
import { prisma } from '../utils/prisma.js';

export async function registerPlugins(app: FastifyInstance) {
  await app.register(import('@fastify/helmet'), {
    contentSecurityPolicy: false,
  });

  await app.register(import('@fastify/cors'), {
    origin: config.CORS_ORIGIN,
    credentials: true,
  });

  await app.register(import('@fastify/cookie'), {
    secret: config.JWT_SECRET,
    hook: 'onRequest',
    parseOptions: {},
  });

  await app.register(import('@fastify/rate-limit'), {
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_WINDOW,
  });

  await app.register(import('@fastify/sensible'));

  await app.register(import('@fastify/jwt'), {
    secret: config.JWT_SECRET,
    cookie: { cookieName: 'accessToken', signed: false },
    sign: { expiresIn: config.JWT_ACCESS_TTL },
  });

  await app.register(import('@fastify/swagger'), {
    openapi: {
      info: {
        title: 'Firstweeks API',
        version: '0.1.0',
        description: 'Postpartum support API',
      },
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          cookieAuth: { type: 'apiKey', in: 'cookie', name: 'accessToken' },
        },
      },
      security: [{ bearerAuth: [], cookieAuth: [] }],
    },
  });

  await app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list', deepLinking: true },
  });

  app.decorate('prisma', prisma);

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}
