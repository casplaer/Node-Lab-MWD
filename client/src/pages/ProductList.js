import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ProductList.css';
import ProductCard from '../components/ProductCard'; 
import Filters from '../components/Filters';          

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterPrice ? product.price <= filterPrice : true) &&
      (filterCategory ? product.category._id === filterCategory : true)
    )
    .sort((a, b) => {
      if (sortField === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      }
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get('http://localhost:5000/api/products');
        setProducts(productResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get('http://localhost:5000/api/categories');
        setCategories(categoryResponse.data);
      } catch (err) {
        setError('Error fetching categories: ' + err.message);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleSortChange = (field) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="product-list">
      <h1 className="title">Our Products</h1>

      <Filters 
        filterName={filterName}
        setFilterName={setFilterName}
        filterPrice={filterPrice}
        setFilterPrice={setFilterPrice}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        handleSortChange={handleSortChange}
        categories={categories}
      />

      <div className="product-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
