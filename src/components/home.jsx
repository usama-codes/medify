import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./home.css";
import Card from "./card.jsx";
import Search from "./search.jsx";
import { MdLocalShipping } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import Dropdown1 from "./Dropdown1.jsx";
import Cart from "./cart.jsx";
import OrderForm from "./OrderForm.jsx";

const Home = () => {
  const [showCart, setShowCart] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const aboutRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/medicine/medicine"
        );
        setMedicines(response.data.medicines);
      } catch (error) {
        console.error("Error fetching medicines:", error);
        setMedicines([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const scrollToAboutUs = () => {
    aboutRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleCartClick = () => {
    setShowCart(true);
  };

  const handleHomeClick = () => {
    setShowCart(false);
  };

  // Function to handle Buy Now
  const handleBuyNow = async (medicineId) => {
    console.log("Buy Now clicked for medicineId:", medicineId); // Debugging line
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("No token found. User not authenticated.");
      alert("Please log in to continue.");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:4000/api/cart/add",
        {
          medicineId: medicineId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Item added to cart:", response.data);
      alert("Item successfully added to cart!");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessage = error.response.data.message;
  
        if (errorMessage.toLowerCase().includes("already exist")) {
          alert("Product already exists in the cart!");
        } else {
          alert(`Failed to add item to cart: ${errorMessage}`);
        }
      } else {
        console.error("Unexpected error:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
  
      // Check if the token exists
      if (!token) {
        alert("You are already logged out.");
        return;
      }
  
      // Call the logout API
      const response = await axios.post(
        "http://localhost:4000/api/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // On success, remove the token and redirect the user
      console.log("Logout successful:", response.data);
      localStorage.removeItem("token"); // Clear the token from localStorage
      alert(response.data.message); // Display the logout message
      window.location.href = "/login"; // Redirect to the login page
    } catch (error) {
      console.error("Logout failed:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };
  
  
  return (
    <div className="header">
      {/* Top Header */}
      <div className="top-header">
        <div className="icon">
          <MdLocalShipping />
        </div>
        <div className="info">
          <p>Free Shipping when shipping up to 1000 Rs</p>
        </div>
      </div>

      {/* Middle Header */}
      <div className="mid-header">
        <div className="logo">
          <img src="logo.jpeg" alt="logo" />
        </div>
        <div className="search-box">
        <Search onSearchResults={handleSearchResults} />
        </div>
        <div className="user">
  <div className="button" onClick={handleLogout}>
    <IoLogOutOutline />
  </div>
</div>

      </div>

      {/* Last Header */}
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
            <li>
              <Dropdown1 />
            </li>
          </ul>
        </div>
      </div>

      {/* Conditional Rendering: Cart or Product List */}
      {showCart ? (
        <div className="cart-container">
          <h3>#Cart</h3>
          <Cart />
          <OrderForm />
        </div>
      ) : (
        <>
          {/* Trending Products */}
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
                {isLoading ? (
                  <p>Loading...</p>
                ) : medicines.length > 0 ? (
                  medicines.map((medicine) => (
                    <Card
                      key={medicine.medicine_id}
                      name={medicine.name}
                      imageUrl={medicine.image_url}
                      quantity={medicine.stock}
                      price={medicine.price}
                      category={medicine.category || "General"}
                      onBuyNow={() => handleBuyNow(medicine.medicine_id)}  
                    />
                  ))
                ) : (
                  <p>No medicines available</p>
                )}
              </div>
            </div>
          </div>

          {/* Featured Selling */}
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
                {medicines.map((medicine) => (
                  <Card
                    key={medicine.medicine_id}
                    name={medicine.name}
                    imageUrl={medicine.image_url}
                    quantity={medicine.stock}
                    price={medicine.price}
                    category={medicine.category || "General"}
                    onBuyNow={() => handleBuyNow(medicine.medicine_id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* About Us and Contact Us */}
      <div className="about-contact">
        <div className="about-us" ref={aboutRef}>
          <h2>About Us</h2>
          <p>
            We are a team dedicated to providing the best service and experience.
            Our mission is to create innovative solutions for all our customers.
            Stay connected and learn more about what we offer.
          </p>
        </div>
        <div className="contact-us">
          <h2>Contact Us</h2>
          <p>If you have any questions, feel free to reach out to us:</p>
          <ul>
            <li>
              Email: <a href="mailto:info@example.com">info@example.com</a>
            </li>
            <li>Phone: +123 456 7890</li>
            <li>Address: 123 Street Name, City, Country</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
