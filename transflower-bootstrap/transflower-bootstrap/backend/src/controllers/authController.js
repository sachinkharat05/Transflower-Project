const db = require('../config/db');

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    phone: row.phone,
    registeredAt: row.registered_at
  };
}

async function register(req, res) {
  try {
    const pool = db.requirePool();
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res
        .status(400)
        .json({ success: false, message: 'Name, email, password, and phone are required.' });
    }

    const [existingUsers] = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1', [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, password, phone]
    );
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    const newUser = mapUser(users[0]);

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    const code = error && (error.code || error.errno);
    console.error('Register error:', error?.message || error);

    if (code === 'ER_ACCESS_DENIED_ERROR') {
      return res.status(500).json({
        success: false,
        message:
          "MySQL access denied for the configured DB_USER/DB_PASSWORD. Update backend/.env or run 'npm run db:setup-user' (backend) with DB_ADMIN_USER/DB_ADMIN_PASSWORD."
      });
    }

    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

async function login(req, res) {
  const pool = db.requirePool();
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const [users] = await pool.query(
    'SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND password = ? LIMIT 1',
    [email, password]
  );

  if (users.length === 0) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  return res.json({
    success: true,
    message: 'Login successful.',
    user: sanitizeUser(mapUser(users[0]))
  });
}

module.exports = {
  register,
  login
};
