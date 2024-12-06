const Product = require('../models/Product');
const Category = require('../models/Category'); 
const { body, validationResult } = require('express-validator');

const createProduct = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('description').not().isEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('category').isMongoId().withMessage('Invalid category ID'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category } = req.body;

    try {
      const cat = await Category.findById(category);
      if (!cat) {
        return res.status(400).json({ message: 'Category not found' });
      }

      const newProduct = new Product({
        name,
        description,
        price,
        category: cat, 
      });

      await newProduct.save();
      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ message: 'Failed to create product' });
    }
  },
];

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product: ' + err.message });
  }
}

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const updateProduct = async (req, res) => {
  const { id } = req.params; 
  const { name, description, price, category } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, category },
      { new: true } 
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating product' });
  }
};


module.exports = { createProduct, deleteProduct, getProduct, updateProduct };
