import "../App.css";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import Username from "./Username";
import SideBar from "./SideBar";
import { SidebarContext } from "./SideBarContext";
import { NotificationContext } from "./NotificationsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faMoneyBillWave, faVials, faBell, faPills } from "@fortawesome/free-solid-svg-icons";
import { faBell as faBellRegular } from "@fortawesome/free-regular-svg-icons"; 

function HomePharmacy() {
  const [greeting, setGreeting] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const { isSideBarOpen } = useContext(SidebarContext);
  const [isHovered, setIsHovered] = useState(false);
  const { unreadCount } = useContext(NotificationContext);

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

  // Dummy data for cards
  const dummyData = {
    pendingOrders: 578,
    lowStockDrugs: 2,
    urgentNotifications: 3,
    monthlyRevenue: 1200,
    ordersCompletedToday: 10,
    revenueGeneratedToday: 500,
    topSellingDrug: "Aspirin",
    totalMedicinesInStock: 150,
  };

  return (
    <div className={`main-container ${isSideBarOpen ? "sidebar-open" : ""}`}>
      <SideBar />
      <div className="content">
        <div className="profile-container">
          <div className="profile-section">
            <Username className="userProfile" />
          </div>
          <div className="notifications-section" style={{width: '50px', marginRight: '100px', position: 'relative'}}>
            <Link to="/notifications" className="notification-link">
              <FontAwesomeIcon
                icon={isHovered ? faBell : faBellRegular}
                size="2x"
                className="notifications"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
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
            content={dummyData.pendingOrders}
            icon={faBoxOpen}
            color="#014d4e"
            iconColor="#fff"
            textColor="#fff"
          />
          <Card
            title="Monthly Revenue"
            content={dummyData.monthlyRevenue}
            icon={faMoneyBillWave}
            color="#fff"
            iconColor="#014d4e"
            textColor="#014d4e"
          />
          <Card
            title="Orders Completed"
            content={dummyData.ordersCompletedToday}
            icon={faBoxOpen}
            color="#014d4e"
            iconColor="#fff"
            textColor="#fff"
          />
          <Card
            title="Today's Revenue"
            content={dummyData.revenueGeneratedToday}
            icon={faMoneyBillWave}
            color="#fff"
            iconColor="#014d4e"
            textColor="#014d4e"
          />
          <Card
            title="Top-Selling Drug"
            content={dummyData.topSellingDrug}
            icon={faVials}
            color="#014d4e"
            iconColor="#fff"
            textColor="#fff"
          />
          <Card
            title="Total Medicines"
            content={dummyData.totalMedicinesInStock}
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