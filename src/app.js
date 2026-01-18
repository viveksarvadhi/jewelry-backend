// const cors = require('cors');


const orderRoutes = require('./routes/orderRoutes');

const cartRoutes = require('./routes/cartRoutes');

require('dotenv').config(); // ✅ always first

const express = require('express');
const app = express();

const pool = require('./db');   
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

// middleware to read JSON
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
// app.use(cors());

// db test route
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// test route
app.get('/', (req, res) => {
  res.send('Jewelry Backend API Running');
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
