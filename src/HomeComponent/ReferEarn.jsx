import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReferEarn.css";
import logo from "../assets/logo.png";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({ 
  phoneNumber = "15485825756", 
  message = "Hello! I need assistance with the referral program on InstaCoinXPay.",
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

const ReferEarn = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const referralUrl = "https://demo.com/signup?referralCode=F28E-6892";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="refer-wrapper">
        {/* BACK BUTTON */}
        <button className="refer-back-btn" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>

        {/* Background Elements */}
        <div className="bg-gradient"></div>
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        
        {/* Header */}
        <header className="refer-header">
          <img src={logo} alt="CoinXPay" className="logo" />
          <div className="header-badge">
            <span className="badge-text">Earn Rewards</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="refer-content">
          <div className="refer-card">
            {/* Left Section with Visual Appeal */}
            <div className="left-section">
              <div className="dollar-container">
                <div className="dollar-symbol">$</div>
                <div className="dollar-glow"></div>
              </div>
              <div className="reward-count">
                <div className="count-number">10</div>
                <div className="count-label">Friends Referred</div>
              </div>
            </div>

            {/* Right Section with Details */}
            <div className="right-section">
              <div className="badge">HOT OFFER</div>
              <h1 className="title">
                <span className="title-gradient">REFER AND EARN</span>
              </h1>
              <p className="subtitle">Invite friends to join CoinXPay and earn rewards together</p>

              {/* Reward Section */}
              <div className="reward-section">
                <div className="reward-card">
                  <div className="reward-icon">💰</div>
                  <div className="reward-details">
                    <div className="reward-label">PER USER</div>
                    <div className="reward-amount">
                      <span className="currency">$</span>
                      <span className="amount">10</span>
                      <span className="reward-bonus">+ $5 bonus after 5 referrals</span>
                    </div>
                  </div>
                </div>

                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-text">Share your referral link</div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-text">Friend signs up & verifies account</div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-text">Get $10 credited to your wallet</div>
                  </div>
                </div>
              </div>

              {/* Referral Code Section */}
              <div className="referral-section">
                <div className="section-header">
                  <h3>Your Personal Referral Link</h3>
                  <div className="share-buttons">
                    <button className="share-btn" title="Share via WhatsApp">📱</button>
                    <button className="share-btn" title="Share via Email">✉️</button>
                    <button className="share-btn" title="Share on Social Media">📢</button>
                  </div>
                </div>
                
                <div className="code-container">
                  <div className="code-input">
                    <input
                      type="text"
                      value={referralUrl}
                      readOnly
                      className="referral-input"
                    />
                    <button
                      className={`copy-btn-1 ${copied ? 'copied' : ''}`}
                      onClick={handleCopy}
                      aria-label="Copy referral link"
                    >
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                  <p className="code-hint">
                    Share this link with friends. When they sign up using your link, both of you get $10!
                  </p>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
      
      {/* WhatsApp Float Button - ADDED HERE */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message="Hello! I need assistance with the referral program on InstaCoinXPay."
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />
    </>
  );
};

export default ReferEarn;