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
        `https://backend-instacoinpay-1.onrender.com/api/history/asset/${asset.name.toLowerCase()}`,
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
