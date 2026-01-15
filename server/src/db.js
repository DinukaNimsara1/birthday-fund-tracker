import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Only load .env file in local development (Azure uses Application Settings)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'birthday_fund_tracker',
  DB_PORT = 3306,
} = process.env;

let pool;

export async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function initSchema() {
  const pool = await getPool();

  // Simple key/value table to store JSON app state
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_storage (
      \`key\` VARCHAR(255) PRIMARY KEY,
      \`value\` JSON NULL
    )
  `);
}


