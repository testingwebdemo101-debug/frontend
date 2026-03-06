import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BitcoinWallet.css";
import btc from "../assets/btc.png";
import bnb from "../assets/bnb.png";
import usdt from "../assets/usdt.png";
import trx from "../assets/trx.png";
import usdttether from "../assets/usdttether.png";
import eth from "../assets/eth.png";
import sol from "../assets/sol.png";
import xrp from "../assets/xrp.png";
import doge from "../assets/doge.png";
import ltc from "../assets/ltc.png";
import { getCoinIcon } from "../utils/coinIcons";
import spinWheelIcon from "../assets/spinandwin.png"; // Add this import

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({
  phoneNumber = "15485825756",
  message = "Hello! I need assistance with my crypto wallet on InstaCoinXPay.",
  position = "right",
  bottom = "30px",
  right = "30px",
  left = "auto",
  size = "54px",
  iconSize = "28px",
  pulseEffect = true,
  className = "",
  style = {},
}) => {
  const formattedNumber = phoneNumber.replace(/[^\d]/g, "");
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

  const positionStyles =
    position === "left"
      ? { left: left || "20px", right: "auto" }
      : { right: right || "20px", left: "auto" };

  const combinedStyles = {
    position: "fixed",
    bottom: bottom,
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundColor: "#25d366",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    zIndex: 10000,
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
    ...positionStyles,
    ...style,
  };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`whatsapp-float ${pulseEffect ? "pulse" : ""} ${className}`}
      style={combinedStyles}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.677-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.826 9.826 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
      </svg>
    </a>
  );
};

/* ================= SPIN WHEEL NAVIGATION BUTTON (Navigates to SpinWheel) ================= */
const SpinWheelNavButton = ({ 
  position = "right",
  bottom = "100px", // Positioned above WhatsApp button
  right = "30px",
  left = "auto",
  size = "100px",
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
    if (!document.querySelector('#spin-wheel-nav-keyframes-bitcoinwallet')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'spin-wheel-nav-keyframes-bitcoinwallet';
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

/* ================= ICON MAP ================= */
const iconMap = {
  BTC: btc,
  USDT_BNB: usdt,
  USDT_Tether: usdttether,
  SOL: sol,
  DOGE: doge,
  BNB: bnb,
  TRX: trx,
  ETH: eth,
  XRP: xrp,
  LTC: ltc,
};

/* ================= FORMATTERS ================= */
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

const formatPercentage = (value = 0) => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${Number(value).toFixed(2)}%`;
};

/* ================= COMPONENT ================= */
const BitcoinWallet = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  /* ===== NORMALIZED ASSET ===== */
  const asset = {
    name: state?.name || "BTC",
    sub: state?.sub || "Bitcoin",
    icon: state?.icon || state?.iconPath || btc,
    originalAsset: state?.originalAsset || null,
  };

  /* ===== BALANCE STATES ===== */
  const [coinBalance, setCoinBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [change24h, setChange24h] = useState(0);

  /* ===== TRANSACTIONS ===== */
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= ICON ================= */
  const getIcon = () => {
    if (asset.icon) return asset.icon;
    const key =
      asset.name === "USDT" ? `${asset.name}_${asset.sub}` : asset.name;
    return iconMap[key] || btc;
  };

  /* ================= APPLY DASHBOARD DATA FIRST ================= */
  useEffect(() => {
    if (asset.originalAsset) {
      const {
        balance,
        balanceValue,
        currentPrice,
        priceChangePercentage24h,
      } = asset.originalAsset;

      setCoinBalance(balance || 0);
      setUsdBalance(balanceValue || 0);
      setPrice(currentPrice || 0);
      setChange24h(priceChangePercentage24h || 0);
    }
  }, []);

  /* ================= FIXED ASSET KEY ================= */
  // 🔥 THE MAIN FIX: handle all possible sub-label formats for USDT variants
  const getAssetKey = () => {
    const name = asset.name?.toLowerCase().trim();
    const sub = asset.sub?.toLowerCase().trim() || "";

    console.log("[getAssetKey] name:", asset.name, "| sub:", asset.sub); // debug

    if (name === "usdt") {
      // ✅ Match ANY of these sub formats for TRC20 / Tron:
      // "TRC-20", "TRC20", "Tron", "USDT_Tether", "tether", "trc", "usdtTron", "usdttron"
      if (
        sub.includes("trc") ||
        sub.includes("tron") ||
        sub.includes("tether") ||
        sub === "usdttron" ||
        sub === "usdt_tether"
      ) {
        return "usdtTron"; // ✅ exact DB value
      }

      // ✅ Match ANY of these sub formats for BEP20 / BNB:
      // "BEP-20", "BEP20", "BNB", "bnb", "bep", "usdtBnb", "usdt_bnb"
      if (
        sub.includes("bep") ||
        sub.includes("bnb") ||
        sub === "usdtbnb" ||
        sub === "usdt_bnb"
      ) {
        return "usdtBnb"; // ✅ exact DB value
      }

      // Fallback for USDT if sub doesn't match — default to TRC20
      console.warn("[getAssetKey] USDT sub not matched:", asset.sub, "— defaulting to usdtTron");
      return "usdtTron";
    }

    // All other coins: btc, eth, trx, bnb, sol, xrp, doge, ltc
    return name;
  };

  /* ================= FETCH TRANSACTIONS ================= */
  const fetchAssetTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) return;

      const assetKey = getAssetKey();

      console.log("[BitcoinWallet] Fetching history for assetKey:", assetKey);

      const response = await axios.get(
        `https://backend-srtt.onrender.com/api/history/asset/${assetKey}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 3 },
        }
      );

      if (response.data.success) {
        setRecentTransactions(response.data.data || []);
      }
    } catch (err) {
      console.error("[BitcoinWallet] History fetch error:", err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetTransactions();
  }, [asset.name, asset.sub]);

  /* ================= FORMAT TX ================= */
  const formatTransaction = (tx) => ({
    id: tx.id,
    type: tx.type || "Unknown",
    coin: tx.coin || asset.name,
    to: tx.to || "—",
    amount: tx.amount,
    sub: tx.sub || `${tx.amount} ${tx.coin || asset.name}`,
    status: tx.status || "Pending",
    date: tx.createdAt || tx.date || "",
  });

  const displayTransactions =
    recentTransactions.length > 0
      ? recentTransactions.map(formatTransaction)
      : [];

  /* ================= UI ================= */
  return (
    <>
      <div className="bw-wrapper">
        <div className="bw-card">

          {/* HEADER */}
          <div className="bw-header">
            <span className="bw-back" onClick={() => navigate(-1)}>←</span>
            <div className="bw-coin">
              <img src={getIcon()} alt={asset.name} />
              <h3>{asset.sub}</h3>
            </div>
          </div>

          {/* BALANCE */}
          <div className="bw-balance">
            <h1>
              {formatCurrency(usdBalance)} {asset.name}
            </h1>
            <p className="bw-price">
              {formatCurrency(price)} / {asset.name}
            </p>
            <p className={`bw-change ${change24h < 0 ? "red" : "green"}`}>
              {formatPercentage(change24h)} 24hr
            </p>
          </div>

          {/* CHART (STATIC) */}
          <div className="bw-chart">
            <svg viewBox="0 0 300 120">
              <polyline
                fill="none"
                stroke="#cfefff"
                strokeWidth="2"
                points="0,40 30,30 60,50 90,45 120,65 150,55 180,75 210,85 240,90 270,70 300,60"
              />
            </svg>
          </div>

          {/* ACTIONS */}
          <div className="bw-actions">
            <Action
              label="Send"
              icon="↗"
              onClick={() =>
                navigate("/send", {
                  state: {
                    name: asset.name,
                    sub: asset.sub,
                    icon: getIcon(),
                    originalAsset: asset.originalAsset,
                  },
                })
              }
            />
            <Action
              label="Receive"
              icon="↙"
              onClick={() =>
                navigate("/receive", {
                  state: {
                    name: asset.name,
                    sub: asset.sub,
                    icon: getIcon(),
                  },
                })
              }
            />
            <Action
              label="History"
              icon="⟳"
              onClick={() => navigate("/history")}
            />
          </div>

          {/* TRANSACTIONS */}
          <div className="bw-transactions">
            {loading ? (
              <p>Loading transactions...</p>
            ) : error ? (
              <p>⚠️ {error}</p>
            ) : displayTransactions.length === 0 ? (
              <p>No recent transactions</p>
            ) : (
              displayTransactions.map((tx, i) => (
                <Transaction key={i} {...tx} />
              ))
            )}
          </div>

        </div>
      </div>

      {/* WhatsApp Float Button */}
      <WhatsAppFloat
        phoneNumber="15485825756"
        message={`Hello! I need assistance with my ${asset.sub} (${asset.name}) wallet on InstaCoinXPay.`}
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />

      {/* Spin Wheel Navigation Button - On Right Side ABOVE WhatsApp */}
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

/* ================= SUB COMPONENTS ================= */
const Action = ({ icon, label, onClick }) => (
  <div className="bw-action" onClick={onClick}>
    <div className="bw-action-icon">{icon}</div>
    <p>{label}</p>
  </div>
);

const Transaction = (tx) => {
  const navigate = useNavigate();

  const typeClass =
    tx.type?.toLowerCase() === "send" || tx.type?.toLowerCase() === "sent"
      ? "sent"
      : tx.type?.toLowerCase() === "receive" || tx.type?.toLowerCase() === "received"
      ? "received"
      : "pending";

  return (
    <div
      className="bw-tx clickable"
      onClick={() =>
        navigate(`/transaction/${tx.id}`, {
          state: tx,
        })
      }
    >
      <div className="bw-tx-left">
        <div className="bw-tx-icon">
          <img
            src={getCoinIcon(tx.coin)}
            alt={tx.coin}
            className="bw-coin-img"
          />
        </div>

        <div>
          <strong className={`bw-tx-type ${typeClass}`}>{tx.type}</strong>
          <small className="btc-amount">{tx.sub}</small>
        </div>
      </div>

      <span className={`bw-tx-amount ${typeClass}`}>{tx.amount}</span>
    </div>
  );
};

export default BitcoinWallet;