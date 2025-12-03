import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'sdm_users',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '0888',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL подключен успешно');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к PostgreSQL:', error);
    return false;
  }
}

export default pool;