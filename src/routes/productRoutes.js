const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct
} = require('../controllers/productController');


router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, checkRole('admin'), createProduct);

module.exports = router;
