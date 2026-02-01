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

  /* ===== NORMALIZED ASSET (🔥 IMPORTANT) ===== */
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
      asset.name === "USDT"
        ? `${asset.name}_${asset.sub}`
        : asset.name;

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

  /* ================= FETCH TRANSACTIONS ================= */
  const fetchAssetTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `http://localhost:5000/api/history/asset/${asset.name.toLowerCase()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 3 },
        }
      );

      if (response.data.success) {
        setRecentTransactions(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetTransactions();
  }, [asset.name]);

  /* ================= FORMAT TX ================= */
 const formatTransaction = (tx) => ({
  id: tx.id,                 // 🔑 critical
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
            <Action label="History" icon="⟳" onClick={() => navigate("/history")} />
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
      
      {/* WhatsApp Float Button - ADDED HERE */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message={`Hello! I need assistance with my ${asset.sub} (${asset.name}) wallet on InstaCoinXPay.`}
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
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

  return (
    <div
      className="bw-tx clickable"
      onClick={() =>
        navigate(`/transaction/${tx.id}`, {
          state: tx, // ✅ SAME as AllTransactions
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
          <strong
  className={`bw-tx-type ${
    tx.type?.toLowerCase() === "send" || tx.type?.toLowerCase() === "sent"
      ? "sent"
      : tx.type?.toLowerCase() === "receive" || tx.type?.toLowerCase() === "received"
      ? "received"
      : "pending"
  }`}
>
  {tx.type}
</strong>

          <small className="btc-amount">{tx.sub}</small>
        </div>
      </div>

      <span
  className={`bw-tx-amount ${
    tx.type?.toLowerCase() === "send" || tx.type?.toLowerCase() === "sent"
      ? "sent"
      : tx.type?.toLowerCase() === "receive" || tx.type?.toLowerCase() === "received"
      ? "received"
      : "pending"
  }`}
>

        {tx.amount}
      </span>
    </div>
  );
};

export default BitcoinWallet;