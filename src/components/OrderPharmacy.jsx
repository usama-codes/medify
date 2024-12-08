import React, { useContext } from "react";
import "../App.css";
import SideBar from "./SideBar";
import Card from "./Card";
import { SidebarContext } from "./SideBarContext";

function OrderPharmacy() {
  const { isSideBarOpen } = useContext(SidebarContext);

  return (
    <div className={`main-container ${isSideBarOpen ? 'sidebar-open' : ''}`}>
      <SideBar />
      <div className="content">
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

export default OrderPharmacy;