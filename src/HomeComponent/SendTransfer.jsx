import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";
import "./SendTransfer.css";
import btcIcon from "../assets/btc.png";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

const SendTransfer = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const asset = {
    name: state?.name || "BTC",
    sub: state?.sub || "Bitcoin",
    icon: state?.icon || btcIcon,
    originalAsset: state?.originalAsset || null,
  };

  const [formData, setFormData] = useState({
    toAddress: "",
    amount: "",
    notes: "",
  });

  const [coinBalance, setCoinBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [coinAmount, setCoinAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  useEffect(() => {
    if (!asset.originalAsset) {
      navigate("/dashboard");
      return;
    }

    const { balance, balanceValue, currentPrice } = asset.originalAsset;
    setCoinBalance(balance);
    setUsdBalance(balanceValue);
    setPrice(currentPrice);
  }, []);

  useEffect(() => {
    if (!formData.amount || !price) {
      setCoinAmount(0);
      return;
    }
    setCoinAmount(Number(formData.amount) / price);
  }, [formData.amount, price]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleMaxAmount = () => {
    setFormData((p) => ({
      ...p,
      amount: usdBalance.toFixed(2),
    }));
  };

  const handleTransfer = async () => {
    if (!formData.toAddress || !formData.amount) {
      setPopup({
        show: true,
        message: "Enter all details",
        success: false,
      });
      return;
    }

    if (coinAmount <= 0) {
      setPopup({
        show: true,
        message: "Enter a valid USD amount",
        success: false,
      });
      return;
    }

    if (coinAmount > coinBalance) {
      setPopup({
        show: true,
        message: "Insufficient balance",
        success: false,
      });
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/transfer", {
        asset: asset.name.toLowerCase(),
        toAddress: formData.toAddress,
        amount: Number(coinAmount.toFixed(8)),
        notes: formData.notes,
      });

      // Check if OTP verification is required
      if (res.data.data.requiresOTPVerification && res.data.data.otpSent) {
        // Redirect to Transfer OTP page with all necessary data
        navigate("/transferotp", {
          state: {
            transferData: {
              transferId: res.data.data._id,
              asset: asset.name.toLowerCase(),
              toAddress: formData.toAddress,
              amount: Number(coinAmount.toFixed(8)),
              notes: formData.notes,
              requiresOTPVerification: true,
              otpSent: true
            },
            userEmail: localStorage.getItem("userEmail") || "",
            coinAmount: coinAmount,
            usdAmount: formData.amount,
            assetName: asset.name,
            assetIcon: asset.icon,
            price: price
          }
        });
      } else {
        // If no OTP required, show success and go back to dashboard
        setPopup({
          show: true,
          message: res.data.message || "Transfer initiated successfully!",
          success: true,
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }

    } catch (err) {
      setPopup({
        show: true,
        message: err.response?.data?.error || "Transfer failed",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="st-wrapper">
      <div className="st-card">
        <div className="st-header">
          <span className="st-back-btn" onClick={() => navigate(-1)}>
            ←
          </span>
          <h2>Transfer {asset.name}</h2>
        </div>

        <div className="st-group">
          <label>Recipient</label>
          <input
            type="text"
            name="toAddress"
            value={formData.toAddress}
            onChange={handleInputChange}
            placeholder={`Recipient ${asset.sub} address`}
          />
        </div>

        <div className="st-group">
          <label>Coin</label>
          <div className="st-coin-box">
            <img src={asset.icon} alt={asset.name} className="st-coin-icon" />
            <div className="st-coin-left">
              <strong>{asset.name}</strong>
              <span>{asset.sub}</span>
            </div>
          </div>
          <div className="st-available">
            Balance: <b>{formatCurrency(usdBalance)} {asset.name}</b>
          </div>
        </div>

        <div className="st-group">
          <label>Amount</label>
          <div className="st-amount-box">
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
            <button type="button" onClick={handleMaxAmount}>
              MAX
            </button>
          </div>
          <small>
            ≈ {coinAmount.toFixed(8)} {asset.name}
          </small>
        </div>

        <button
          className="st-confirm-btn"
          onClick={handleTransfer}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Transfer"}
        </button>
      </div>

      {popup.show && (
        <div className="stx-popup-overlay">
          <div className={`stx-popup ${popup.success ? "stx-success" : "stx-error"}`}>
            <div className={`stx-icon-box ${popup.success ? "stx-success" : "stx-error"}`}>
              <svg viewBox="0 0 100 100" className="stx-icon">
                <circle cx="50" cy="50" r="45" className="stx-circle" />
                <path
                  className="stx-path"
                  d={
                    popup.success
                      ? "M30 52 L45 65 L70 38"
                      : "M35 35 L65 65 M65 35 L35 65"
                  }
                />
              </svg>
            </div>
            <h2 className="stx-popup-title">
              {popup.success ? "Success!" : "Error"}
            </h2>
            <p className="stx-popup-text">{popup.message}</p>
            <button
              className="stx-popup-btn"
              onClick={() => setPopup({ ...popup, show: false })}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendTransfer;