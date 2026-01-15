import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getPool, initSchema } from './db.js';

// Only load .env file in local development (Azure uses Application Settings)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
}));
app.use(express.json());

// Simple health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Storage API – backs your existing window.storage.{get,set,delete}
app.get('/api/storage/:key', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.query(
      'SELECT `value` FROM app_storage WHERE `key` = ?',
      [req.params.key],
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ key: req.params.key, value: rows[0].value });
  } catch (err) {
    console.error('GET /api/storage error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/storage/:key', async (req, res) => {
  try {
    const pool = await getPool();
    const { value } = req.body;

    await pool.query(
      'INSERT INTO app_storage (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)',
      [req.params.key, value],
    );

    res.json({ key: req.params.key, value });
  } catch (err) {
    console.error('PUT /api/storage error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/storage/:key', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.query('DELETE FROM app_storage WHERE `key` = ?', [req.params.key]);
    res.json({ key: req.params.key, deleted: true });
  } catch (err) {
    console.error('DELETE /api/storage error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server after ensuring schema exists
async function start() {
  try {
    await initSchema();
    app.listen(PORT, () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();


