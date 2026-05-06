const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });

const mysql = require('mysql2/promise');

const adminConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_ADMIN_USER || 'root',
  password: process.env.DB_ADMIN_PASSWORD || ''
};

const appDatabase = process.env.DB_NAME || 'transflower';
const appUser = process.env.DB_USER || 'transflower_user';
const appPassword = process.env.DB_PASSWORD || 'transflower123';

if (!/^[a-zA-Z0-9_]+$/.test(appDatabase)) {
  throw new Error('DB_NAME can only contain letters, numbers, and underscores.');
}

if (!/^[a-zA-Z0-9_]+$/.test(appUser)) {
  throw new Error('DB_USER can only contain letters, numbers, and underscores.');
}

function account(user, host) {
  return `'${user.replace(/'/g, "''")}'@'${host.replace(/'/g, "''")}'`;
}

async function setupMysqlUser() {
  let connection;

  try {
    console.log(`Connecting as MySQL admin ${adminConfig.user}@${adminConfig.host}:${adminConfig.port}`);
    connection = await mysql.createConnection(adminConfig);

    const localhostAccount = account(appUser, 'localhost');
    const loopbackAccount = account(appUser, '127.0.0.1');

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${appDatabase}\``);
    await connection.query(`DROP USER IF EXISTS ${localhostAccount}`);
    await connection.query(`DROP USER IF EXISTS ${loopbackAccount}`);
    await connection.query(`CREATE USER ${localhostAccount} IDENTIFIED BY ?`, [appPassword]);
    await connection.query(`CREATE USER ${loopbackAccount} IDENTIFIED BY ?`, [appPassword]);
    await connection.query(`GRANT ALL PRIVILEGES ON \`${appDatabase}\`.* TO ${localhostAccount}`);
    await connection.query(`GRANT ALL PRIVILEGES ON \`${appDatabase}\`.* TO ${loopbackAccount}`);
    await connection.query('FLUSH PRIVILEGES');

    console.log(`MySQL user ${appUser} created and granted access to ${appDatabase}`);
  } catch (error) {
    console.error('MySQL user setup failed:', error.message);
    console.error('Set DB_ADMIN_USER and DB_ADMIN_PASSWORD with a MySQL admin account, then run this command again.');
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupMysqlUser();
