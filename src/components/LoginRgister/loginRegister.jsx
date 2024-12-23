import React, { useState } from 'react';
import './loginRegister.css';
import { FaUser, FaLock } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    try {
      // Call backend API using axios
      const response = await axios.post('http://localhost:4000/api/user/login', {
        email,
        password,
      });

      // Save token in local storage
      const { token } = response.data;
      localStorage.setItem('token', token);

      // Generate OTP
      const otpResponse = await axios.post('http://localhost:4000/api/otp/generateOtp', {
        email,
        password,
      });

      // Display success message
      alert(`Login successful! ${otpResponse.data.message || 'OTP sent to your email.'}`);

      // Redirect to OTP screen
      navigate('/otp');
    } catch (err) {
      // Handle error response
      const errorMessage = err.response?.data?.error || 'Something went wrong. Please try again.';
      alert(errorMessage);
      console.error('Login failed:', err);
      setError(errorMessage);
    }
  };

  return (
    <div>
      <div className="wrapper">
        <div className="form-box login">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            {error && <p className="error">{error}</p>} {/* Display errors */}
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className="icon" />
            </div>
            <div className="remember">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit">Submit</button>
            <div className="register">
              <p>
                Don't have an Account? <Link to="/register">Register</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
