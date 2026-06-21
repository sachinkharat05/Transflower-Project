const db = require('../config/db');
const { calculateTotal, getCartItems } = require('./cartController');

function mapOrder(row, items) {
  return {
    orderId: row.order_id,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    items,
    total: Number(row.total),
    address: row.address,
    phone: row.phone,
    paymentMethod: row.payment_method,
    status: row.status,
    orderDate: row.order_date
  };
}

async function listOrders(req, res) {
  const pool = db.requirePool();
  const { userId } = req.params;
  const [orderRows] = await pool.query(
    `SELECT o.*, u.name AS user_name, u.email AS user_email
     FROM orders o
     JOIN users u ON u.id = o.user_id
     WHERE o.user_id = ?
     ORDER BY o.order_date DESC`,
    [userId]
  );

  const orders = [];
  for (const orderRow of orderRows) {
    const [itemRows] = await pool.query(
      `SELECT product_id AS id, product_name AS name, price, category, image, quantity
       FROM order_items
       WHERE order_id = ?
       ORDER BY id`,
      [orderRow.order_id]
    );
    const items = itemRows.map((item) => ({ ...item, price: Number(item.price) }));
    orders.push(mapOrder(orderRow, items));
  }

  res.json({ success: true, orders });
}

async function createOrder(req, res) {
  const pool = db.requirePool();
  const { userId } = req.params;
  const { address, phone, paymentMethod } = req.body;

  if (!address || !phone || !paymentMethod) {
    return res.status(400).json({ success: false, message: 'Address, phone, and payment method are required.' });
  }

  const [users] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [userId]);

  if (users.length === 0) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const user = users[0];
  const cart = await getCartItems(userId);

  if (cart.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty.' });
  }

  const connection = await pool.getConnection();
  const order = {
    orderId: `ORD-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    items: cart,
    total: calculateTotal(cart),
    address,
    phone,
    paymentMethod,
    status: 'Pending',
    orderDate: new Date().toISOString()
  };

  try {
    await connection.beginTransaction();
    await connection.query(
      `INSERT INTO orders (order_id, user_id, total, address, phone, payment_method, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [order.orderId, user.id, order.total, address, phone, paymentMethod, order.status]
    );

    for (const item of cart) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, category, image, quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [order.orderId, item.id, item.name, item.price, item.category, item.image, item.quantity]
      );
    }

    await connection.query('DELETE FROM carts WHERE user_id = ?', [userId]);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return res.status(201).json({ success: true, message: 'Order placed successfully.', order });
}

module.exports = {
  listOrders,
  createOrder
};
