const express = require('express');
const router = express.Router();
const { createProduct, deleteProduct, getProduct, updateProduct } = require('../controllers/productController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, createProduct);
router.delete('/:id', authenticate, deleteProduct);
router.get('/:id', getProduct);
router.put('/:id', authenticate, updateProduct);

module.exports = router;
