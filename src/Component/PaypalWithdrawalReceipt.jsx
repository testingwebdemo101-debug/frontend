import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaypalWithdrawalReceipt.css";
import logo from "../assets/logo.png";

// Coin icons
import btc from "../assets/btc.png";
import eth from "../assets/eth.png";
import bnb from "../assets/bnb.png";
import sol from "../assets/sol.png";
import xrp from "../assets/xrp.png";
import doge from "../assets/doge.png";
import ltc from "../assets/ltc.png";
import trx from "../assets/trx.png";
import usdt from "../assets/usdt.png";
import usdttether from "../assets/usdttether.png";

const coinIcons = {
  btc,
  eth,
  bnb,
  sol,
  xrp,
  doge,
  ltc,
  trx,
  usdtTron: usdttether,
  usdtBnb: usdt,
};

const getConfirmationStatusText = (confirmations = []) => {
  const count = confirmations.filter(Boolean).length;
  if (count === confirmations.length) return "Completed";
  return `Pending (${count}/${confirmations.length})`;
};

const PaypalWithdrawalReceipt = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const stored = sessionStorage.getItem("paypalReceipt");
  const initial = state || (stored && JSON.parse(stored)) || {};

  const [receipt, setReceipt] = useState(initial);
  const [loading, setLoading] = useState(true);

  /* =====================
     AUTO REFRESH
     ===================== */
  useEffect(() => {
    if (!receipt.transferId) return;

    const fetchTransfer = async () => {
      try {
        const res = await axios.get(
          `https://backend-srtt.onrender.com/api/transfer/${receipt.transferId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = res.data.data;

        setReceipt((prev) => ({
          ...prev,
          asset: data.asset,
          amount: data.amount,
          usdAmount: data.usdAmount,
          status: data.status,
          confirmations: data.confirmations || [
            false,
            false,
            false,
            false,
          ],
        }));

        setLoading(false);
      } catch (err) {
        console.error("Failed to refresh PayPal receipt", err);
        setLoading(false);
      }
    };

    fetchTransfer();
    const interval = setInterval(fetchTransfer, 5000);
    return () => clearInterval(interval);
  }, [receipt.transferId]);

  if (loading || !receipt.transferId) {
    return (
      <div className="paypal-receipt-page">
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          Loading PayPal receipt...
        </p>
      </div>
    );
  }

  const data = {
    asset: receipt.asset || "btc",
    amount: receipt.amount || 0,
    usdAmount: receipt.usdAmount || 0,
    paypalEmail: receipt.paypalEmail || "—",
    transactionId: receipt.transactionId || "TXN-DEMO-000000",
    status: receipt.status || "processing",
  };

  const confirmations = receipt.confirmations || [
    false,
    false,
    false,
    false,
  ];

  const isPending = data.status === "processing";

  const normalizedAsset = (() => {
    const asset = String(data.asset).replace(/[-_]/g, "").toLowerCase();
    const map = {
      btc: "btc",
      eth: "eth",
      bnb: "bnb",
      sol: "sol",
      xrp: "xrp",
      doge: "doge",
      ltc: "ltc",
      trx: "trx",
      usdttron: "usdtTron",
      usdttrc20: "usdtTron",
      usdtbnb: "usdtBnb",
      usdtbep20: "usdtBnb",
    };
    return map[asset] || asset;
  })();

  const assetDisplayName =
    normalizedAsset === "usdtTron" || normalizedAsset === "usdtBnb"
      ? "USDT"
      : normalizedAsset.toUpperCase();

  const icon = coinIcons[normalizedAsset];

  return (
    <div className="paypal-receipt-page">
      <div className="paypal-receipt-card">
        <span className="paypal-receipt-back" onClick={() => navigate(-1)}>
          ←
        </span>

        <div className="paypal-receipt-logo">
          <img src={logo} alt="InstaCoinXPay" />
        </div>

        <h2 className="paypal-receipt-title">Withdrawal Receipt</h2>

        <div className="paypal-receipt-status">
          Status:
          <span className={`status ${data.status}`}>
            {data.status === "processing" && "PENDING"}
            {data.status === "completed" && "APPROVED"}
            {data.status === "failed" && "REJECTED"}
          </span>
        </div>

        {/* ✅ SHOW CONFIRMATIONS ONLY WHEN PENDING */}
        {isPending && (
          <div className="paypal-receipt-row">
            <span>Confirmations</span>
            <div className="confirmation-visual">
              {confirmations.map((confirmed, i) => (
                <div
                  key={i}
                  className={`confirmation-dot ${
                    confirmed ? "confirmed" : "pending"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <small className="confirmation-text">
              {getConfirmationStatusText(confirmations)}
            </small>
          </div>
        )}

        <div className="paypal-receipt-row">
          <span>Transaction ID</span>
          <strong>{data.transactionId}</strong>
        </div>

        <div className="paypal-receipt-row">
          <span>PayPal Email</span>
          <strong>{data.paypalEmail}</strong>
        </div>

        <div className="paypal-receipt-row">
          <span>Asset</span>
          <div className="paypal-receipt-asset">
            {icon && <img src={icon} alt={assetDisplayName} />}
            <strong>{assetDisplayName}</strong>
          </div>
        </div>

        <div className="paypal-receipt-row">
          <span>Crypto Amount</span>
          <strong>{Number(data.amount).toFixed(8)}</strong>
        </div>

        <div className="paypal-receipt-row">
          <span>USD Value</span>
          <strong>${Number(data.usdAmount).toFixed(2)}</strong>
        </div>

        <div className="paypal-receipt-footer">
          <p>
            {data.status === "processing" &&
              "Your PayPal withdrawal is being processed."}
            {data.status === "completed" &&
              "Your withdrawal has been successfully approved."}
            {data.status === "failed" &&
              "Your withdrawal request has been rejected."}
          </p>

          <button
            className="paypal-receipt-btn"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaypalWithdrawalReceipt;
