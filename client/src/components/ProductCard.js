import React from 'react';
import { Link } from 'react-router-dom'; 

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <h2 className="product-name">
        <Link to={`/product-details/${product._id}`}>
          {product.name}
        </Link>
      </h2>
      <p className="product-price">Price: {product.price}$</p>
      {product.category && <p className="product-category">Category: {product.category.name}</p>}
    </div>
  );
};

export default ProductCard;
