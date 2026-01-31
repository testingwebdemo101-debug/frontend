import React, { useState, useEffect } from "react";
import "./VerificationCode.css";
import coin from "../assets/Cam2.png";
import logo from "../assets/logo.png";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const VerificationCode = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get email from location state (passed from registration)
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      localStorage.setItem("verificationEmail", location.state.email);
    } else {
      const savedEmail = localStorage.getItem("verificationEmail");
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, [location]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    // Auto focus previous input on backspace
    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const otpArray = pastedData.split("").slice(0, 6);
      setOtp(otpArray);
      setTimeout(() => {
        document.getElementById(`otp-5`).focus();
      }, 0);
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setPopup({ show: true, message: "Please enter complete 6-digit code", success: false });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/auth/verify-email",
        { email, verificationCode: otpCode }
      );

      setPopup({ show: true, message: "Email verified successfully!", success: true });
      localStorage.removeItem("verificationEmail");

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setPopup({
        show: true,
        message: error.response?.data?.error || "Invalid or expired OTP",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/auth/resend-verification",
        { email }
      );

      setPopup({
        show: true,
        message: "New verification code sent to your email",
        success: true,
      });
    } catch (error) {
      setPopup({
        show: true,
        message: "Failed to resend verification code",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        {/* Logo */}
        <div className="verification-logo">
          <img src={logo} alt="logo" />
        </div>

        {/* Coin Image */}
        <div className="verification-coin-wrapper">
          <img src={coin} alt="bitcoin" />
        </div>

  <h2 className="verification-title">Verification Code</h2>
<p className="verification-text">
  We’ve sent a verification code <br />
  to your email address. <br />
  Please check your Spam or Junk folder if it doesn’t appear shortly.
</p>


        
        {/* Email display */}
        {email && (
          <p className="verification-email">
            <strong>Email:</strong> {email}
          </p>
        )}

        {/* OTP Inputs */}
        <div 
          className="verification-otp-boxes" 
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              autoFocus={index === 0}
              disabled={isLoading}
            />
          ))}
        </div>

        <button 
          className="verification-submit-btn" 
          onClick={handleSubmit}
          disabled={isLoading || otp.join("").length !== 6}
        >
          {isLoading ? "Verifying..." : "Submit"}
        </button>

        <p className="verification-resend-text">
          Didn't receive code?{" "}
          <button 
            className="verification-resend-btn" 
            onClick={handleResendCode}
            disabled={isLoading}
          >
            Resend Code
          </button>
        </p>
      </div>

      {/* ANIMATED POPUP */}
      {popup.show && (
        <div className="verification-popup-overlay">
          <div className="verification-popup-card">
            <div className={`verification-icon-box ${popup.success ? "success" : "error"}`}>
              <svg viewBox="0 0 100 100" className="verification-icon">
                <circle cx="50" cy="50" r="45" className="verification-circle" />
                <path
                  className="verification-path"
                  d={
                    popup.success
                      ? "M30 52 L45 65 L70 38" // checkmark
                      : "M35 35 L65 65 M65 35 L35 65" // X mark
                  }
                />
              </svg>
            </div>

            <p className="verification-popup-text">{popup.message}</p>

            <button
              className="verification-ok-btn"
              onClick={() => setPopup({ ...popup, show: false })}
              disabled={isLoading}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationCode;