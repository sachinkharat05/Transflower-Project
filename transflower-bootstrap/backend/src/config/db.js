const mysql = require('mysql2/promise');

let pool;

async function connectDB() {
  try {
    if (dbSkipped) {
      console.log('MySQL skipped (DB_SKIP=true) ⚠️');
      return;
    }

    const host = process.env.DB_HOST || '127.0.0.1';
    const port = Number(process.env.DB_PORT || 3306);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || 'password';
    const database = process.env.DB_NAME || 'transflowerwebsite';

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // keep module.exports.pool in sync for consumers that access it dynamically
    module.exports.pool = pool;

    // validate credentials immediately (createPool doesn't connect until first query)
    await pool.query('SELECT 1');
    console.log('MySQL connected ✅');
  } catch (error) {
    console.log("DB ERROR:", error);
    throw error;
  }
}

async function initializeDatabase() {
  // Schema creation is handled elsewhere (scripts / SQL). Keep this as a hook.
  if (dbSkipped) return;
  console.log("DB initialized");
}

const dbSkipped = String(process.env.DB_SKIP || '').toLowerCase() === 'true';

function requirePool() {
  if (dbSkipped) {
    const err = new Error('Database is disabled (DB_SKIP=true).');
    err.code = 'DB_SKIPPED';
    throw err;
  }
  if (!pool) {
    const err = new Error('Database is not connected yet (pool is not initialized).');
    err.code = 'DB_NOT_CONNECTED';
    throw err;
  }
  return pool;
}

module.exports = {
  pool,
  connectDB,
  initializeDatabase,
  dbSkipped,
  requirePool
};