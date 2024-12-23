import React from "react";
import "./card.css"; // Updated CSS file

const Card = ({ name, imageUrl, quantity, price, category, onBuyNow }) => {
  return (
    <div className="card-container">
      <div className="card">
        {/* Card Image Section */}
        <div className="card-image">
          <img src={imageUrl} alt={name} className="card-img" />
        </div>

        {/* Card Information Section */}
        <div className="card-info">
          <div className="card-name">
            Product: <span>{name}</span>
          </div>
          <div className="card-quantity">
            Quantity: <span>{quantity}</span>
          </div>
          <div className="card-category">
            Category: <span>{category}</span>
          </div>
          <div className="card-price">
            Price: <span>Rs. {price}</span>
          </div>

          {/* Buy Now Button */}
          <div className="card-buttons">
            <button className="btn btn-buy-now" onClick={onBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
