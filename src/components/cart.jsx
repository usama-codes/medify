import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './cart.css';
import { MdDelete } from 'react-icons/md';
import { jwtDecode } from 'jwt-decode';
import { supabase } from './config';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Initialize as empty array
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.userId;  // assuming the userId is stored in the token
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };
  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to view your cart.");
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/api/cart/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data || []);
      } catch (error) {
        console.error("Error fetching cart items:", error.response?.data || error.message);
        alert("Failed to fetch cart items.");
      }
    };

    fetchCartItems();

    const token = localStorage.getItem('token');
    if (!token) return;

    const subscription = supabase
      .channel('cart_changes') // Channel for cart changes
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cart' }, (payload) => {
        console.log('Cart item updated:', payload.new || payload.old);
        // Update cart items
        fetchCartItems();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Cleanup subscription on unmount
    };
  }, []);
  // Handle delete action for an item
  const handleDeleteItem = async (cartId) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Please log in to remove an item.");
      return;
    }
  
    if (window.confirm("Are you sure you want to remove this item from the cart?")) {
      try {
        // Send cartId and userId in the request body
        await axios.delete("http://localhost:4000/api/cart/deleteCart", {
          data: { cartId, userId }, // Include data in the body
        });
  
        setCartItems(cartItems.filter(item => item.cart_id !== cartId)); // Remove item from the cart list
        alert("Item removed from cart!");
      } catch (error) {
        console.error("Error removing item:", error.response?.data || error.message);
        alert("Failed to remove item from cart.");
      }
    }
  };
  
  // Handle quantity change (increase or decrease)
  const handleQuantityChange = async (cartId, quantity) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Please log in to update quantity.");
      return;
    }
  
    try {
      // Send cartId, userId, and quantity in the request body
      await axios.put("http://localhost:4000/api/cart/updateCart", { cartId, userId, quantity });
  
      setCartItems(cartItems.map(item =>
        item.cart_id === cartId ? { ...item, quantity } : item
      )); // Update the quantity in the state
    } catch (error) {
      console.error("Error updating quantity:", error.response?.data || error.message);
      alert("Failed to update quantity.");
    }
  };
  

  return (
    <div className="cart">
      <div className="container">
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div className="box" key={item.cart_id}>
              <div className="img-box">
                <img src={item.image_url} alt={item.name} />
              </div>
              <div className="detail">
                <div className="info">
                  <h3>{item.name}</h3>
                  <h4>Quantity: {item.quantity}</h4>
                  <h4>Price: Rs. {item.price}</h4>
                  <h3>Total: Rs. {item.quantity * item.price}</h3>
                </div>

                <div className="quantity">
                  <button 
                    className="btn" 
                    onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}>
                    +
                  </button>
                  <input 
                    type="number" 
                    value={item.quantity} 
                    onChange={(e) => handleQuantityChange(item.cart_id, parseInt(e.target.value) || 1)} 
                    min="1"
                  />
                  <button 
                    className="btn" 
                    onClick={() => handleQuantityChange(item.cart_id, Math.max(item.quantity - 1, 1))}>
                    -
                  </button>
                </div>

                <div className="icon">
                  <li onClick={() => handleDeleteItem(item.cart_id)}>
                    <MdDelete />
                  </li>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cart;
