import { useState, useContext } from "react";
import { SidebarContext } from "./SideBarContext";
import { NotificationContext } from "./NotificationsContext";
import SideBar from "./SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell, faPills, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const TabButton = ({ active, label, icon, onClick }) => (
  <button className={`tab-button ${active ? "active" : ""}`} onClick={onClick}>
    <FontAwesomeIcon icon={icon} />
    <span>{label}</span>
  </button>
);

const NotificationCard = ({ id, order_id, message, time, isRead, onFetchOrderDetails }) => {
  const handleClick = () => {
    if (!isRead && onFetchOrderDetails) {
      onFetchOrderDetails(order_id); // Fetch order details on click
    }
  };

  return (
    <div
      className={`notification-card ${isRead ? "read" : "unread"}`}
      onClick={handleClick}
    >
      <div className="indicator">
        <FontAwesomeIcon icon={faBell} className="notification-icon" />
      </div>
      <div className="notification-content">
        <div className="message-header">
          <p className="message">{message}</p>
          <span className="time">{new Date(time).toLocaleString()}</span> {/* Format the time */}
        </div>
      </div>
    </div>
  );
};

const NotificationsPharmacy = () => {
  const { isSideBarOpen } = useContext(SidebarContext);
  const { notifications } = useContext(NotificationContext);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:4000/api/notification/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      const data = await response.json();
      console.log("Order details:", data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  // Dummy data for system and inventory notifications

  const dummyData = [
    {
      notification_: "inv-1",
      notification_msg: "Inventory running low for Paracetamol",
      created_at: new Date().toISOString(),
      type: "inventory",
      is_read: false,
    },
    {
      notification_: "inv-2",
      notification_msg: "New stock added for Aspirin",
      created_at: new Date().toISOString(),
      type: "inventory",
      is_read: true,
    },
    {
      notification_: "sys-1",
      notification_msg: "System maintenance scheduled for tomorrow",
      created_at: new Date().toISOString(),
      type: "system",
      is_read: false,
    },
    {
      notification_: "sys-2",
      notification_msg: "New feature update released!",
      created_at: new Date().toISOString(),
      type: "system",
      is_read: true,
    },
  ];

  const filteredNotifications = [...dummyData,...notifications].map((elm) => {
    if(elm.notification_msg.split(" ").includes("order")) return {...elm, type:"orders"};
    else return elm;
  }).filter((notification) => {
    if(activeTab === 'all') return true;
    else return activeTab === notification.type
  })

  console.log("Filtered Notifications:", filteredNotifications);

  return (
    <div className={`notifications-wrapper ${isSideBarOpen ? "sidebar-open" : ""}`}>
      <SideBar />
      <div className="notifications-container">
        <header className="notifications-header">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="tabs-container">
          {[
            { id: "all", label: "All", icon: faBell },
            { id: "orders", label: "Orders", icon: faBell },
            { id: "inventory", label: "Inventory", icon: faPills },
            { id: "system", label: "System", icon: faExclamationCircle },
          ].map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              label={tab.label}
              icon={tab.icon}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        <div className="notifications-list">
        {/* <pre>{JSON.stringify(notifications,null,2 )}</pre> */}

          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                id={notification.notification_id}
                order_id={notification.order_id || null}
                message={notification.notification_msg}
                time={notification.created_at}
                isRead={notification.is_read}
                onFetchOrderDetails={activeTab === "orders" ? fetchOrderDetails : null}
              />
            ))
          ) : (
            <div className="no-notifications">
              <FontAwesomeIcon icon={faBell} />
              <p>No notifications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPharmacy;
