import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./TransactionReceipt.css";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({
  phoneNumber = "15485825756",
  message = "Hello! I need assistance with my transaction receipt on InstaCoinXPay.",
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
  const formattedNumber = phoneNumber.replace(/[^\d]/g, "");
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

  const positionStyles =
    position === "left"
      ? { left: left || "20px", right: "auto" }
      : { right: right || "20px", left: "auto" };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`whatsapp-float ${pulseEffect ? "pulse" : ""} ${className}`}
      style={{
        position: "fixed",
        bottom,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#25d366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        zIndex: 10000,
        cursor: "pointer",
        textDecoration: "none",
        ...positionStyles,
        ...style
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967..." />
      </svg>
    </a>
  );
};

export default function TransactionReceipt() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  const NETWORK_FEE_RATE = 0.62;

  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 1500);
  };

  const getNetwork = (coin = "") => {
    const map = {
      btc: "BTC",
      eth: "ERC20",
      bnb: "BEP20",
      trx: "TRC20",
      usdttron: "TRC20",
      usdtbnb: "BEP20",
      sol: "SOL",
      xrp: "XRP",
      doge: "DOGE",
      ltc: "LTC",
    };
    return map[coin.toLowerCase()] || "Unknown";
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get(
          `https://backend-srtt.onrender.com/api/transfer/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const raw = res.data?.data;

        if (!raw) {
          setTx(null);
          return;
        }

        /* 🔧 NORMALIZE BACKEND RESPONSE → UI EXPECTATION */
    const transaction = {
  _id: raw.transactionId || raw.transferId,
  asset: raw.asset,
  amount: raw.amount,
  status: raw.status,
  toAddress: raw.toAddress || "—",
  networkFee: raw.networkFee || 0,
  createdAt: raw.createdAt,
  completedAt: raw.completedAt
};


        setTx(transaction);
      } catch (err) {
        console.error("Receipt fetch error:", err);
        setTx(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="instacoinx-receipt-page">
        <p style={{ textAlign: "center" }}>Loading...</p>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="instacoinx-receipt-page">
        <p style={{ textAlign: "center" }}>Transaction not found</p>
      </div>
    );
  }

  const sentAmount = Number(tx.amount || 0);
  const coin = tx.asset?.toUpperCase() || "";
  const networkFee =
  tx.networkFee > 0
    ? tx.networkFee
    : +(sentAmount * NETWORK_FEE_RATE).toFixed(8);


  const formattedDate = new Date(
    tx.completedAt || tx.createdAt
  ).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const status = tx.status;

  return (
    <>
      <div className="instacoinx-receipt-page">
        <div className="receipt-card">
          <div className="title">Withdrawal Details</div>

          <div className="amount">
            {sentAmount} {coin}
          </div>

          <div className={`status-wrapper ${status}`}>
            {status === "pending" && <div className="loader" />}
            {status === "completed" && (
              <div className="status-icon success">✔</div>
            )}
            {status === "failed" && (
              <div className="status-icon failed">✖</div>
            )}

            <div className="status-text">
              {status === "completed"
                ? "Successful"
                : status === "failed"
                ? "Failed"
                : "Pending"}
            </div>
          </div>

          <div className="divider" />

          <div className="row">
            <span className="label">Network</span>
            <span className="value">{getNetwork(tx.asset)}</span>
          </div>

          <div className="row">
            <span className="label">Address</span>
            <span className="value">
              {tx.toAddress}
              <button onClick={() => copyToClipboard(tx.toAddress, "address")}>
                📋
              </button>
            </span>
          </div>
          {copied === "address" && <div className="copied">Address copied</div>}

          <div className="row">
            <span className="label">TxID</span>
            <span className="value">
              {tx._id}
              <button onClick={() => copyToClipboard(tx._id, "txid")}>
                📋
              </button>
            </span>
          </div>
          {copied === "txid" && <div className="copied">TxID copied</div>}

          <div className="row">
            <span className="label">Withdrawal Amount</span>
            <span className="value">
              {sentAmount} {coin}
            </span>
          </div>

          <div className="row">
            <span className="label">Network Fee</span>
            <span className="value">
              {networkFee} {coin}
            </span>
          </div>

          <div className="row">
            <span className="label">Date</span>
            <span className="value">{formattedDate}</span>
          </div>

          <button
            className="dashboard-transaction-receipt-btn"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        </div>
      </div>

      <WhatsAppFloat
        phoneNumber="15485825756"
        message={`Hello! I need assistance with my ${coin} withdrawal receipt (ID: ${tx._id}) on InstaCoinXPay.`}
      />
    </>
  );
}
