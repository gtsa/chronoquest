import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@db:5432/${process.env.POSTGRES_DB}`
});


export default pool;
