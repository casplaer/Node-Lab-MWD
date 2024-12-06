const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); 
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories', err);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};

module.exports = { getCategories };
