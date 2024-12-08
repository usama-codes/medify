import './App.css';
import HomePharmacy from './components/HomePharmacy';
import LandingPage from './components/LandingPage';
import OrderPharmacy from './components/OrderPharmacy';
import DashboardPharmacy from './components/DashboardPharmacy';
import MedicinesPharmacy from './components/MedicinesPharmacy';
import NotificationsPharmacy from './components/NotificationsPharmacy';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePharmacy />} />
        <Route path="/orders" element={<OrderPharmacy />} />
        <Route path="/dashboard" element={<DashboardPharmacy />} />
        <Route path="/medicines" element={<MedicinesPharmacy />} />
        <Route path="/notifications" element={<NotificationsPharmacy />} />
      </Routes>
    </Router>
  );
}

export default App;

