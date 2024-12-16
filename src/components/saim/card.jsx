// Card.js
import React from 'react';
import './card.css'; // Import the updated CSS file

const Card = () => {
  return (
    <div className="card-container">
      <div className="card">
        <div className="card-image">
          <img
            src="https://5.imimg.com/data5/SELLER/Default/2024/4/410217491/ST/DQ/NW/125278182/fever-medicine-tablet-ptech-650.jpeg"
            alt="Product"
            className="card-img"
          />
          <div className="card-hover-overlay">
            <button className="btn">Buy Now</button>
          </div>
        </div>
        {/* Information below the image */}
        <div className="card-info">
          <div className="card-name">Product : <span>Fever Medicine</span></div>
          <div className="card-quantity">Quantity: <span>20 Tablets</span></div>
          <div className="card-category">Category: <span>Healthcare</span></div>
          <div className="card-price">Price: <span>$49.99</span></div>
        </div>
      </div>
    </div>
  );
};

export default Card;