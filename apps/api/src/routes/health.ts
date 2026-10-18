import { Type } from '@sinclair/typebox';
import type { FastifyInstance } from 'fastify';
import { config } from '../config.js';
import { prisma } from '../utils/prisma.js';

const HealthResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    status: Type.String(),
    timestamp: Type.String(),
    version: Type.String(),
    environment: Type.String(),
    database: Type.String(),
  }),
});

export async function healthRoutes(app: FastifyInstance) {
  app.get('/healthz', { schema: { response: { 200: HealthResponse } } }, async () => {
    let dbStatus = 'unknown';
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch {
      dbStatus = 'disconnected';
    }

    return {
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '0.1.0',
        environment: config.NODE_ENV,
        database: dbStatus,
      },
    };
  });
}
