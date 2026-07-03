import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

function createPool() {
  return new Pool({
    connectionString:
      process.env.DATABASE_URL ??
      'postgres://firstweeks:firstweeks_dev@localhost:5432/firstweeks',
  });
}

// Lazy-initialize pool so tests can mock before first use
let _pool: Pool | undefined;
function getPool() {
  if (!_pool) {
    _pool = createPool();
  }
  return _pool;
}

export const db = drizzle({ client: getPool(), schema });
export * from './schema';
export type DB = typeof db;
