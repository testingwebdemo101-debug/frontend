import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DebitCards.css";
import logo from "../assets/logo.png";
import merchantCard from "../assets/cards/merchant.png";
import classicCard from "../assets/cards/classic.png";
import primeCard from "../assets/cards/prime.png";
import platinumCard from "../assets/cards/platinum.png";
import eliteCard from "../assets/cards/elite.png";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({ 
  phoneNumber = "15485825756", 
  message = "Hello! I need assistance with debit card activation on InstaCoinXPay.",
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

const debitCardsData = [
  {
    title: "Merchant Visa Card",
    price: "$100",
    limit: "Withdraw Limit $5000 / Day",
    theme: "debit-merchant",
    image: merchantCard,
  },
  {
    title: "Classic Visa Card",
    price: "$200",
    limit: "Withdraw Limit $20,000 / Day",
    theme: "debit-classic",
    image: classicCard,
  },
  {
    title: "Prime Visa Card",
    price: "$500",
    limit: "Withdraw Limit $50,000 / Day",
    theme: "debit-prime",
    image: primeCard,
  },
  {
    title: "Platinum Visa Card",
    price: "$1000",
    limit: "Withdraw Limit $100,000 / Day",
    theme: "debit-platinum",
    image: platinumCard,
  },
  {
    title: "World Elite Visa Card",
    price: "$2000",
    limit: "Withdraw Limit Unlimited",
    theme: "debit-elite",
    image: eliteCard,
  },
];

const DebitCards = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div className={`debit-main ${sidebarOpen ? 'blur-background' : ''}`}>
        <div className="debit-page">
          {/* Header */}
          <div className="debit-header">
            <img src={logo} alt="logo" className="debit-logo" />
            <div className="debit-menu" onClick={toggleSidebar}>☰</div>
          </div>

          <h1 className="debit-title">Activate Debit Card</h1>

          <div className="debit-cards-wrapper">
            {debitCardsData.map((card, index) => (
              <div className="debit-card-box" key={index}>
                <h2 className="debit-card-title">{card.title}</h2>

                {/* Card UI */}
                <div className={`debit-visa-card ${card.theme}`}>
                  <div
                    className="debit-card-image"
                    style={{ backgroundImage: `url(${card.image})` }}
                  ></div>
                </div>

                <div className="debit-price">{card.price}</div>
                <p className="debit-limit">{card.limit}</p>

                <ul className="debit-features">
                  <li>✔ Worldwide Accepted</li>
                  <li>🎁 Get Rewards on Purchase</li>
                  <li>👍 Instant Approval</li>
                </ul>

                {/* ✅ FIXED APPLY BUTTON */}
                <Link
                  to="/userform"
                  state={{ cardType: card.title }}
                  className="debit-apply-link"
                >
                  <button className="debit-apply-btn">Apply</button>
                </Link>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar and Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
      <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="logo" className="sidebar-logo" />

           <Link
                to="/userprofile"
                className="user-profile-btn"
                onClick={closeSidebar}
              >
                User Profile
              </Link>
          <button className="close-sidebar" onClick={closeSidebar}>×</button>
        </div>
        <div className="sidebar-menu">
          
          <div className="sidebar-item">
            <Link to="/dashboard" onClick={closeSidebar}>Dashboard</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/sendbtc" onClick={closeSidebar}>Withdrawal</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/creditcards" onClick={closeSidebar}>Activate Debit Card</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/trustwalletconnect" onClick={closeSidebar}>Connect Trust Wallet</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/support" onClick={closeSidebar}>Support</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/report" onClick={closeSidebar}>Report</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/referearn" onClick={closeSidebar}>Referral Link</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/" onClick={closeSidebar}>Logout</Link>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button - Added for Debit Cards Assistance */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message="Hello! I need assistance with debit card activation on InstaCoinXPay."
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />
    </>
  );
};

export default DebitCards;