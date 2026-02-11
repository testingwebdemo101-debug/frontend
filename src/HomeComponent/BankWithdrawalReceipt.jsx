import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BankWithdrawalReceipt.css";
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

const BankWithdrawalReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [receipt, setReceipt] = useState(location.state || {});

  /* =====================
     AUTO REFRESH RECEIPT
     ===================== */
  useEffect(() => {
    if (!receipt.transferId) return;

    const fetchLatestTransfer = async () => {
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

        // ✅ FULL HYDRATION (CORRECT)
        setReceipt({
          transferId: receipt.transferId,

          asset: data.asset,
          amount: data.amount,
          usdAmount: data.usdAmount,

          transferStatus: data.status,
          confirmations: data.confirmations || [false, false, false, false],

          fullName: data.fullName || "",
          bankName: data.bankName || "",
          accountNumber: data.accountNumber || "",
          swiftCode: data.swiftCode || "",
        });
      } catch (err) {
        console.error("Failed to refresh receipt", err);
      }
    };

    fetchLatestTransfer();
    const interval = setInterval(fetchLatestTransfer, 5000);
    return () => clearInterval(interval);
  }, [receipt.transferId]);

  if (!receipt.transferId) {
    return <p>No transaction data found</p>;
  }

  const transferStatus = receipt.transferStatus || "processing";
  const confirmations = receipt.confirmations || [false, false, false, false];
  const confirmedCount = confirmations.filter(Boolean).length;

  const isPending = transferStatus === "processing";
  const isCompleted = transferStatus === "completed";
  const isFailed = transferStatus === "failed";

  const normalizedAsset = (() => {
    const asset = String(receipt.asset || "")
      .replace(/[-_]/g, "")
      .toLowerCase();

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
    <div className="bank-withdrawal-receipt-container">
      <div className="bank-withdrawal-receipt-wrapper">
        <img src={logo} alt="logo" className="bank-withdrawal-receipt-header-logo" />

        <h2>Transaction Receipt</h2>

      <div className={`bank-withdrawal-receipt-item transaction-status ${
  isPending ? "pending" : isCompleted ? "completed" : "failed"
}`}>
  <span>Status</span>
 <strong>
  {isPending && "Pending"}
  {isCompleted && "Approved"}
  {isFailed && "Rejected"}
</strong>
</div>
{isPending && (
  <div className="bank-withdrawal-receipt-item">
    <span>Confirmations</span>
    <div className="confirmation-visual">
      {confirmations.map((confirmed, index) => (
        <div
          key={index}
          className={`confirmation-dot ${
            confirmed ? "confirmed" : "pending"
          }`}
        >
          {index + 1}
        </div>
      ))}
    </div>
    <small>
      {confirmedCount} / {confirmations.length} confirmations completed
    </small>
  </div>
)}
        <div className="bank-withdrawal-receipt-item">
          <span>Asset</span>
          <div className="bank-withdrawal-asset">
            {icon && <img src={icon} alt={assetDisplayName} />}
            <strong>{assetDisplayName}</strong>
          </div>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>Crypto Amount</span>
          <strong>{receipt.amount}</strong>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>USD Amount</span>
          <strong>${receipt.usdAmount}</strong>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>Full Name</span>
          <strong>{receipt.fullName}</strong>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>Bank Name</span>
          <strong>{receipt.bankName}</strong>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>Account Number</span>
          <strong>{receipt.accountNumber}</strong>
        </div>

        <div className="bank-withdrawal-receipt-item">
          <span>Swift Code</span>
          <strong>{receipt.swiftCode}</strong>
        </div>

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BankWithdrawalReceipt;
