import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/AdminPage.css';
import deleteIcon from '../assets/delete.png';
import updateIcon from '../assets/pencil.png';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); 
  const [productToDelete, setProductToDelete] = useState(null); 
  const [filterName, setFilterName] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); 
    } else {
      const fetchData = async () => {
        try {
          const productResponse = await axios.get('http://localhost:5000/api/products');
          const categoryResponse = await axios.get('http://localhost:5000/api/categories');

          console.log(productResponse);

          setProducts(productResponse.data);
          setCategories(categoryResponse.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [navigate]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowPopup(true);
  };

  const handleUpdateClick = (product) => {
    navigate(`/update/${product._id}`);
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productToDelete._id}`);
      setProducts(products.filter(product => product._id !== productToDelete._id)); 
      setShowPopup(false); 
    } catch (err) {
      setError('Error deleting product: ' + err.message);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSortChange = (field) => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
  };

  const formatDateToLocal = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDateToUTC = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString(); 
  };

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

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="product-list">
      <h1 className="title">Administration</h1>

      <div className="filters">
        <div className="filter-group">
          <label>Filter by Name</label>
          <input 
            type="text" 
            value={filterName} 
            onChange={(e) => setFilterName(e.target.value)} 
            placeholder="Product name"
          />
        </div>

        <div className="filter-group">
          <label>Filter by Price</label>
          <input 
            type="number" 
            value={filterPrice} 
            onChange={(e) => setFilterPrice(e.target.value)} 
            placeholder="Max price"
            min={0}
          />
        </div>

        <div className="filter-group">
          <label>Filter by Category</label>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)} 
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <button onClick={() => handleSortChange('name')}>Sort by Name</button>
          <button onClick={() => handleSortChange('price')}>Sort by Price</button>
        </div>
      </div>

      <button onClick={() => navigate('/create')} className="create-button">
        Create
      </button>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product._id} className="product-card">
            <h2 className="product-name">{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">Price: {product.price} $</p>
            {product.category && <p className="product-category">Category: {product.category.name}</p>}
            
            <p className="product-date">
              <strong>Created at:</strong> {formatDateToLocal(product.createdAt)} (Local Time) 
              <br />
              <strong>UTC:</strong> {formatDateToUTC(product.createdAt)} (UTC)
            </p>

            {product.updatedAt && (
              <p className="product-date">
                <strong>Last updated at:</strong> {formatDateToLocal(product.updatedAt)} (Local Time) 
                <br />
                <strong>UTC:</strong> {formatDateToUTC(product.updatedAt)} (UTC)
              </p>
            )}

            <button 
              className="update-button" 
              onClick={() => handleUpdateClick(product)}
            >
              <img src={updateIcon} alt="Update" />
            </button>
            <button 
              className="delete-button" 
              onClick={() => handleDeleteClick(product)}
            >
              <img src={deleteIcon} alt="Delete" />
            </button>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Are you sure you want to delete {productToDelete.name}?</h3>
            <div className="popup-buttons">
              <button onClick={handleDeleteProduct} className="popup-button yes">Yes</button>
              <button onClick={handleClosePopup} className="popup-button no">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
