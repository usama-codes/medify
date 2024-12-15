import "../App.css";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";
import ProfilePic from "./ProfilePic";
import SideBar from "./SideBar";
import { SidebarContext } from "./SideBarContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faMoneyBillWave, faVials, faBell, faPills } from "@fortawesome/free-solid-svg-icons";
import { faBell as faBellRegular } from "@fortawesome/free-regular-svg-icons"; // Import regular bell icon

function HomePharmacy() {
  const [greeting, setGreeting] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const { isSideBarOpen } = useContext(SidebarContext);
  const [isHovered, setIsHovered] = useState(false); // State to manage hover effect

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
          <ProfilePic className="username" />
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
            color="#1a84fe"
          >
          </Card>
          <Card
            title="Monthly Revenue"
            content={dummyData.monthlyRevenue}
            icon={faMoneyBillWave}
            color="#f9285b"
            progress={(dummyData.monthlyRevenue / 2000) * 100}
          />
          <Card
            title="Orders Completed"
            content={dummyData.ordersCompletedToday}
            icon={faBoxOpen}
            color="#16c652"
          />
          <Card
            title="Today's Revenue"
            content={dummyData.revenueGeneratedToday}
            icon={faMoneyBillWave}
            color="#fe3c3d"
          />
          <Card
            title="Top-Selling Drug"
            content={dummyData.topSellingDrug}
            icon={faVials}
            color="#7338ea"
          />
          <Card
            title="Total Medicines"
            content={dummyData.totalMedicinesInStock}
            icon={faPills}
            color="#feb117"
            textColor="#ffffff"
            iconColor="#ffffff"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePharmacy;