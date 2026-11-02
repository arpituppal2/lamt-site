import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ...(process.env.DATABASE_SSL === 'true' ? {
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.DATABASE_SSL_CA || undefined,
    },
  } : {}),
  max: 20,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('pool client error (will auto-reconnect on next query)', err.message);
});

export default pool;