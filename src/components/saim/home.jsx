import React, { useState, useRef } from 'react';
import "./home.css";
import Card from "./card.jsx";
import Search from "./search.jsx";
import { MdLocalShipping } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import Dropdown1 from './Dropdown1.jsx';
import Cart from './cart.jsx';
import OrderForm from './OrderForm.jsx'

const Home = () => {
  const [showCart, setShowCart] = useState(false);  // State to toggle between cart and products
  const aboutRef = useRef(null);

  const scrollToAboutUs = () => {
    aboutRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleCartClick = () => {
    setShowCart(true);  // Show cart when Cart is clicked
  };

  const handleHomeClick = () => {
    setShowCart(false);  // Show products when Home is clicked
  };

  return (
    <div className="header">
      <div className="top-header">
        <div className="icon">
          <MdLocalShipping />
        </div>
        <div className="info">
          <p>Free Shipping when shipping upto 1000 Rs</p>
        </div>
      </div>
      <div className="mid-header">
        <div className="logo">
          <img src="logo.jpeg" alt="logo" />
        </div>
        <div className="search-box">
          <Search />
        </div>
        <div className="user">
          <div className="button">
            <IoLogOutOutline />
          </div>
        </div>
      </div>
      <div className="last-header">
        <div className="user-profile">
          <div className="icon">
            <FaUser />
          </div>
          <h2>UserName</h2>
        </div>
        <div className="nav">
          <ul>
            <li onClick={handleHomeClick}>Home</li>
            <li onClick={handleCartClick}>Cart</li>
            <li onClick={scrollToAboutUs}>About Us</li>
            <li>Contact Us</li>
            <li> <Dropdown1 /></li>
          </ul>
        </div>
      </div>

      {/* Conditionally render the products or the cart */}
      {showCart ? (
        <div className="cart-container">
          <h3>#Cart</h3>
          <Cart />
          <Cart />
          <OrderForm/> {/* Display Cart when showCart is true */}
        </div>
      ) : (
        <>
          <div className="trending">
            <div className="container">
              <div className="header2">
                <div className="heading">
                  <h2>Trending Products</h2>
                </div>
               
              </div>
            </div>
            <div className="products">
              <div className="container">
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
              </div>
            </div>
          </div>

          {/* Featured Selling Section */}
          <div className="featured-selling">
            <div className="container">
              <div className="header2">
                <div className="heading">
                  <h2>Featured Selling</h2>
                </div>
              </div>
            </div>
            <div className="products">
              <div className="container">
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
              </div>
            </div>
          </div>
        </>
      )}

      {/* About and Contact Us Section */}
      <div className="about-contact">
        <div className="about-us" ref={aboutRef}>
          <h2>About Us</h2>
          <p>We are a team dedicated to providing the best service and experience. Our mission is to create innovative solutions for all our customers. Stay connected and learn more about what we offer.</p>
        </div>
        <div className="contact-us">
          <h2>Contact Us</h2>
          <p>If you have any questions, feel free to reach out to us:</p>
          <ul>
            <li>Email: <a href="mailto:info@example.com">info@example.com</a></li>
            <li>Phone: +123 456 7890</li>
            <li>Address: 123 Street Name, City, Country</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
