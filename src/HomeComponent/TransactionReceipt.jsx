  import React, { useEffect, useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import axios from "axios";
  import "./TransactionReceipt.css";

  export default function TransactionReceipt() {
    const navigate = useNavigate();
    const { id } = useParams(); // ✅ MongoDB _id

    const [tx, setTx] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState("");

    const NETWORK_FEE_RATE = 0.62; // 0.62%

    // Copy to clipboard
    const copyToClipboard = (text, type) => {
      if (!text) return;
      navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(""), 1500);
    };

    // Network mapping (UNCHANGED)
    const getNetwork = (coin) => {
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

    // 🔥 ONLY CHANGE: fetch from backend transfer
    useEffect(() => {
      const fetchTransaction = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return navigate("/login");

          const res = await axios.get(
            `https://backend-instacoinpay-1.onrender.com/api/transfer/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setTx(res.data.data);
        } catch (err) {
          console.error("Receipt fetch error:", err);
          setTx(null);
        } finally {
          setLoading(false);
        }
      };

      fetchTransaction();
    }, [id, navigate]);

    if (loading) return <div className="instacoinx-receipt-page"><p style={{ textAlign: "center" }}>Loading...</p></div>;
    if (!tx) return <div className="instacoinx-receipt-page"><p style={{ textAlign: "center" }}>Transaction not found</p></div>;

    // 🔐 SAME LOGIC AS BEFORE
    const sentAmount = Number(tx.amount);
    const coin = tx.asset.toUpperCase();
    const networkFee = +(sentAmount * NETWORK_FEE_RATE).toFixed(8);

    const formattedDate = new Date(
      tx.completedAt || tx.createdAt
    ).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const status = tx.status; // ✅ REQUIRED

    return (
      <>
        {/* 🔒 CSS LEFT EXACTLY SAME */}
        <div className="instacoinx-receipt-page">
          <div className="receipt-card">
            <div className="title">Withdrawal Details</div>

            <div className="amount">-{sentAmount} {coin}</div>

            <div className={`status-wrapper ${status}`}>

              {status === "pending" && (
                <div className="loader" />
              )}

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
                <button onClick={() => copyToClipboard(tx.toAddress, "address")}>📋</button>
              </span>
            </div>
            {copied === "address" && <div className="copied">Address copied</div>}

            <div className="row">
              <span className="label">TxID</span>
              <span className="value">
                {tx._id}
                <button onClick={() => copyToClipboard(tx._id, "txid")}>📋</button>
              </span>
            </div>
            {copied === "txid" && <div className="copied">TxID copied</div>}

            <div className="row">
              <span className="label">Withdrawal Amount</span>
              <span className="value">{sentAmount} {coin}</span>
            </div>

            <div className="row">
              <span className="label">Network Fee</span>
              <span className="value">{networkFee} {coin}</span>
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
      </>
    );
  }