import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SendBTC.css";
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

const API = "https://backend-srtt.onrender.com/api/transfer";

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
  { key: "usdtTron", label: "USDT (TRON)", symbol: "USDT-TRC20", icon:  usdttether },
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

  /* ================= POPUP ================= */
  const [popup, setPopup] = useState({
    show: false,
    success: false,
    message: "",
  });

  const [transferResult, setTransferResult] = useState(null);

  /* ================= PRICE FETCH ================= */
  const fetchLivePrice = async (coinKey) => {
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

    const id = map[coinKey];
    if (!id) return 0;

    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      { params: { ids: id, vs_currencies: "usd" } }
    );

    return res.data[id]?.usd || 0;
  };

  /* ================= FETCH BALANCE ================= */
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const balances = res.data.data.walletBalances || {};
      const bal = balances[selectedCoin.key] || 0;

      setCoinBalance(bal);

      const livePrice = await fetchLivePrice(selectedCoin.key);
      setPrice(livePrice);
      setUsdBalance(bal * livePrice);
    } catch (err) {
      console.error(err);
    }
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

      // Store transfer result
      setTransferResult(res.data.data);
      
      // DIRECTLY NAVIGATE TO TRANSFER OTP PAGE
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

      {/* ================= POPUP (ONLY FOR ERRORS NOW) ================= */}
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
        onClick={() => setPopup({ ...popup, show: false })}
      >
        OK
      </button>
    </div>
  </div>
)}

    </div>
  );
}