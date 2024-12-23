import "../App.css";
import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Card from "./Card";
import ProfilePic from "./ProfilePic";
import SideBar from "./SideBar";
import { SidebarContext } from "./SideBarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faMoneyBillWave, faVials, faBell, faPills } from "@fortawesome/free-solid-svg-icons";
import { faBell as faBellRegular } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

function HomePharmacy() {
  const [greeting, setGreeting] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const { isSideBarOpen } = useContext(SidebarContext);
  const [isHovered, setIsHovered] = useState(false);

  // State variables for API data
  const [pendingOrders, setPendingOrders] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [ordersCompletedToday, setOrdersCompletedToday] = useState(null);
  const [revenueGeneratedToday, setRevenueGeneratedToday] = useState(null);
  const [topSellingDrug, setTopSellingDrug] = useState(null);
  const [totalMedicinesInStock, setTotalMedicinesInStock] = useState(null);

  // Get token from URL
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    if (token) {
      // Save token to local storage
      localStorage.setItem("authToken", token);
      // Remove token from URL by reloading without query params
      window.history.replaceState({}, document.title, window.location.pathname);
      // Reload page
      window.location.reload();
    }
  }, [location]);

  useEffect(() => {
    const currentHour = new Date().getHours();
    let greetingMessage = "";
    let className = "";

    if (currentHour < 12) {
      greetingMessage = "Good Morning";
      className = "good-morning";
    } else if (currentHour < 18) {
      greetingMessage = "Good Afternoon";
      className = "good-afternoon";
    } else {
      greetingMessage = "Good Evening";
      className = "good-evening";
    }

    setGreeting(greetingMessage);
    setTimeOfDay(className);
  }, []);

  // Fetch data from APIs with token using Axios
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found in local storage");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const fetchPendingOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/pharmacy/pending-count", { headers });
        setPendingOrders(data.pendingOrderCount);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
      }
    };

    const fetchMonthlyRevenue = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/pharmacy/monthly-revenue", { headers });
        setMonthlyRevenue(data.total);
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
      }
    };

    const fetchOrdersCompletedToday = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/pharmacy/complete-orders", { headers });
        setOrdersCompletedToday(data.completedOrdersCount);
      } catch (error) {
        console.error("Error fetching orders completed today:", error);
      }
    };

    const fetchRevenueGeneratedToday = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/pharmacy/today-revenue", { headers });
        setRevenueGeneratedToday(data.todaysRevenue);
      } catch (error) {
        console.error("Error fetching today's revenue:", error);
      }
    };

    const fetchTopSellingDrug = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/pharmacy/top-selling-drug", { headers });
        setTopSellingDrug(data.name);
      } catch (error) {
        console.error("Error fetching top-selling drug:", error);
      }
    };

    const fetchTotalMedicinesInStock = async () => {
      try {
        const { data } = await axios.get("/api/totalMedicinesInStock", { headers });
        setTotalMedicinesInStock(data.count);
      } catch (error) {
        console.error("Error fetching total medicines in stock:", error);
      }
    };

    // Call all fetch functions
    fetchPendingOrders();
    fetchMonthlyRevenue();
    fetchOrdersCompletedToday();
    fetchRevenueGeneratedToday();
    fetchTopSellingDrug();
    fetchTotalMedicinesInStock();
  }, []);

  return (
    <div className={`main-container ${isSideBarOpen ? "sidebar-open" : ""}`}>
      <SideBar />
      <div className="content">
        <div className="profile-container">
          <div className="profile-section">
            <ProfilePic className="userProfile" />
          </div>
          <div className="notifications-section">
            <Link to="/notifications" className="notification-link">
              <FontAwesomeIcon
                icon={isHovered ? faBell : faBellRegular}
                size="2x"
                className="notifications"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            </Link>
          </div>
        </div>
        <div className="welcome-message-container">
          <div className={`welcome-message ${timeOfDay}`}>
            <h2>{greeting},</h2>
            <p>Welcome to the E-Pharmacy!</p>
          </div>
        </div>

        <div className="card-container">
          <Card
            title="Pending Orders"
            content={pendingOrders !== null ? pendingOrders : "Loading..."}
            icon={faBoxOpen}
            color="#014d4e"
            iconColor="#fff"
            textColor="#fff"
          />
          <Card
            title="Monthly Revenue"
            content={monthlyRevenue !== null ? `$${monthlyRevenue}` : "Loading..."}
            icon={faMoneyBillWave}
            color="#fff"
            iconColor="#014d4e"
            textColor="#014d4e"
          />
          <Card
            title="Orders Completed"
            content={ordersCompletedToday !== null ? ordersCompletedToday : "Loading..."}
            icon={faBoxOpen}
            color="#014d4e"
            iconColor="#fff"
            textColor="#fff"
          />
          <Card
            title="Today's Revenue"
            content={revenueGeneratedToday !== null ? `$${revenueGeneratedToday}` : "Loading..."}
            icon={faMoneyBillWave}
            color="#fff"
            iconColor="#014d4e"
            textColor="#014d4e"
          />
          <Card
            title="Top-Selling Drug"
            content={topSellingDrug !== null ? topSellingDrug : "Loading..."}
            icon={faVials}
            color="#014d4e"
            iconColor="#fff"
            textColor="#fff"
          />
          <Card
            title="Total Medicines"
            content={totalMedicinesInStock !== null ? totalMedicinesInStock : "Loading..."}
            icon={faPills}
            color="#fff"
            iconColor="#014d4e"
            textColor="#014d4e"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePharmacy;
