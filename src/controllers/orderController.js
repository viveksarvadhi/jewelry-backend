const pool = require('../db');

// PLACE ORDER (using transaction)
const placeOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const userId = req.user.id;

    // start transaction
    await client.query('BEGIN');

    // STEP 1: get cart items
    const cartResult = await client.query(
      `
      SELECT 
        cart.product_id,
        cart.quantity,
        products.price,
        products.stock
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = $1
      `,
      [userId]
    );

    const cartItems = cartResult.rows;

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // STEP 2: calculate total amount
    let totalAmount = 0;
    for (const item of cartItems) {
      totalAmount += item.price * item.quantity;
    }

    // STEP 3: insert order
    const orderResult = await client.query(
      `
      INSERT INTO orders (user_id, total_amount, status)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [userId, totalAmount, 'completed']
    );

    const orderId = orderResult.rows[0].id;

    // STEP 4: update product stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        throw new Error('Insufficient stock');
      }

      await client.query(
        `
        UPDATE products
        SET stock = stock - $1
        WHERE id = $2
        `,
        [item.quantity, item.product_id]
      );
    }

    // STEP 5: clear cart
    await client.query(
      'DELETE FROM cart WHERE user_id = $1',
      [userId]
    );

    // commit transaction
    await client.query('COMMIT');

    res.json({
      message: 'Order placed successfully',
      orderId,
      totalAmount
    });

  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

module.exports = { placeOrder };
