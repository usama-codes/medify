import React, { useState } from 'react';
import './orderForm.css';

const OrderForm = () => {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [totalAmount] = useState(500); // Static value, replace with dynamic calculation if needed
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleOrderConfirm = () => {
    setIsOrderConfirmed(true);
    alert('Order Confirmed!');
  };

  return (
    <div className="order-form-container">
      <div className="order-form-header">
        <h2>Enter Address and Contact Information</h2>
      </div>
      <div className="order-form">
        <div className="input-field">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter your address"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="input-field">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="total-amount">
          <h3>Total Amount: Rs {totalAmount}</h3>
        </div>

        <button className="confirm-order-btn" onClick={handleOrderConfirm}>
          Confirm Order
        </button>

        {isOrderConfirmed && <div className="order-confirmation">Thank you! Your order has been confirmed.</div>}
      </div>
    </div>
  );
};

export default OrderForm;
