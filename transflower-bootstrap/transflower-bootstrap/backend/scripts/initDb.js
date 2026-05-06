const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env'), quiet: true });
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true, override: false });

const { connectDB, initializeDatabase, pool } = require('../src/config/db');

async function initDb() {
  try {
    await connectDB();
    await initializeDatabase();
    console.log('MySQL database initialized');
  } catch (error) {
    console.error('MySQL database initialization failed:', error.message);
    console.error('Check your .env MySQL settings and confirm MySQL Server is running.');
    process.exitCode = 1;
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

initDb();
