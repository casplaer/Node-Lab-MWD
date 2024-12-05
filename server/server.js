const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');
const seedData = require('./data/SeedData');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ['http://localhost:3000', 'http://172.25.224.1:3000'],
  methods: 'GET,POST,UPDATE,DELETE',
  allowedHeaders: 'Content-Type',
};

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);

const uri = process.env.MONGO_URI;
console.log(uri);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

seedData();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    console.log(products);
    res.json(products); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
