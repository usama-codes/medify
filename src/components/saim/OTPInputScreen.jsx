import React, { useState, useEffect, useRef } from "react";
import "./OTPInputScreen.css";

const OTPInputScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60); // 60 seconds timer
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

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

  const handleResend = () => {
    clearInputs();
    setTimer(60);
    setCanResend(false);
    alert("OTP resent successfully!");
  };

  const handleSubmit = () => {
    const otpCode = otp.join("");

    if (otpCode.length < 6) {
      alert("Please enter the complete OTP!");
      return;
    }

    alert(`OTP Submitted: ${otpCode}`);
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
