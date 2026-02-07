import React, { useState } from "react";
import "./CreateAccount.css";
import logo from "../assets/logo.png";
import coin from "../assets/Cam1.png";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({ 
  phoneNumber = "15485825756", 
  message = "Hello! I need assistance with creating my account on InstaCoinXPay.",
  position = "right",
  bottom = "30px",
  right = "30px",
  left = "auto",
  size = "54px",
  iconSize = "28px",
  pulseEffect = true,
  className = "",
  style = {}
}) => {
  const formattedNumber = phoneNumber.replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
  
  const positionStyles = position === "left" 
    ? { left: left || "20px", right: "auto" }
    : { right: right || "20px", left: "auto" };

  const combinedStyles = {
    position: 'fixed',
    bottom: bottom,
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: '#25d366',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    zIndex: 10000,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    ...positionStyles,
    ...style
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`whatsapp-float ${pulseEffect ? 'pulse' : ''} ${className}`}
      style={combinedStyles}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.677-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.826 9.826 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
      </svg>
    </a>
  );
};

const CreateAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get country and referral code from previous step
  const { country, referralCode: initialReferralCode } = location.state || {};

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      return "All fields are required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match";
    }

    return null;
  };

  const handleRegister = async () => {
    const validationError = validateForm();
    if (validationError) {
      setPopup({ show: true, message: validationError, success: false });
      return;
    }

    if (!country) {
      setPopup({
        show: true,
        message: "Please complete the 'Get Started' step first",
        success: false,
      });
      setTimeout(() => navigate("/get-started"), 2000);
      return;
    }

    setIsLoading(true);

    try {
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        country,
        referralCode: initialReferralCode || undefined,
      };

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        registrationData
      );

      if (res.data.success) {
        // store email for verification page
        localStorage.setItem("verificationEmail", formData.email);

        setPopup({
          show: true,
          message: "OTP sent to your email. Please verify.",
          success: true,
        });

        setTimeout(() => {
          navigate("/verificationcode", {
            state: { email: formData.email },
          });
        }, 1500);
      }
    } catch (error) {
      let errorMessage = "Registration failed";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      setPopup({ show: true, message: errorMessage, success: false });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="create-account-container">
        <div className="create-account-card">
          <span className="getstarted-back" onClick={() => navigate(-1)}>←</span>

          {/* Header Logo */}
          <div className="create-account-top-logo">
            <img src={logo} alt="InstaCoinXPay" />
          </div>

          {/* Coin Image */}
          {/* <div className="create-account-coin-wrapper">
            <img src={coin} alt="Crypto Coin" />
          </div> */}

          <h1 className="create-account-title">CREATE ACCOUNT</h1>

          {/* Show selected country */}
          {country && (
            <div className="create-account-country-display">
              <span>Country: <strong>{country}</strong></span>
              {initialReferralCode && (
                <span> | Referral Code: <strong>{initialReferralCode}</strong></span>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="create-account-form-box">
            <div className="create-account-form-group">
              <label className="create-account-label">Full Name</label>
              <input
                className="create-account-input"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="create-account-form-group">
              <label className="create-account-label">Email</label>
              <input
                className="create-account-input"
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="create-account-form-group">
              <label className="create-account-label">Enter Password</label>
              <input
                className="create-account-input"
                type="password"
                name="password"
                placeholder="Enter password (min. 6 characters)"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="create-account-form-group">
              <label className="create-account-label">Re-enter Password</label>
              <input
                className="create-account-input"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Continue Button */}
          <button 
            className="create-account-continue-btn" 
            onClick={handleRegister} 
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Continue"}
          </button>

          {/* Login Link */}
          <p className="create-account-login-link">
            Already have an account?{" "}
            <button className="create-account-link-btn" onClick={() => navigate("/login")}>
              Login here
            </button>
          </p>

        </div>

        {/* ANIMATED POPUP */}
        {popup.show && (
          <div className="create-account-popup-overlay">
            <div className="create-account-popup-card">
              <div className={`create-account-icon-box ${popup.success ? "success" : "error"}`}>
                <svg viewBox="0 0 100 100" className="create-account-icon">
                  <circle cx="50" cy="50" r="45" className="create-account-circle" />
                  <path
                    className="create-account-path"
                    d={popup.success ? "M30 52 L45 65 L70 38" : "M35 35 L65 65 M65 35 L35 65"}
                  />
                </svg>
              </div>
              <p className="create-account-popup-text">{popup.message}</p>
              <button
                className="create-account-ok-btn"
                onClick={() => setPopup({ ...popup, show: false })}
                disabled={isLoading}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Float Button - Added to Create Account Page */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message="Hello! I need assistance with creating my account on InstaCoinXPay."
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />
    </>
  );
};

export default CreateAccount;