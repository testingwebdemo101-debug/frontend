import React, { useState } from "react";
import "./UserForm.css";
import { useLocation, Link, useNavigate } from "react-router-dom";

import axios from "axios";

import {
  FaUser,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaGlobe,
  FaCheckCircle,
} from "react-icons/fa";
import logo from "../assets/logo.png";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({ 
  phoneNumber = "15485825756", 
  message = "Hello! I need assistance with applying for a debit card on InstaCoinXPay.",
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

const UserForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cardType = location.state?.cardType || "Unknown Card";

  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    address: "",
    zipcode: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    

    try {
      await axios.post("https://backend-instacoinpay-1.onrender.com/api/debit-card/apply", {
        cardType,
        ...formData,
      });

      setShowPopup(true);
    } catch (error) {
      alert("Application failed");
    }
  };

  return (
    <>
      <div className="user-form-wrapper">
        <div className="user-form-card">
          <span
    className="userform-back-arrow"
    onClick={() => navigate(-1)}
  >
    ←
  </span>

          
          <div className="user-form-logo">
            <img src={logo} alt="logo" />
          </div>

          <h2 className="user-form-title">
            Apply for {cardType}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="user-form-group">
              <label>Full Name</label>
              <div className="user-form-input-box">
                <input
                  type="text"
                  name="fullName"
                  required
                  onChange={handleChange}
                />
                <FaUser />
              </div>
            </div>

            <div className="user-form-group">
              <label>Email</label>
              <div className="user-form-input-box">
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                />
                <FaEnvelope />
              </div>
            </div>

            <div className="user-form-group">
              <label>WhatsApp</label>
              <div className="user-form-input-box">
                <input name="whatsapp" onChange={handleChange} />
                <FaWhatsapp />
              </div>
            </div>

            <div className="user-form-group">
              <label>Address</label>
              <div className="user-form-input-box">
                <input name="address" onChange={handleChange} />
                <FaMapMarkerAlt />
              </div>
            </div>

            <div className="user-form-group">
              <label>Zipcode</label>
              <div className="user-form-input-box">
                <input name="zipcode" onChange={handleChange} />
                <FaMapMarkerAlt />
              </div>
            </div>

            <div className="user-form-group">
              <label>Country</label>
              <div className="user-form-input-box">
                <input name="country" onChange={handleChange} />
                <FaGlobe />
              </div>
            </div>

          <button
    type="button"
    className="user-form-submit-btn"
    onClick={handleSubmit}
  >
    Apply Now
  </button>


          </form>
        </div>

       {showPopup && (
  <div className="user-form-popup-overlay">
    <div className="user-form-popup-card">

      {/* ✅ Animated Success Tick */}
      <div className="success-animation">
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            className="checkmark-circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            className="checkmark-check"
            fill="none"
            d="M14 27l7 7 16-16"
          />
        </svg>
      </div>

      <h3 className="popup-title">Application Submitted!</h3>

      <p className="popup-text">
        Your Plan Application Has Been Pending!
        <br />
        Kindly Make Pending Payment for Plan Below
      </p>

      <Link to="/select-deposit-currency" className="popup-pay-btn">
        Click Here to Pay
      </Link>

    </div>
  </div>
)}


      </div>
      
      {/* WhatsApp Float Button - ADDED HERE */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message={`Hello! I need assistance with applying for ${cardType} on InstaCoinXPay.`}
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />
    </>
  );
};

export default UserForm;