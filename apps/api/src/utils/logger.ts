import { pino } from 'pino';
import type { Logger } from 'pino';

const logger: Logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
}) satisfies Logger;

export { logger };

export function createChildLogger(bindings: Record<string, unknown>) {
  return logger.child(bindings);
}
