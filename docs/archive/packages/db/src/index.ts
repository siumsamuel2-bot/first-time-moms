import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://firstweeks:firstweeks_dev@localhost:5432/firstweeks',
});

export const db = drizzle(pool, { schema });
export * from './schema';
export type DB = typeof db;