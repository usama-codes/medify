import React from "react";
import { useContext } from 'react';
import HomePharmacy from "./HomePharmacy";
import DashboardPharmacy from "./DashboardPharmacy";
import SideBar from "./SideBar";
import { SidebarContext } from "./SideBarContext";

function HomeWithDashboard() {
  const { isSideBarOpen } = useContext(SidebarContext);

  return (
    <div className={`main-container ${isSideBarOpen ? "sidebar-open" : ""}`}>
      <SideBar />
      <div className="content">
        <div className="home-content">
          <HomePharmacy />
        </div>
        <div className="dashboard-content">
          <DashboardPharmacy />
        </div>
      </div>
    </div>
  );
}

export default HomeWithDashboard;
