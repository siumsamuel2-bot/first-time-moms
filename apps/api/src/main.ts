import Fastify from 'fastify';
import { config } from './config.js';
import { registerPlugins } from './plugins/index.js';
import { registerRoutes } from './routes/index.js';
import { scheduleDailyJobs, scheduleWeeklyAnalyticsExport } from './services/scheduler.js';
import { logger } from './utils/logger.js';

async function main() {
  const app = Fastify({
    logger: config.NODE_ENV === 'development' ? { transport: { target: 'pino-pretty' } } : false,
    ajv: { customOptions: { coerceTypes: 'array' } },
  });

  await registerPlugins(app);
  await registerRoutes(app);

  if (config.NODE_ENV === 'production') {
    scheduleDailyJobs('0 9 * * *');
    scheduleWeeklyAnalyticsExport('0 2 * * 0');
  } else if (config.NODE_ENV === 'development') {
    scheduleDailyJobs('0 * * * *');
    logger.info('Daily job scheduler enabled in development (runs hourly)');
  }

  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    logger.info(`Server listening on ${config.HOST}:${config.PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

main();
