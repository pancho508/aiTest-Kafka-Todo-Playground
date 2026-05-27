import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'tododb',
  user: process.env.POSTGRES_USER || 'todouser',
  password: process.env.POSTGRES_PASSWORD || 'todopass',
});

export async function connectDatabase() {
  try {
    const client = await pool.connect();
    console.log('[Service A] Database connected');
    client.release();
  } catch (error) {
    console.error('[Service A] Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  await pool.end();
  console.log('[Service A] Database disconnected');
}
