import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/DetailsPage.css'; 

const DetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Error fetching product details: ' + err.message);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (error) return <p className="error">Error: {error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details">
      <h1 className="product-name">{product.name}</h1>
      <p className="product-description">{product.description}</p>
      <p className="product-price">Price: {product.price}$</p>
      {product.category && <p className="product-category">Category: {product.category.name}</p>}
      
      <a href="/products" className="back-button" onClick={() => navigate('/')}>Back to Products</a>
    </div>
  );
};

export default DetailsPage;
