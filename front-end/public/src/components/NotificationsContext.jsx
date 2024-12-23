import { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'orders',
      message: 'New order #1234 received from John Doe',
      time: '2 minutes ago',
      isRead: false
    },
    {
      id: 2,
      type: 'inventory',
      message: 'Low stock alert: Paracetamol (10 units remaining)',
      time: '1 hour ago',
      isRead: false
    },
    {
      id: 3,
      type: 'system',
      message: 'System maintenance scheduled for tonight at 2 AM',
      time: '3 hours ago',
      isRead: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};