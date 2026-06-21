const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env'), quiet: true });
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true, override: false });

const { connectDB, pool } = require('../src/config/db');

async function testDbConnection() {
  try {
    await connectDB();
    const [rows] = await pool.query('SELECT DATABASE() AS database_name, NOW() AS server_time');
    console.log(`Database connection OK: ${rows[0].database_name} at ${rows[0].server_time}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Check that MySQL is running and your .env DB_USER/DB_PASSWORD are correct.');
    process.exitCode = 1;
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

testDbConnection();
