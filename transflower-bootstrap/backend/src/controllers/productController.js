const db = require('../config/db');

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category: row.category,
    image: row.image
  };
}

async function listProducts(req, res) {
  const pool = db.requirePool();
  const [rows] = await pool.query('SELECT * FROM products ORDER BY id');
  res.json({ success: true, products: rows.map(mapProduct) });
}

async function getProduct(req, res) {
  const pool = db.requirePool();
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [req.params.id]);

  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  return res.json({ success: true, product: mapProduct(rows[0]) });
}

module.exports = {
  listProducts,
  getProduct
};
