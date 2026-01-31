import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./HistoryTransactionReceipt.css";

const HistoryTransactionReceipt = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [tx, setTx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

  const copy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 1200);
  };

  const getNetwork = (asset = "") =>
    ({
      btc: "BTC",
      eth: "ERC20",
      usdttron: "TRC20",
      trx: "TRON",
      sol: "SOL",
      xrp: "XRP",
      bnb: "BEP20",
      usdtbnb: "BEP20",
      doge: "DOGE",
      ltc: "LTC",
    }[asset.toLowerCase()] || "Unknown");

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get(
          `https://backend-instacoinpay-1.onrender.com/api/transfer/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data.data;
        data.status = (data.status || "pending").toLowerCase(); // 🔥 FIX

        setTx(data);
      } catch (e) {
        setTx(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTx();
  }, [id, navigate]);

  if (loading) return <div className="history-transaction-receipt-page"><p style={{ textAlign: "center" }}>Loading...</p></div>;
  if (!tx) return <div className="history-transaction-receipt-page"><p style={{ textAlign: "center" }}>Transaction not found</p></div>;

  const amount = Number(tx.amount ?? 0);
  const coin = tx.asset?.toUpperCase() || "";
  const fee = +(amount * 0.0062).toFixed(8);

  const formattedDate =
    tx.completedAt || tx.createdAt
      ? new Date(tx.completedAt || tx.createdAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "--";

  return (
    <div className="history-transaction-receipt-page">
      <div className="receipt-card">
        <h2 className="receipt-title">Transaction Receipt</h2>

        <div className="receipt-amount">
          -{amount} {coin}
        </div>

        <div className={`status-wrapper ${tx.status}`}>

          {tx.status === "pending" && (
            <div className="loader" />
          )}

          {tx.status === "completed" && (
            <div className="status-icon success">✔</div>
          )}

          {tx.status === "failed" && (
            <div className="status-icon failed">✖</div>
          )}

          <div className="status-text">
            {tx.status === "completed"
              ? "Successful"
              : tx.status === "failed"
              ? "Failed"
              : "Pending"}
          </div>

        </div>

        {/* ✅ FIXED MESSAGE */}
        <div className="receipt-info">
          Your crypto transfer from InstaCoinXPay has been processed successfully.
        </div>

        <div className="receipt-divider" />

        <div className="receipt-row">
          <span>Network</span>
          <strong>{getNetwork(tx.asset)}</strong>
        </div>

        <div className="receipt-row">
          <span>Recipient Address</span>
          <strong>
            {tx.toAddress}
            <button onClick={() => copy(tx.toAddress, "address")}>📋</button>
          </strong>
        </div>
        {copied === "address" && <div className="copied">Address copied</div>}

        <div className="receipt-row">
          <span>TxID</span>
          <strong>
            {tx.transactionId}
            <button onClick={() => copy(tx.transactionId, "txid")}>📋</button>
          </strong>
        </div>
        {copied === "txid" && <div className="copied">TxID copied</div>}

        <div className="receipt-row">
          <span>Amount</span>
          <strong>{amount} {coin}</strong>
        </div>

        <div className="receipt-row">
          <span>Network Fee</span>
          <strong>{fee} {coin}</strong>
        </div>

        <div className="receipt-row">
          <span>Date</span>
          <strong>{formattedDate}</strong>
        </div>

        <button className="receipt-back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default HistoryTransactionReceipt;