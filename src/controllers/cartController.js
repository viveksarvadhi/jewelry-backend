const pool = require('../db');

// ADD item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
      [userId, product_id, quantity]
    );

    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET cart items (with product details)
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT 
        cart.id,
        products.name,
        products.price,
        cart.quantity,
        (products.price * cart.quantity) AS subtotal
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = $1
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { addToCart, getCart };
