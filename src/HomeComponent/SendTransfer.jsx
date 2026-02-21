import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";
import "./SendTransfer.css";
import btcIcon from "../assets/btc.png";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({
  phoneNumber = "15485825756",
  message = "Hello! I need assistance with sending crypto on InstaCoinXPay.",
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
      rel="noopener noreferrer"
      style={combinedStyles}
      className={className}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </a>
  );
};

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

 const getAssetKey = () => {
  // If originalAsset has a key, use it AS-IS (don't lowercase!)
  if (state?.originalAsset?.key) {
    console.log('✅ Using originalAsset.key:', state.originalAsset.key);
    return state.originalAsset.key;
  }

  if (state?.originalAsset?.symbol) {
    console.log('✅ Using originalAsset.symbol:', state.originalAsset.symbol);
    // ✅ FIX: Convert USDTTRON to usdtTron (proper camelCase)
    const symbol = state.originalAsset.symbol;
    
    // Special handling for USDT variants
    if (symbol === 'USDTTRON') return 'usdtTron';
    if (symbol === 'USDTBNB') return 'usdtBnb';
    
    return symbol.toLowerCase();
  }

  // Otherwise, map the display name to the correct key
  const nameToKeyMap = {
    'USDT-BEP20': 'usdtBnb',
    'USDT-TRC20': 'usdtTron',
    'USDT (BEP-20)': 'usdtBnb',
    'USDT (TRC-20)': 'usdtTron',
    'TETHER (BEP-20)': 'usdtBnb',
    'TETHER (TRC-20)': 'usdtTron',
    'BTC': 'btc',
    'ETH': 'eth',
    'BNB': 'bnb',
    'SOL': 'sol',
    'XRP': 'xrp',
    'DOGE': 'doge',
    'LTC': 'ltc',
    'TRX': 'trx'
  };

  const displayName = state?.name?.toUpperCase();
  const subName = state?.sub?.toUpperCase();
  
  console.log('🔍 Mapping from display name:', displayName, 'or sub:', subName);
  
  // Check both name and sub
  const mappedKey = nameToKeyMap[displayName] || nameToKeyMap[subName];
  
  if (mappedKey) {
    console.log('✅ Mapped to key:', mappedKey);
    return mappedKey;
  }

  // Fallback
  const fallback = state?.name?.toLowerCase() || 'btc';
  console.log('⚠️ Using fallback:', fallback);
  return fallback;
};

  const assetKey = getAssetKey();

  const asset = {
    name: state?.name || "BTC",
    sub: state?.sub || "Bitcoin",
    icon: state?.icon || btcIcon,
    originalAsset: state?.originalAsset || null,
    key: assetKey,
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

    console.log('🔍 FULL ASSET OBJECT:', asset);
    console.log('🔍 ORIGINAL ASSET:', asset.originalAsset);
    console.log('🔍 ASSET KEY:', asset.key);

    const { balance, balanceValue, currentPrice } = asset.originalAsset;
    
    console.log('💰 LOADING BALANCES:');
    console.log('  - balance:', balance);
    console.log('  - balanceValue:', balanceValue);
    console.log('  - currentPrice:', currentPrice);
    
    setCoinBalance(balance);
    setUsdBalance(balanceValue);
    setPrice(currentPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // ✅ FIX: Add small tolerance for floating-point precision
    const tolerance = 0.00001;
    const availableBalance = coinBalance;
    
    let finalCoinAmount = coinAmount;
    
    if (coinAmount > availableBalance) {
      const difference = coinAmount - availableBalance;
      const percentDifference = (difference / availableBalance) * 100;
      
      if (percentDifference <= 0.01) {
        finalCoinAmount = availableBalance;
        console.log('✅ Adjusted amount from', coinAmount, 'to', finalCoinAmount, 'due to rounding');
      } else {
        setPopup({
          show: true,
          message: `Insufficient balance. You have ${availableBalance.toFixed(8)} ${asset.name}, but trying to send ${coinAmount.toFixed(8)} ${asset.name}. Please reduce the amount or click MAX.`,
          success: false,
        });
        return;
      }
    }

    try {
      setLoading(true);

      console.log('🔍 Sending transfer with asset key:', asset.key);
      console.log('💰 Final coin amount:', finalCoinAmount);
      console.log('💵 Coin balance:', availableBalance);

      const res = await API.post("/transfer", {
        asset: asset.key,
        toAddress: formData.toAddress,
        amount: Number(finalCoinAmount.toFixed(8)),
        notes: formData.notes,
      });

      if (res.data.data.requiresOTPVerification && res.data.data.otpSent) {
        navigate("/transferotp", {
          state: {
            transferData: {
              transferId: res.data.data._id,
              asset: asset.key,
              toAddress: formData.toAddress,
              amount: Number(finalCoinAmount.toFixed(8)),
              notes: formData.notes,
              requiresOTPVerification: true,
              otpSent: true
            },
            userEmail: localStorage.getItem("userEmail") || "",
            coinAmount: finalCoinAmount,
            usdAmount: formData.amount,
            assetName: asset.name,
            assetIcon: asset.icon,
            price: price
          }
        });
      } else {
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
    <>
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
              Balance: <b>{formatCurrency(usdBalance)}</b> ({coinBalance.toFixed(8)} {asset.name})
            </div>
          </div>

          <div className="st-group">
            <label>Amount (USD)</label>
            <div className="st-amount-box">
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
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
                onClick={() => {
                  setPopup({ ...popup, show: false });
                  navigate("/creditcards");
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      <WhatsAppFloat />
    </>
  );
};

export default SendTransfer;