import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import "./orderForm.css";
import { supabase } from './config';
const OrderForm = () => {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // New field for email
  const [totalprice, setTotalAmount] = useState(0);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  // Extract userId from the token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.userId; // Ensure your token contains userId
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  // Fetch total amount on component load
  useEffect(() => {
    const fetchInitialTotalAmount = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        alert('Please log in to view your cart total.');
        return;
      }

      try {
        const { data: cartItems, error } = await supabase
          .from('cart')
          .select('quantity, price')
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching initial total:', error.message);
          return;
        }

        const initialTotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
        setTotalAmount(initialTotal);
      } catch (error) {
        console.error('Error fetching initial total:', error.message);
        alert('Failed to fetch cart total.');
      }
    };

    fetchInitialTotalAmount();

    const userId = getUserIdFromToken();
    if (!userId) return;

    const subscription = supabase
      .channel(`public:cart:user_id=eq.${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cart' }, (payload) => {
        const updatedItem = payload.new || payload.old; // Handle new/old item as needed
        console.log('Cart item updated:', updatedItem);

        // Fetch the updated cart total after receiving real-time notification
        fetchInitialTotalAmount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Cleanup subscription on unmount
    };
  }, []);

  

  // Handle input changes
  const handleAddressChange = (e) => setAddress(e.target.value);
  const handlePhoneChange = (e) => setPhone(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  // Handle order confirmation
  const handleOrderConfirm = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Please log in to place an order.");
      return;
    }

    if (!address || !phone || !email) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/order/place-order",
        {
          shipmentDetails: { address, phone, email }, // Pass shipment details
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(response.data.message || "Order placed successfully!");
      setIsOrderConfirmed(true);

      // Optionally reset the form
      setAddress("");
      setPhone("");
      setEmail("");
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      alert("Failed to place the order.");
    }
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

        <div className="input-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="total-amount">
          <h3>Total Amount: Rs {totalprice}</h3>
        </div>

        <button className="confirm-order-btn" onClick={handleOrderConfirm}>
          Confirm Order
        </button>

        {isOrderConfirmed && (
          <div className="order-confirmation">
            Thank you! Your order has been confirmed.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
