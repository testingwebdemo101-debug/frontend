import React, { useState } from "react";
import "./ForgotPassword.css";
import logo from "../assets/logo.png";
import illustration from "../assets/forgot-illustration.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setPopup({ show: true, message: "Please enter your email", success: false });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setPopup({ show: true, message: "Please enter a valid email", success: false });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/auth/forgot-password",
        { email }
      );

      if (response.data.success) {
        setPopup({ show: true, message: "Reset code sent to your email!", success: true });

        // Store email for verification page
        localStorage.setItem("resetEmail", email);

        setTimeout(() => {
          navigate("/forgotverificationcode", { state: { email } });
        }, 1500);
      }
    } catch (err) {
      setPopup({
        show: true,
        message: err.response?.data?.error || "Failed to send reset code",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <span className="getstarted-back" onClick={() => navigate(-1)}>←</span>
        <div className="forgot-logo">
          <img src={logo} alt="CoinXpay Logo" />
        </div>

        <div className="forgot-image">
          <img src={illustration} alt="Forgot Password" />
        </div>

        <h2 className="forgot-title">Forgot Password</h2>
        <p className="forgot-subtitle">
          Please enter your Email to recover the password
        </p>

        <div className="input-group">
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <button 
          className="reset-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Reset Password"}
        </button>
      </div>

      {/* ================== ANIMATED POPUP ================== */}
      {popup.show && (
        <div className="ca-popup-overlay">
          <div className="ca-popup-card">
            <div className={`ca-icon-box ${popup.success ? "success" : "error"}`}>
              <svg viewBox="0 0 100 100" className="ca-icon">
                <circle cx="50" cy="50" r="45" className="ca-circle" />
                <path
                  className="ca-path"
                  d={
                    popup.success
                      ? "M30 52 L45 65 L70 38"
                      : "M35 35 L65 65 M65 35 L35 65"
                  }
                />
              </svg>
            </div>

            <p className="ca-popup-text">{popup.message}</p>

            <button
              className="ca-ok-btn"
              onClick={() => setPopup({ ...popup, show: false })}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
