import './App.css';
import OrderPharmacy from './components/OrderPharmacy';
import MedicinesPharmacy from './components/MedicinesPharmacy';
import NotificationsPharmacy from './components/NotificationsPharmacy';
import { NotificationProvider } from './components/NotificationsContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeWithDashboard from './components/HomeWithDashboard';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomeWithDashboard />} />
          <Route path="/orders" element={<OrderPharmacy />} />
          <Route path="/medicines" element={<MedicinesPharmacy />} />
          <Route path="/notifications" element={<NotificationsPharmacy />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;