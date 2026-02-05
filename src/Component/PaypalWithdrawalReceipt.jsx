import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  usdtTron: usdt,
  usdtBnb: usdttether,
};

const PaypalWithdrawalReceipt = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // ✅ FALLBACK TO SESSION STORAGE
  const stored = sessionStorage.getItem("paypalReceipt");
  const receipt = state || (stored && JSON.parse(stored)) || {};

  const data = {
    asset: receipt.asset || "btc",
    amount: receipt.amount || 0,
    usdAmount: receipt.usdAmount || 0,
    paypalEmail: receipt.paypalEmail || "—",
    transactionId: receipt.transactionId || "TXN-DEMO-000000",
    status: receipt.status || "processing",
  };

  const icon = coinIcons[data.asset];

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
            {data.status.toUpperCase()}
          </span>
        </div>

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
            {icon && <img src={icon} alt={data.asset} />}
            <strong>{data.asset.toUpperCase()}</strong>
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
            Your PayPal withdrawal is being processed. Funds will be credited
            after confirmation.
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
