import { useState, useContext } from 'react';
import { SidebarContext } from "./SideBarContext";
import { NotificationContext } from './NotificationsContext';
import SideBar from "./SideBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faPills, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const TabButton = ({ active, label, icon, onClick }) => (
  <button 
    className={`tab-button ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} />
    <span>{label}</span>
  </button>
);

const NotificationCard = ({ id, type, message, time, isRead }) => {
  const { markAsRead } = useContext(NotificationContext);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    console.log('Card clicked, isRead:', isRead);
    console.log('Notification ID:', id);
    if (!isRead) {
      markAsRead(id);
    }
  };

  return (
    <div 
    className={`notification-card ${isRead ? 'read' : 'unread'}`}
    onClick={handleClick}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}>

    {console.log('Rendering card:', id, 'isRead:', isRead)}
      <div className={`indicator ${type}`}>
        <FontAwesomeIcon 
          icon={
            type === 'orders' ? faBell :
            type === 'inventory' ? faPills :
            faExclamationCircle
          }
          className="notification-icon" 
        />
      </div>
      <div className="notification-content">
        <div className="message-header">
          <p className="message">{message}</p>
          <span className="time">{time}</span>
      </div>
    </div>
  </div>
  );
};

function NotificationsPharmacy() {
  const { isSideBarOpen } = useContext(SidebarContext);
  const { notifications } = useContext(NotificationContext);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'All', icon: faBell },
    { id: 'orders', label: 'Orders', icon: faBell },
    { id: 'inventory', label: 'Inventory', icon: faPills },
    { id: 'system', label: 'System', icon: faExclamationCircle }
  ];

  return (
    <div className={`notifications-wrapper ${isSideBarOpen ? 'sidebar-open' : ''}`}>
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
          {tabs.map(tab => (
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
          {notifications?.filter(notif => activeTab === 'all' || notif.type === activeTab)
            .filter(notif => 
              notif.message.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(notification => (
              <NotificationCard
                key={notification.id}
                type={notification.type}
                message={notification.message}
                time={notification.time}
                isRead={notification.isRead}
                id={notification.id}
              />
            ))}
          {(!notifications || notifications
            .filter(notif => activeTab === 'all' || notif.type === activeTab)
            .filter(notif => 
              notif.message.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0) && (
            <div className="no-notifications">
              <FontAwesomeIcon icon={faBell} />
              <p>No notifications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPharmacy;