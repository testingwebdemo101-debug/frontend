import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NewPassword.css";
import resetImg from "../assets/reset.png";
import logo from "../assets/logo.png";
import axios from "axios";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({ 
  phoneNumber = "15485825756", 
  message = "Hello! I need assistance with setting a new password on InstaCoinXPay.",
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

const NewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 Animated popup state (same as GetStarted)
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  const email =
    location.state?.email || localStorage.getItem("resetEmail");
  const resetCode =
    location.state?.resetCode ||
    localStorage.getItem("verifiedResetCode");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword || formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!email || !resetCode) {
      setPopup({
        show: true,
        message: "Session expired. Please restart reset process.",
        success: false,
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          resetCode,
          newPassword: formData.newPassword,
        }
      );

      if (res.data.success) {
        setPopup({
          show: true,
          message: "Password reset successfully!",
          success: true,
        });

        localStorage.removeItem("resetEmail");
        localStorage.removeItem("verifiedResetCode");

        setTimeout(() => {
          navigate("/passwordresetsuccess");
        }, 1500);
      }
    } catch (err) {
      setPopup({
        show: true,
        message:
          err.response?.data?.error ||
          "Failed to reset password",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="new-password-container">
        <div className="new-password-card">
          <div className="new-password-logo">
            <img src={logo} alt="logo" />
          </div>

          <div className="new-password-image">
            <img src={resetImg} alt="reset" />
          </div>

          <h2 className="new-password-title">SET A NEW PASSWORD</h2>

          <p className="new-password-subtitle">
            Create a new password. Ensure it differs from previous ones.
          </p>

          <label className="new-password-input-label">Enter Password</label>
          <div className="new-password-input-box">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Enter Password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              👁️
            </span>
          </div>
          {errors.newPassword && (
            <div className="new-password-input-error">{errors.newPassword}</div>
          )}

          <label className="new-password-input-label">Re-enter Password</label>
          <div className="new-password-input-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              👁️
            </span>
          </div>
          {errors.confirmPassword && (
            <div className="new-password-input-error">
              {errors.confirmPassword}
            </div>
          )}

          <button
            className="new-password-update-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>

        {/* 🔥 SAME GETSTARTED ANIMATED POPUP */}
        {popup.show && (
          <div className="new-password-popup-overlay">
            <div className="new-password-popup-card">
              <div
                className={`new-password-icon-box ${
                  popup.success ? "new-password-success" : "new-password-error"
                }`}
              >
                <svg viewBox="0 0 100 100" className="new-password-icon">
                  <circle cx="50" cy="50" r="45" className="new-password-circle" />
                  <path
                    className="new-password-path"
                    d={
                      popup.success
                        ? "M30 52 L45 65 L70 38"
                        : "M35 35 L65 65 M65 35 L35 65"
                    }
                  />
                </svg>
              </div>

              <p className="new-password-popup-text">{popup.message}</p>

              <button
                className="new-password-ok-btn"
                onClick={() =>
                  setPopup({ ...popup, show: false })
                }
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Float Button - Added for New Password Assistance */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message="Hello! I need assistance with setting a new password on InstaCoinXPay."
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />
    </>
  );
};

export default NewPassword;