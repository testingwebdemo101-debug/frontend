import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SendBTC.css";
import logo from "../assets/logo.png";
import spinWheelIcon from "../assets/spinandwin.png";

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

const API = "https://backend-srtt.onrender.com/api/transfer";

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
      rel="noopener noreferrer nofollow"
      className={`whatsapp-float ${pulseEffect ? 'pulse' : ''} ${className}`}
      style={combinedStyles}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.677-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.826 9.826 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
      </svg>
    </a>
  );
};

/* ================= SPIN WHEEL NAVIGATION BUTTON ================= */
const SpinWheelNavButton = ({ 
  position = "right",
  bottom = "100px",
  right = "30px",
  left = "auto",
  size = "60px",
  pulseEffect = true,
  className = "",
  style = {}
}) => {
  const navigate = useNavigate();
  
  const positionStyles = position === "left" 
    ? { left: left || "20px", right: "auto" }
    : { right: right || "20px", left: "auto" };

  const combinedStyles = {
    position: 'fixed',
    bottom: bottom,
    width: size,
    height: size,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #f7931a, #c8930a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4)',
    zIndex: 10000,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    border: '3px solid rgba(255, 215, 0, 0.6)',
    overflow: 'hidden',
    padding: '0px',
    ...positionStyles,
    ...style
  };

  React.useEffect(() => {
    if (!document.querySelector('#spin-wheel-nav-keyframes-sendbtc')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'spin-wheel-nav-keyframes-sendbtc';
      styleSheet.textContent = `
        @keyframes spinWheelNavPulse {
          0% {
            box-shadow: 0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4), 0 0 0 0 rgba(247, 147, 26, 0.7);
          }
          70% {
            box-shadow: 0 8px 35px rgba(247, 147, 26, 0.7), 0 0 30px rgba(200, 147, 10, 0.6), 0 0 0 15px rgba(247, 147, 26, 0);
          }
          100% {
            box-shadow: 0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4), 0 0 0 0 rgba(247, 147, 26, 0);
          }
        }
        
        @keyframes spinWheelNavGlow {
          0% {
            filter: drop-shadow(0 0 5px #f7931a);
          }
          50% {
            filter: drop-shadow(0 0 15px #c8930a);
          }
          100% {
            filter: drop-shadow(0 0 5px #f7931a);
          }
        }
        
        @keyframes spinWheelNavRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .spin-wheel-nav-float {
          animation: ${pulseEffect ? 'spinWheelNavPulse 2s infinite, spinWheelNavGlow 3s infinite' : 'none'};
        }
        
        .spin-wheel-nav-float:hover {
          transform: scale(1.15) rotate(10deg) !important;
          background: radial-gradient(circle at 30% 30%, #ffd700, #f7931a) !important;
          box-shadow: 0 10px 40px rgba(247, 147, 26, 0.8), 0 0 35px rgba(255, 215, 0, 0.7) !important;
        }
        
        .spin-wheel-nav-float:hover .wheel-icon-image {
          transform: scale(1.2) rotate(15deg) !important;
        }
        
        .wheel-icon-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, [pulseEffect]);

  const handleClick = () => {
    navigate('/spinwheel');
  };

  return (
    <button
      onClick={handleClick}
      className={`spin-wheel-nav-float ${className}`}
      style={combinedStyles}
      aria-label="Go to Fortune Wheel"
      title="Spin the Fortune Wheel!"
    >
      <img 
        src={spinWheelIcon} 
        alt="Fortune Wheel"
        className="wheel-icon-image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%',
          transition: 'transform 0.3s ease',
          transform: 'scale(1.1)'
        }}
      />
      
      <div style={{
        position: 'absolute',
        inset: '-6px',
        borderRadius: '50%',
        border: '3px solid rgba(255, 215, 0, 0.5)',
        borderTopColor: '#f7931a',
        borderRightColor: '#ffd700',
        borderBottomColor: '#f7931a',
        borderLeftColor: '#ffd700',
        opacity: 0.9,
        animation: 'spinWheelNavRotate 4s linear infinite',
        pointerEvents: 'none',
        boxShadow: '0 0 15px rgba(247, 147, 26, 0.6)'
      }} />
      
      <div style={{
        position: 'absolute',
        inset: '2px',
        borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />
    </button>
  );
};

/* ================= COINS ================= */
const coins = [
  { key: "btc", label: "Bitcoin", symbol: "BTC", icon: btc },
  { key: "eth", label: "Ethereum", symbol: "ETH", icon: eth },
  { key: "bnb", label: "BNB", symbol: "BNB", icon: bnb },
  { key: "sol", label: "Solana", symbol: "SOL", icon: sol },
  { key: "xrp", label: "XRP", symbol: "XRP", icon: xrp },
  { key: "doge", label: "Dogecoin", symbol: "DOGE", icon: doge },
  { key: "ltc", label: "Litecoin", symbol: "LTC", icon: ltc },
  { key: "trx", label: "TRX", symbol: "TRX", icon: trx },
  { key: "usdtTron", label: "USDT (TRON)", symbol: "USDT-TRC20", icon: usdttether },
  { key: "usdtBnb", label: "USDT (BNB)", symbol: "USDT-BEP20", icon: usdt },
];

/* ================= FORMAT ================= */
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

export default function SendBTC() {
  const navigate = useNavigate();

  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [open, setOpen] = useState(false);

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [coinBalance, setCoinBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [coinAmount, setCoinAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [availableBTC, setAvailableBTC] = useState("0.00000000");

  /* ================= POPUP ================= */
  const [popup, setPopup] = useState({
    show: false,
    success: false,
    message: "",
  });

  /* ================= FETCH BALANCE ================= */
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Get balance from API
      const res = await axios.get(`${API}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const balances = res.data.data.walletBalances || {};
      const bal = balances[selectedCoin.key] || 0;
      
      setCoinBalance(bal);

      // Get price from the same endpoint or from cryptoDataService
      try {
        // Try to get price from cryptoDataService endpoint
        const priceRes = await axios.get(
          `https://backend-srtt.onrender.com/api/crypto/price/${selectedCoin.key}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (priceRes.data.success) {
          const currentPrice = priceRes.data.data.price;
          setPrice(currentPrice);
          setUsdBalance(bal * currentPrice);
          
          // Calculate available BTC
          if (selectedCoin.key === "btc") {
            setAvailableBTC(bal.toFixed(8));
          }
        }
      } catch (priceError) {
        // Fallback to CoinGecko
        const coinId = getCoinGeckoId(selectedCoin.key);
        const priceRes = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price",
          { params: { ids: coinId, vs_currencies: "usd" } }
        );
        
        const currentPrice = priceRes.data[coinId]?.usd || 0;
        setPrice(currentPrice);
        setUsdBalance(bal * currentPrice);
        
        if (selectedCoin.key === "btc") {
          setAvailableBTC(bal.toFixed(8));
        }
      }
      
    } catch (err) {
      console.error("Balance fetch error:", err);
      
      // Fallback to static data from Dashboard
      try {
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          if (profile.walletBalances && profile.walletBalances[selectedCoin.key]) {
            const bal = profile.walletBalances[selectedCoin.key];
            setCoinBalance(bal);
            
            // Use static price
            const staticPrice = getStaticPrice(selectedCoin.key);
            setPrice(staticPrice);
            setUsdBalance(bal * staticPrice);
            
            if (selectedCoin.key === "btc") {
              setAvailableBTC(bal.toFixed(8));
            }
          }
        }
      } catch (e) {
        console.error("LocalStorage fallback error:", e);
      }
    }
  };

  // Helper to get CoinGecko ID
  const getCoinGeckoId = (coinKey) => {
    const map = {
      btc: "bitcoin",
      eth: "ethereum",
      bnb: "binancecoin",
      sol: "solana",
      xrp: "ripple",
      doge: "dogecoin",
      ltc: "litecoin",
      trx: "tron",
      usdtTron: "tether",
      usdtBnb: "tether",
    };
    return map[coinKey] || coinKey;
  };

  // Helper to get static price
  const getStaticPrice = (coinKey) => {
    const staticPrices = {
      btc: 85966.43,
      eth: 2296.54,
      bnb: 596.78,
      sol: 172.45,
      xrp: 0.52,
      doge: 0.12,
      ltc: 81.34,
      trx: 0.104,
      usdtTron: 1.00,
      usdtBnb: 1.00
    };
    return staticPrices[coinKey] || 0;
  };

  useEffect(() => {
    fetchBalance();
  }, [selectedCoin]);

  /* ================= USD → COIN ================= */
  useEffect(() => {
    if (!amount || !price) {
      setCoinAmount(0);
      return;
    }
    setCoinAmount(Number(amount) / price);
  }, [amount, price]);

  /* ================= MAX ================= */
  const handleMax = () => {
    setAmount(usdBalance.toFixed(2));
  };

  /* ================= WITHDRAW ================= */
  const handleWithdraw = async () => {
    if (!address || !amount) {
      setPopup({ show: true, success: false, message: "Enter address & amount" });
      return;
    }

    if (coinAmount > coinBalance) {
      setPopup({ show: true, success: false, message: "Insufficient balance" });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        API,
        {
          asset: selectedCoin.key,
          toAddress: address,
          amount: Number(coinAmount.toFixed(8)),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Navigate to OTP page
      navigate("/transferotp", {
        state: {
          transferData: {
            transferId: res.data.data._id,
            asset: selectedCoin.key,
            toAddress: address,
            amount: Number(coinAmount.toFixed(8)),
            requiresOTPVerification: true,
            otpSent: true
          },
          userEmail: localStorage.getItem("userEmail") || "",
          coinAmount: coinAmount,
          usdAmount: amount,
          assetName: selectedCoin.symbol,
          assetIcon: selectedCoin.icon,
          price: price
        }
      });

      // Clear form
      setAddress("");
      setAmount("");
      fetchBalance();
      
    } catch (err) {
      setPopup({
        show: true,
        success: false,
        message: err.response?.data?.error || "Transfer Failed",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <div className="cryptotransfer-container">
        <div className="cryptotransfer-logo-box">
          <img src={logo} alt="logo" />
        </div>

        <div className="cryptotransfer-card">
          <span className="sendbtc-back" onClick={() => navigate(-1)}>←</span>
          <h2 className="cryptotransfer-title">SEND</h2>

          <div className="cryptotransfer-input-group">
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Wallet Address"
            />
          </div>

          <div className="cryptotransfer-input-group">
            <label>Network</label>

            <div className="cryptotransfer-network-selector" onClick={() => setOpen(!open)}>
              <div className="cryptotransfer-selected-network">
                <img src={selectedCoin.icon} alt="" />
                <span>{selectedCoin.symbol}</span>
              </div>
              <span className={`cryptotransfer-dropdown-arrow ${open ? "cryptotransfer-arrow-rotated" : ""}`}>▼</span>
            </div>

            {open && (
              <div className="cryptotransfer-network-options">
                {coins.map((coin) => (
                  <div
                    key={coin.key}
                    className="cryptotransfer-network-option"
                    onClick={() => {
                      setSelectedCoin(coin);
                      setOpen(false);
                    }}
                  >
                    <div className="cryptotransfer-coin-preview">
                      <img src={coin.icon} alt={coin.symbol} />
                      <div className="cryptotransfer-coin-details">
                        <strong>{coin.symbol}</strong>
                        <small>{coin.label}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="cryptotransfer-input-group">
            <label>Withdrawal Amount</label>
            <div className="cryptotransfer-amount-wrapper">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              <div className="cryptotransfer-amount-buttons">
                <span>USD</span>
                <span className="cryptotransfer-max-amount" onClick={handleMax}>
                  MAX
                </span>
              </div>
            </div>
            <small>
              ≈ {coinAmount.toFixed(8)} {selectedCoin.symbol}
            </small>
          </div>

          <div className="cryptotransfer-balance-info">
            <span>Available</span>
            <span>
              {formatCurrency(usdBalance)} {selectedCoin.symbol}
            </span>
          </div>

          {/* Show BTC amount like in screenshot */}
          {selectedCoin.key === "btc" && (
            <div className="cryptotransfer-balance-info" style={{ marginTop: "5px", fontSize: "12px", color: "#666" }}>
              <span>≈ {availableBTC} BTC</span>
            </div>
          )}

          <p className="cryptotransfer-note">
            * Make sure the address matches the selected network.
          </p>

          <div className="cryptotransfer-btn-container">
            <button
              className="cryptotransfer-proceed-btn"
              onClick={handleWithdraw}
              disabled={loading}
            >
              {loading ? "Processing..." : "Transfer Amount"}
            </button>
          </div>
        </div>

        {/* POPUP (ONLY FOR ERRORS) */}
        {popup.show && (
          <div className="cryptotransfer-popup-overlay">
            <div className="cryptotransfer-popup-card">
              <div
                className={`cryptotransfer-icon-box ${
                  popup.success ? "success" : "error"
                }`}
              >
                <svg viewBox="0 0 100 100" className="cryptotransfer-icon">
                  <circle cx="50" cy="50" r="45" className="cryptotransfer-circle" />

                  {popup.success ? (
                    <path
                      className="cryptotransfer-path"
                      d="M30 52 L45 65 L70 38"
                    />
                  ) : (
                    <>
                      <path
                        className="cryptotransfer-path"
                        d="M35 35 L65 65"
                      />
                      <path
                        className="cryptotransfer-path"
                        d="M65 35 L35 65"
                      />
                    </>
                  )}
                </svg>
              </div>

              <p className="cryptotransfer-popup-text">{popup.message}</p>

              <button
                className="cryptotransfer-ok-btn"
                onClick={() => {
                  setPopup({ ...popup, show: false });
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Float Button */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message={`Hello! I need assistance with sending ${selectedCoin.symbol} on InstaCoinXPay.`}
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />

      {/* Spin Wheel Navigation Button */}
      <SpinWheelNavButton 
        position="right"
        bottom="100px"
        right="30px"
        pulseEffect={true}
        size="60px"
      />
    </>
  );
}