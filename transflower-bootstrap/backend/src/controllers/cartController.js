const db = require('../config/db');

function mapCartItem(row) {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    category: row.category,
    image: row.image,
    quantity: row.quantity
  };
}

async function getCartItems(userId) {
  const pool = db.requirePool();
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.price, p.category, p.image, c.quantity
     FROM carts c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ?
     ORDER BY p.id`,
    [userId]
  );

  return rows.map(mapCartItem);
}

async function getCart(req, res) {
  const { userId } = req.params;
  const cart = await getCartItems(userId);
  res.json({ success: true, cart, total: calculateTotal(cart) });
}

async function addToCart(req, res) {
  const pool = db.requirePool();
  const { userId } = req.params;
  const { productId, quantity = 1 } = req.body;
  const [users] = await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]);

  if (users.length === 0) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const [products] = await pool.query('SELECT id FROM products WHERE id = ? LIMIT 1', [productId]);

  if (products.length === 0) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  await pool.query(
    `INSERT INTO carts (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [userId, productId, Number(quantity)]
  );

  const cart = await getCartItems(userId);
  return res.status(201).json({ success: true, message: 'Product added to cart.', cart, total: calculateTotal(cart) });
}

async function updateCartItem(req, res) {
  const pool = db.requirePool();
  const { userId, productId } = req.params;
  const { quantity } = req.body;
  const [items] = await pool.query('SELECT * FROM carts WHERE user_id = ? AND product_id = ? LIMIT 1', [userId, productId]);

  if (items.length === 0) {
    return res.status(404).json({ success: false, message: 'Cart item not found.' });
  }

  if (Number(quantity) <= 0) {
    await pool.query('DELETE FROM carts WHERE user_id = ? AND product_id = ?', [userId, productId]);
  } else {
    await pool.query('UPDATE carts SET quantity = ? WHERE user_id = ? AND product_id = ?', [Number(quantity), userId, productId]);
  }

  const cart = await getCartItems(userId);
  return res.json({ success: true, message: 'Cart updated.', cart, total: calculateTotal(cart) });
}

async function removeCartItem(req, res) {
  const pool = db.requirePool();
  const { userId, productId } = req.params;
  await pool.query('DELETE FROM carts WHERE user_id = ? AND product_id = ?', [userId, productId]);
  const cart = await getCartItems(userId);
  res.json({ success: true, message: 'Cart item removed.', cart, total: calculateTotal(cart) });
}

async function clearCart(req, res) {
  const pool = db.requirePool();
  const { userId } = req.params;
  await pool.query('DELETE FROM carts WHERE user_id = ?', [userId]);
  res.json({ success: true, message: 'Cart cleared.', cart: [] });
}

function calculateTotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  calculateTotal,
  getCartItems
};
