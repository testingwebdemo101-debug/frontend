import React, { useState } from "react";
import axios from "axios";
import "./AdAllBulk.css";

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

/* =========================
   NETWORK LIST
========================= */
const networks = [
  { key: "BTC", name: "Bitcoin", icon: btc },
  { key: "ETH", name: "Ethereum", icon: eth },
  { key: "BNB", name: "BNB Smart Chain", icon: bnb },
  { key: "SOL", name: "Solana", icon: sol },
  { key: "XRP", name: "Ripple", icon: xrp },
  { key: "DOGE", name: "Dogecoin", icon: doge },
  { key: "LTC", name: "Litecoin", icon: ltc },
  { key: "TRX", name: "Tron", icon: trx },
  { key: "USDT", name: "USDT (TRC20)", icon: usdt },
  { key: "USDT", name: "USDT Tether", icon: usdttether },
];

/* =========================
   LOCALHOST API
========================= */
const API = "http://localhost:5000/api/bulk-transaction";

/* =========================
   COMPONENT
========================= */
export default function AdAllBulk() {
  const [selected, setSelected] = useState(networks[0]);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSend = async () => {
    console.log("🔥 BUTTON CLICKED");

    if (!amount || Number(amount) <= 0) {
      console.log("❌ Invalid amount");
      return setError("Please enter a valid amount");
    }

    console.log("📤 Sending request", {
      type: "CREDIT",
      coin: selected.key,
      amount: Number(amount),
    });

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(API, {
        type: "CREDIT",
        coin: selected.key,
        amount: Number(amount),
      });

      console.log("✅ API RESPONSE", res.data);

      setSuccess(
        `SUCCESS! ${selected.key} ${amount} credited successfully`
      );
    } catch (err) {
      console.error("❌ API ERROR", err);
      setError(err.response?.data?.error || "Bulk operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bulk-credit-wrapper">
      <div className="bulk-credit-card">
        <div className="bulk-credit-header">
          <h2 className="bulk-credit-title">All Bulk Credit</h2>
          <p className="bulk-credit-subtitle">Credit multiple users at once</p>
        </div>

        {/* Network Selector */}
        <div className="bulk-credit-form-group">
          <label className="bulk-credit-label">Select Network</label>
          <div 
            className="bulk-credit-dropdown" 
            onClick={() => setOpen(!open)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && setOpen(!open)}
          >
            <div className="bulk-credit-selected">
              <img 
                src={selected.icon} 
                alt={selected.key} 
                className="bulk-credit-selected-icon"
              />
              <div className="bulk-credit-selected-details">
                <span className="bulk-credit-selected-name">{selected.name}</span>
                <span className="bulk-credit-selected-key">{selected.key}</span>
              </div>
            </div>
            <span className={`bulk-credit-arrow ${open ? 'open' : ''}`}>▼</span>
          </div>
          
          {open && (
            <div className="bulk-credit-dropdown-menu">
              {networks.map((n) => (
                <div
                  key={n.key + n.name}
                  className={`bulk-credit-dropdown-item ${selected.key === n.key ? 'selected' : ''}`}
                  onClick={() => {
                    setSelected(n);
                    setOpen(false);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && setSelected(n)}
                >
                  <img 
                    src={n.icon} 
                    alt={n.key} 
                    className="bulk-credit-dropdown-icon"
                  />
                  <div className="bulk-credit-dropdown-details">
                    <span className="bulk-credit-dropdown-name">{n.name}</span>
                    <span className="bulk-credit-dropdown-key">{n.key}</span>
                  </div>
                  {selected.key === n.key && (
                    <span className="bulk-credit-check">✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="bulk-credit-form-group">
          <label className="bulk-credit-label">Amount to Credit</label>
          <div className="bulk-credit-input-wrapper">
            <input
              type="number"
              placeholder={`Enter ${selected.key} amount`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bulk-credit-input"
              inputMode="decimal"
              min="0"
              step="0.00000001"
            />
            <span className="bulk-credit-input-suffix">{selected.key}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="bulk-credit-summary">
          <div className="bulk-credit-summary-header">
            <h4>Transaction Summary</h4>
            <span className={`bulk-credit-status ${amount ? 'active' : 'inactive'}`}>
              {amount ? 'Ready' : 'Waiting'}
            </span>
          </div>
          <div className="bulk-credit-summary-details">
            <div className="bulk-credit-summary-row">
              <span className="bulk-credit-summary-label">Network</span>
              <span className="bulk-credit-summary-value">{selected.name}</span>
            </div>
            <div className="bulk-credit-summary-row">
              <span className="bulk-credit-summary-label">Amount</span>
              <span className="bulk-credit-summary-value">
                {amount || '0'} {selected.key}
              </span>
            </div>
            <div className="bulk-credit-summary-row">
              <span className="bulk-credit-summary-label">Type</span>
              <span className="bulk-credit-summary-value">Bulk Credit</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bulk-credit-error">
            {error}
          </div>
        )}
        {success && (
          <div className="bulk-credit-success">
            {success}
          </div>
        )}

        {/* Action Buttons */}
        <div className="bulk-credit-actions">
          <button
            className={`bulk-credit-button ${loading ? 'loading' : ''}`}
            onClick={handleSend}
            disabled={loading || !amount}
            type="button"
          >
            {loading ? (
              <>
                <span className="bulk-credit-spinner"></span>
                Processing...
              </>
            ) : (
              'Execute Bulk Credit'
            )}
          </button>
          
          <button
            className="bulk-credit-button-secondary"
            onClick={() => {
              setAmount("");
              setError("");
              setSuccess("");
            }}
            type="button"
            disabled={loading}
          >
            Clear All
          </button>
        </div>

        {/* Information Box */}
        <div className="bulk-credit-info">
          <span className="bulk-credit-info-icon">ℹ️</span>
          <div className="bulk-credit-info-content">
            <strong>Note:</strong> This action will credit <strong>{amount || '0'} {selected.key}</strong> to all eligible users in your system. Please double-check the amount before proceeding.
          </div>
        </div>
      </div>
    </div>
  );
}