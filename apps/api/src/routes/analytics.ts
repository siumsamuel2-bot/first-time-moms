import { Role } from '@firstweeks/shared';
import { Type } from '@sinclair/typebox';
import type { FastifyInstance } from 'fastify';
import { config } from '../config.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { runAnalyticsExport } from '../services/scheduler.js';

const ErrorSchema = Type.Object({
  success: Type.Literal(false),
  error: Type.Object({
    code: Type.String(),
    message: Type.String(),
  }),
});

const AnalyticsExportResponseSchema = Type.Object({
  success: Type.Boolean(),
  message: Type.String(),
});

export async function analyticsRoutes(app: FastifyInstance) {
  app.post(
    '/analytics/export',
    {
      schema: {
        tags: ['Analytics'],
        security: [{ bearerAuth: [] }],
        response: {
          200: AnalyticsExportResponseSchema,
          401: ErrorSchema,
          403: ErrorSchema,
        },
      },
      preHandler: [authenticate(), authorize(Role.ADMIN)],
    },
    async (_request, reply) => {
      if (config.NODE_ENV !== 'production' && config.NODE_ENV !== 'staging') {
        return reply.status(403).send({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Analytics export only available in production/staging',
          },
        });
      }

      // Run asynchronously
      runAnalyticsExport().catch((err) => {
        console.error('Analytics export failed:', err);
      });

      return { success: true, message: 'Analytics export started' };
    }
  );
}
