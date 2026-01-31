import React, { useState } from "react";
import "./GetStarted.css";
import logo from "../assets/logo.png";
import cam2 from "../assets/Cam2.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  const [country, setCountry] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!country) {
      setPopup({
        show: true,
        message: "Please select your country",
        success: false,
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://backend-instacoinpay-1.onrender.com/api/auth/get-started",
        {
          country,
          referralCode: referralCode || undefined,
        }
      );

      setPopup({
        show: true,
        message: res.data.message || "Successfully completed",
        success: true,
      });

      setTimeout(() => {
        navigate("/createaccount", {
          state: { country, referralCode },
        });
      }, 1500);
    } catch (error) {
      setPopup({
        show: true,
        message:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Something went wrong",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="get-started-container">
      <div className="get-started-card">
<span className="getstarted-back" onClick={() => navigate(-1)}>←</span>
        {/* Logo */}
        <div className="get-started-logo-wrapper">
          <img src={logo} alt="InstaCoinXPay Logo" />
        </div>

        {/* Image */}
        <div className="get-started-cam2">
          <img src={cam2} alt="cam2" />
        </div>

        {/* Heading */}
        <h1 className="get-started-title">LET'S GET STARTED</h1>

        {/* Country */}
        <div className="get-started-form-group">
          <label className="get-started-label">Country of residence</label>
          <select
            className="get-started-input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={isLoading}
          >
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
            <option value="Singapore">Singapore</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
          </select>
        </div>

        {/* Referral */}
        <div className="get-started-form-group">
          <label className="get-started-label">
            Have a referral code? (optional)
          </label>
          <input
            type="text"
            className="get-started-input"
            placeholder="Enter referral code"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            disabled={isLoading}
          />
        </div>

        {/* Button */}
        <button
          className="get-started-continue-btn"
          onClick={handleSubmit}
          disabled={isLoading || !country}
        >
          {isLoading ? "Processing..." : "Continue"}
        </button>
      </div>

      {/* ANIMATED POPUP */}
      {popup.show && (
        <div className="get-started-popup-overlay">
          <div className="get-started-popup-card">
            <div className={`get-started-icon-box ${popup.success ? "success" : "error"}`}>
              <svg viewBox="0 0 100 100" className="get-started-icon">
                <circle cx="50" cy="50" r="45" className="get-started-circle" />
                <path
                  className="get-started-path"
                  d={
                    popup.success
                      ? "M30 52 L45 65 L70 38"
                      : "M35 35 L65 65 M65 35 L35 65"
                  }
                />
              </svg>
            </div>

            <p className="get-started-popup-text">{popup.message}</p>

            <button
              className="get-started-ok-btn"
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

export default GetStarted;