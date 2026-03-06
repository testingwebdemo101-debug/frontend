import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Support.css";
import logo from "../assets/logo.png";
import spinWheelIcon from "../assets/spinandwin.png";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({ 
  phoneNumber = "15485825756", 
  message = "Hello! I need urgent support from InstaCoinXPay customer service.",
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

/* ================= SPIN WHEEL NAVIGATION BUTTON ================= */
const SpinWheelNavButton = ({ 
  position = "right",
  bottom = "100px",
  right = "30px",
  left = "auto",
  size = "60px",
  pulseEffect = true,
  className = "",
  style = {}
}) => {
  const navigate = useNavigate();
  
  const positionStyles = position === "left" 
    ? { left: left || "20px", right: "auto" }
    : { right: right || "20px", left: "auto" };

  const combinedStyles = {
    position: 'fixed',
    bottom: bottom,
    width: size,
    height: size,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #f7931a, #c8930a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4)',
    zIndex: 10000,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    border: '3px solid rgba(255, 215, 0, 0.6)',
    overflow: 'hidden',
    padding: '0px',
    ...positionStyles,
    ...style
  };

  // Add keyframes for pulse animation if not already defined
  React.useEffect(() => {
    if (!document.querySelector('#spin-wheel-nav-keyframes-support')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'spin-wheel-nav-keyframes-support';
      styleSheet.textContent = `
        @keyframes spinWheelNavPulse {
          0% {
            box-shadow: 0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4), 0 0 0 0 rgba(247, 147, 26, 0.7);
          }
          70% {
            box-shadow: 0 8px 35px rgba(247, 147, 26, 0.7), 0 0 30px rgba(200, 147, 10, 0.6), 0 0 0 15px rgba(247, 147, 26, 0);
          }
          100% {
            box-shadow: 0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4), 0 0 0 0 rgba(247, 147, 26, 0);
          }
        }
        
        @keyframes spinWheelNavGlow {
          0% {
            filter: drop-shadow(0 0 5px #f7931a);
          }
          50% {
            filter: drop-shadow(0 0 15px #c8930a);
          }
          100% {
            filter: drop-shadow(0 0 5px #f7931a);
          }
        }
        
        @keyframes spinWheelNavRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .spin-wheel-nav-float {
          animation: ${pulseEffect ? 'spinWheelNavPulse 2s infinite, spinWheelNavGlow 3s infinite' : 'none'};
        }
        
        .spin-wheel-nav-float:hover {
          transform: scale(1.15) rotate(10deg) !important;
          background: radial-gradient(circle at 30% 30%, #ffd700, #f7931a) !important;
          box-shadow: 0 10px 40px rgba(247, 147, 26, 0.8), 0 0 35px rgba(255, 215, 0, 0.7) !important;
        }
        
        .spin-wheel-nav-float:hover .wheel-icon-image {
          transform: scale(1.2) rotate(15deg) !important;
        }
        
        .wheel-icon-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, [pulseEffect]);

  const handleClick = () => {
    navigate('/spinwheel');
  };

  return (
    <button
      onClick={handleClick}
      className={`spin-wheel-nav-float ${className}`}
      style={combinedStyles}
      aria-label="Go to Fortune Wheel"
      title="Spin the Fortune Wheel!"
    >
      <img 
        src={spinWheelIcon} 
        alt="Fortune Wheel"
        className="wheel-icon-image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%',
          transition: 'transform 0.3s ease',
          transform: 'scale(1.1)'
        }}
      />
      
      <div style={{
        position: 'absolute',
        inset: '-6px',
        borderRadius: '50%',
        border: '3px solid rgba(255, 215, 0, 0.5)',
        borderTopColor: '#f7931a',
        borderRightColor: '#ffd700',
        borderBottomColor: '#f7931a',
        borderLeftColor: '#ffd700',
        opacity: 0.9,
        animation: 'spinWheelNavRotate 4s linear infinite',
        pointerEvents: 'none',
        boxShadow: '0 0 15px rgba(247, 147, 26, 0.6)'
      }} />
      
      <div style={{
        position: 'absolute',
        inset: '2px',
        borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />
    </button>
  );
};

const Support = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    description: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Set the email in form data
      setFormData(prev => ({
        ...prev,
        email: userData.email || ""
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // IMAGE PREVIEW ONLY
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clean up previous preview URL to avoid memory leaks
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("https://backend-srtt.onrender.com/api/support", formData);

      setMessage("✅ Support ticket submitted successfully");
      setFormData(prev => ({ 
        email: user?.email || "", // Keep the email
        subject: "", 
        description: "" 
      }));
      
      // Clean up preview
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setMessage(error.response?.data?.error || "❌ Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  // Show loading if user data is not yet available
  if (!user) {
    return (
      <div className="support-page-wrapper">
        <div style={{ 
          color: "#fff", 
          textAlign: "center", 
          padding: "50px",
          fontSize: "18px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "10px",
          marginTop: "50px"
        }}>
          Loading user data...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="support-page-wrapper">
        <header className="support-header-section">
          <div className="support-logo-container">
            <img src={logo} alt="InstaCoinXPay Support" />
          </div>
        </header>

        <div className="support-form-card">
          <span className="supportpage-back" onClick={() => navigate(-1)}>←</span> 
          <h1 className="support-title">SUPPORT</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="support-form-group">
              <label>Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
                placeholder="Your email address"
              />
              <small className="support-email-helper">
                Email is auto-filled from your profile
              </small>
            </div>

            <div className="support-form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Enter subject of your issue"
              />
            </div>

            <div className="support-form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Please describe your issue in detail..."
              />
            </div>

            {/* OPTIONAL IMAGE PREVIEW */}
            <div className="support-form-group">
              <label>Attachment (Optional)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="support-file-input"
              />
              {preview && (
                <div style={{ marginTop: '10px' }}>
                  <img 
                    src={preview} 
                    alt="preview" 
                    className="support-preview-image" 
                  />
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="support-submit-button" 
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>

            {message && <p className="support-message-text">{message}</p>}
          </form>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message="Hello! I need urgent support from InstaCoinXPay customer service."
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
        size="54px"
      />

      {/* Spin Wheel Navigation Button */}
      <SpinWheelNavButton 
        position="right"
        bottom="100px"
        right="30px"
        pulseEffect={true}
        size="60px"
      />
    </>
  );
};

export default Support;