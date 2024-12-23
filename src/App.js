import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Register from './components/LoginRgister/register';
import LoginRegister from './components/LoginRgister/loginRegister';
import OTPInputScreen from './components/OTPInputScreen';
import Home from './components/home';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Route for registration */}
          <Route path="/register" element={<Register />} />

          {/* Route for login */}
          <Route path="/login" element={<LoginRegister />} />

          {/* Route for OTP screen */}
          <Route path="/otp" element={<OTPInputScreen />} />

          {/* Route for home screen */}
          <Route path="/home" element={<Home />} />
          


          {/* Default route redirects to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
