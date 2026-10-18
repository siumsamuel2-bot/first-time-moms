export const config = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 8080),
  HOST: process.env.HOST ?? '0.0.0.0',

  DATABASE_URL:
    process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/firstweeks',

  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
  JWT_ACCESS_TTL: '15m',
  JWT_REFRESH_TTL: '7d',

  BCRYPT_ROUNDS: 12,

  RATE_LIMIT_MAX: 100,
  RATE_LIMIT_WINDOW: '1 minute',

  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',

  PUSH_VAPID_PUBLIC_KEY: process.env.PUSH_VAPID_PUBLIC_KEY,
  PUSH_VAPID_PRIVATE_KEY: process.env.PUSH_VAPID_PRIVATE_KEY,
  PUSH_VAPID_SUBJECT: process.env.PUSH_VAPID_SUBJECT ?? 'mailto:admin@firstweeks.app',

  ANALYTICS_SALT: process.env.ANALYTICS_SALT ?? 'firstweeks-analytics-salt-change-in-production',
  ANALYTICS_BUCKET: process.env.ANALYTICS_BUCKET ?? 'firstweeks-analytics',
  AWS_REGION: process.env.AWS_REGION ?? 'us-east-1',

  PAPERCLIP_API_URL: process.env.PAPERCLIP_API_URL,
  PAPERCLIP_API_KEY: process.env.PAPERCLIP_API_KEY,
  PAPERCLIP_COMPANY_ID: process.env.PAPERCLIP_COMPANY_ID,
  PAPERCLIP_RUN_ID: process.env.PAPERCLIP_RUN_ID,

  SWEEPER_ENABLED: process.env.SWEEPER_ENABLED === 'true',
  SWEEPER_SHADOW: process.env.SWEEPER_SHADOW ?? 'true',
  CRON_SECRET: process.env.CRON_SECRET,
} as const;

export type Config = typeof config;
