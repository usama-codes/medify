import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import './register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer'); // Default role

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

      const token = signupResponse.data.token;
      localStorage.setItem('token', token); // Save token to local storage

      // API call to generate OTP
      const otpResponse = await axios.post('http://localhost:4000/api/otp/generateOtp', {
        email,
        password,
      });

      alert('Signup successful! OTP sent to your email.');
      console.log('OTP Response:', otpResponse.data);

    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      alert('An error occurred. Please try again.');
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
                  <option value="Customer">CUSTOMER</option>
                  <option value="Pharmacist">PHARMACY</option>
                </select>
              </label>
            </div>
            <br />

            <button type="submit">Submit</button>
            <div className="register">
              <p>
                Already Have an Account? <a href="#">Login</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
