import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import SideBar from "./SideBar";
import Card from "./Card";
import { SidebarContext } from "./SideBarContext";

function HomePharmacy() {
  const [greeting, setGreeting] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const { isSideBarOpen } = useContext(SidebarContext);

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

  return (
    <div className={`main-container ${isSideBarOpen ? 'sidebar-open' : ''}`}>
      <SideBar />
      <div className="content">
        <div className="welcome-message-container">
          <div className={`welcome-message ${timeOfDay}`}>
            {greeting}, Welcome to the E-Pharmacy!
          </div>
        </div>

        <div className="card-container">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
}

export default HomePharmacy;