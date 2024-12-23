import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests
import "./OTPInputScreen.css";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode

const OTPInputScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60); // 60 seconds timer
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]); // Ref to focus inputs
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      } else {
        setCanResend(true);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const handleInputChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const clearInputs = () => {
    setOtp(["", "", "", "", "", ""]);
    inputs.current[0].focus();
  };

  const getEmailFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found. Please log in again.");
    }
  
    const decodedToken = jwtDecode(token);
    console.log("Decoded Token:", decodedToken); // Debugging
  
    if (!decodedToken.email) {
      throw new Error("Email not found in token. Please log in again.");
    }
  
    return decodedToken.email;
  };

  const handleResend = async () => {
    try {
      clearInputs();
      setTimer(60);
      setCanResend(false);

      const email = getEmailFromToken(); // Extract email from the token

      // Resend OTP API call
      await axios.post("http://localhost:4000/api/otp/generateOtp", { email });

      alert("OTP resent successfully!");
    } catch (error) {
      console.error("Error resending OTP:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    }
  };
  const handleSubmit = async () => {
    const otpCode = otp.join("");
  
    if (otpCode.length < 6) {
      alert("Please enter the complete OTP!");
      return;
    }
  
    try {
      // Retrieve email from token stored in localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please login again.");
        return;
      }
  
      const decodedToken = jwtDecode(token);
      const email = decodedToken.email;
  
      // API call to verify OTP
      const response = await axios.post("http://localhost:4000/api/otp/verifyOtp", {
        otp: otpCode,
        email,
      });
  
      alert("OTP verified successfully!");
  
      // Update token with new token from response (if any)
      const newToken = response.data.token;
      if (newToken) {
        localStorage.setItem("token", newToken);
      }
  
      // Decode the token to extract user role
      const role = jwtDecode(newToken || token).role;
  
      // Role-based redirection
      if (role === "CUSTOMER") {
        window.location.href = "http://localhost:3000/home";
      } else if (role === "PHARMACY") {
        // Open Pharmacy App
       window.location.href = `http://localhost:3001/home?token=${localStorage.getItem("token")}`;
       /* window.location.href = "http://localhost:3001";*/
      } else {
        alert("Invalid role detected.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to verify OTP. Please try again.");
    }
  };
  
    
  return (
    <div className="otp-container">
      <div className="otp-header">
        <h2>Enter the OTP</h2>
        <p>We have sent you an OTP via email. Please enter it below.</p>
      </div>

      <div className="otp-input-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="otp-input"
            value={digit}
            onChange={(e) => handleInputChange(e.target.value, index)}
            ref={(ref) => (inputs.current[index] = ref)}
          />
        ))}
      </div>

      <div className="otp-actions">
        <button
          className="resend-btn"
          onClick={handleResend}
          disabled={!canResend}
        >
          {canResend ? "Resend OTP" : `Resend in ${timer}s`}
        </button>
        <button className="submit-btn" onClick={handleSubmit}>
          Submit OTP
        </button>
      </div>
    </div>
  );
};

export default OTPInputScreen;  