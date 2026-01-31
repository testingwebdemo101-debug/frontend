import React, { useState } from "react";
import "./LoginPage.css";
import logo from "../assets/logo.png";
import coin from "../assets/Cam3.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
      "https://backend-instacoinpay-1.onrender.com/api/auth/login",
      { email, password }
    );

    if (res.data.token) {
      const user = res.data.data;   // ✅ backend user object

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", user.name);   // ✅ fullName
      localStorage.setItem("userId", user.id);       // ✅ optional
    }

    setPopup({
      show: true,
      message: res.data.message || "Login successful",
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
  );
};

export default LoginPage;