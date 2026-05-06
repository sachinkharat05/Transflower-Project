const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const productRoutes = require('./src/routes/productRoutes');
const { connectDB, initializeDatabase, dbSkipped } = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Transflower API is running',
    timestamp: new Date().toISOString(),
    database: dbSkipped ? 'skipped' : 'connected'
  });
});

if (dbSkipped) {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') && req.path !== '/api/health') {
      return res.status(503).json({
        success: false,
        message:
          'Database is disabled (DB_SKIP). Remove DB_SKIP from the environment and configure MySQL in .env for full API support.'
      });
    }
    next();
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

app.use((error, req, res, next) => {
  console.error('API error:', error.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error.'
  });
});

async function startServer() {
  try {
    await connectDB();
    await initializeDatabase();
  } catch (error) {
    console.error('MySQL connection failed:', error.message);
    console.error('Check DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, and DB_NAME in your .env file.');
    console.error('Or set DB_SKIP=true to run the API without MySQL (non-health API routes will return 503).');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Transflower API listening on http://localhost:${PORT}`);
    console.log(`API health check: http://localhost:${PORT}/api/health`);
  });
}

startServer();
