const pool = require('../db');

// GET all products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// CREATE product (Admin only)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      type,
      material,
      karat,
      weight,
      stone_type,
      price,
      stock,
      description
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products 
      (name, type, material, karat, weight, stone_type, price, stock, description)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        name,
        type,
        material,
        karat,
        weight,
        stone_type,
        price,
        stock,
        description
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  getAllProducts,
  getProductById,
  createProduct
};
