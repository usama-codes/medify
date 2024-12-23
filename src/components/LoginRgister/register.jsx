import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import './register.css';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CUSTOMER'); // Default role
  const navigate = useNavigate(); // For navigation

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // API call to signup
      const signupResponse = await axios.post('http://localhost:4000/api/user/signup', {
        username,
        email,
        password,
        role,
      });

      // Save token to local storage
      const token = signupResponse.data.token;
      localStorage.setItem('token', token);

      // API call to generate OTP
      const otpResponse = await axios.post('http://localhost:4000/api/otp/generateOtp', {
        email,
        password,
      });

      // Display success messages
      alert(`Signup successful! ${otpResponse.data.message || 'OTP sent to your email.'}`);

      // Navigate to OTP input screen
      navigate('/otp');
    } catch (error) {
      // Extract and display error message
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      alert(errorMessage);
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="wrapper">
        <div className="form-box login">
          <form onSubmit={handleRegister}>
            <h1>Signup</h1>

            <div className="input-box">
              <input
                type="text"
                placeholder="User Name"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <FaUser className="icon" />
            </div>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MdEmail className="icon" />
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className="icon" />
            </div>

            <div className="dropDown">
              <label>
                <p>Choose your role</p>
                <select
                  className="click"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="PHARMACY">PHARMACY</option>
                </select>
              </label>
            </div>
            <br />

            <button type="submit">Submit</button>
            <div className="register">
              <p>
                Already Have an Account? <Link to="/loginRegister">Log In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
