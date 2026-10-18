import type { FastifyInstance, FastifyRequest } from 'fastify';
import { config } from '../config.js';
import { checkSweeperScope, runSweeper } from '../lib/paperclip.js';
import { logger } from '../utils/logger.js';

interface SweeperQuery {
  cron_secret?: string;
  check_scope?: string;
}

async function cronRoutes(app: FastifyInstance) {
  app.post<{ Querystring: SweeperQuery }>(
    '/api/cron/sweeper',
    async (request: FastifyRequest<{ Querystring: SweeperQuery }>, reply) => {
      const cronSecret = request.headers['x-cron-secret'] ?? request.query?.cron_secret;
      if (!config.CRON_SECRET || cronSecret !== config.CRON_SECRET) {
        logger.warn('Invalid or missing CRON_SECRET');
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      const checkScope =
        request.query?.check_scope === 'true' || request.query?.check_scope === '1';

      if (checkScope) {
        logger.info('Running sweeper scope check');
        const result = await checkSweeperScope();
        return reply.send({
          success: result.canClearLocks,
          canClearLocks: result.canClearLocks,
          error: result.error,
          message: result.canClearLocks
            ? 'Scope check passed: sweeper can clear executionRunId locks'
            : `Scope check failed: ${result.error}`,
        });
      }

      const shadowMode = config.SWEEPER_SHADOW !== 'false';
      const result = await runSweeper(shadowMode);

      return reply.send({
        success: result.errors.length === 0,
        shadowMode,
        checked: result.checked,
        released: result.released.length,
        releases: result.released,
        errors: result.errors,
      });
    }
  );
}

export { cronRoutes };
