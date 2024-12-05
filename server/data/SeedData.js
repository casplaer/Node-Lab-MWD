const Category = require('../models/Category');
const Product = require('../models/Product'); 

const seedCategories = [
  { name: "Computers", description: "All kinds of computing devices" },
  { name: "Electronics", description: "Electronic devices and gadgets" },
  { name: "Accessories", description: "Accessories for computers and electronics" }
];

const seedProducts = [
  { name: "Laptop", description: "High-performance laptop", price: 1000, category: "Computers" },
  { name: "Smartphone", description: "Latest model smartphone", price: 700, category: "Electronics" },
  { name: "Tablet", description: "Portable tablet for work and play", price: 500, category: "Electronics" },
  { name: "Headphones", description: "Noise-cancelling headphones", price: 150, category: "Accessories" },
  { name: "Smartwatch", description: "Wearable smartwatch with fitness tracking", price: 200, category: "Accessories" },
  { name: "Camera", description: "Digital camera with high resolution", price: 600, category: "Electronics" },
  { name: "Printer", description: "Wireless inkjet printer", price: 120, category: "Computers" },
  { name: "Keyboard", description: "Mechanical keyboard for gaming", price: 80, category: "Accessories" },
  { name: "Mouse", description: "Ergonomic wireless mouse", price: 40, category: "Accessories" },
  { name: "Monitor", description: "24-inch full HD monitor", price: 300, category: "Computers" },
];

const seedData = async () => {
  try {
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      console.log('No categories found, seeding categories...');
      const categories = await Category.insertMany(seedCategories);  

      console.log('Categories added to the database:', categories);

      const categoryMap = categories.reduce((map, category) => {
        map[category.name] = category._id;  
        return map;
      }, {});

      const productsWithCategoryIds = seedProducts.map(product => ({
        ...product,
        category: categoryMap[product.category] 
      }));

      await Product.insertMany(productsWithCategoryIds);
      console.log('Products added to the database.');

    } else {
      console.log('Categories already exist in the database.');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

module.exports = seedData; 
