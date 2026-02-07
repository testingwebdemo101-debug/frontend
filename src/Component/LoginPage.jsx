import React, { useState } from "react";
import "./LoginPage.css";
import logo from "../assets/logo.png";
import coin from "../assets/Cam3.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({ 
  phoneNumber = "15485825756", 
  message = "Hello! I need assistance with logging into my InstaCoinXPay account.",
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

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setPopup({
        show: true,
        message: "Please enter email and password",
        success: false,
      });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      if (res.data.token) {
        const user = res.data.data;

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userReferralCode", user.referralCode);
      }

      setPopup({
        show: true,
        message: "Login successful",
        success: true,
      });

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      setPopup({
        show: true,
        message:
          error.response?.data?.error || "Invalid email or password",
        success: false,
      });
    }
  };

  return (
    <>
      <div className="lp-container">
        <div className="lp-card">
          <span className="getstarted-back" onClick={() => navigate(-1)}>←</span>

          <div className="lp-top-logo">
            <img src={logo} alt="logo" />
          </div>

          <div className="lp-coin-wrapper">
            <img src={coin} alt="coin" />
          </div>

          <h2 className="lp-title">Login</h2>

          <div className="lp-form-box">
            <div className="lp-form-group">
              <label className="lp-label">Email</label>
              <input
                type="email"
                className="lp-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="lp-form-group">
              <label className="lp-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="lp-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "18px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <p className="lp-forgot-password">
              <button
                className="lp-link-btn-forgot"
                onClick={() => navigate("/forgotpassword")}
              >
                Forgot Password?
              </button>
            </p>

            <button className="lp-login-btn" onClick={handleLogin}>
              Login
            </button>
          </div>

          <p className="lp-login-link">
            Don't have an account?{" "}
            <button
              className="lp-link-btn"
              onClick={() => navigate("/getstarted")}
            >
              Sign up here
            </button>
          </p>
        </div>

        {/* ANIMATED POPUP */}
        {popup.show && (
          <div className="lp-popup-overlay">
            <div className="lp-popup-card">
              <div className={`lp-icon-box ${popup.success ? "success" : "error"}`}>
                <svg viewBox="0 0 100 100" className="lp-icon">
                  <circle cx="50" cy="50" r="45" className="lp-circle" />
                  <path
                    className="lp-path"
                    d={
                      popup.success
                        ? "M30 52 L45 65 L70 38" // Checkmark
                        : "M35 35 L65 65 M65 35 L35 65" // X mark
                    }
                  />
                </svg>
              </div>

              <p className="lp-popup-text">{popup.message}</p>
              <h2>{localStorage.getItem("userName")}</h2>

              <button
                className="lp-ok-btn"
                onClick={() => setPopup({ ...popup, show: false })}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Float Button - Added for Login Assistance */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message="Hello! I need assistance with logging into my InstaCoinXPay account."
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />
    </>
  );
};

export default LoginPage;