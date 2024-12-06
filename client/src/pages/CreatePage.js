import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/CreatePage.css';

const CreatePage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('Product description');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (err) {
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log(category);
      const response = await axios.post(
        'http://localhost:5000/api/products',
        { name, description, price, category },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Product created:', response.data);
      navigate('/admin');
    } catch (err) {
      setError('Failed to create product');
    }
  };

  return (
    <div className="create-page">
      <h1>Create New Product</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Product description'
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">Create Product</button>
      </form>
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default CreatePage;
