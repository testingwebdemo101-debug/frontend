import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PaypalWithdrawal.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

// Icons
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
  { key: "usdtTron", label: "USDT-TRC20", symbol: "USDT-TRC20", icon: usdttether },
  { key: "usdtBnb", label: "USDT-BEP20", symbol: "USDT-BEP20", icon: usdt },
];

/* ================= STATIC PRICES (matching backend) ================= */
const STATIC_PRICES = {
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

/* ================= FORMAT ================= */
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

const PaypalWithdrawal = () => {
  const navigate = useNavigate();

  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [usdAmount, setUsdAmount] = useState("");
  const [coinAmount, setCoinAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [coinBalance, setCoinBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [fullName, setFullName] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= HELPER: Get CoinGecko ID ================= */
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

  /* ================= FETCH PRICE FROM BACKEND FIRST ================= */
  const fetchPriceFromBackend = async (coinKey) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://backend-srtt.onrender.com/api/crypto/price/${coinKey}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        return res.data.data.price;
      }
      return null;
    } catch (err) {
      console.log("Backend price fetch failed, falling back to CoinGecko");
      return null;
    }
  };

  /* ================= FETCH LIVE PRICE WITH FALLBACK ================= */
  const fetchLivePrice = async (coinKey) => {
    // First try backend
    const backendPrice = await fetchPriceFromBackend(coinKey);
    if (backendPrice) {
      return backendPrice;
    }

    // Fallback to CoinGecko
    try {
      const coinId = getCoinGeckoId(coinKey);
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        { params: { ids: coinId, vs_currencies: "usd" } }
      );
      return res.data[coinId]?.usd || STATIC_PRICES[coinKey] || 0;
    } catch (err) {
      console.log("CoinGecko fetch failed, using static price");
      return STATIC_PRICES[coinKey] || 0;
    }
  };

  /* ================= FETCH BALANCE ================= */
  const fetchBalance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      // Get balance from API
      const res = await axios.get(`${API}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const balances = res.data.data.walletBalances || {};
      const bal = balances[selectedCoin.key] || 0;
      
      setCoinBalance(bal);

      // Get price (prioritize backend)
      const currentPrice = await fetchLivePrice(selectedCoin.key);
      setPrice(currentPrice);
      setUsdBalance(bal * currentPrice);
      setError("");

    } catch (err) {
      console.error("Balance fetch error:", err);
      
      // Fallback to localStorage (like Dashboard does)
      try {
        const savedProfile = localStorage.getItem("userProfile");
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          if (profile.walletBalances && profile.walletBalances[selectedCoin.key]) {
            const bal = profile.walletBalances[selectedCoin.key];
            setCoinBalance(bal);
            
            const staticPrice = STATIC_PRICES[selectedCoin.key] || 0;
            setPrice(staticPrice);
            setUsdBalance(bal * staticPrice);
          }
        }
      } catch (e) {
        console.error("LocalStorage fallback error:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [selectedCoin]);

  /* ================= USD → COIN ================= */
  useEffect(() => {
    if (!usdAmount || !price) {
      setCoinAmount(0);
      return;
    }
    setCoinAmount(Number(usdAmount) / price);
  }, [usdAmount, price]);

  /* ================= CHECK BALANCE ================= */
  const hasInsufficientBalance = () => {
    if (!usdAmount || !coinAmount) return false;
    return coinAmount > coinBalance;
  };

  /* ================= HANDLE CONTINUE ================= */
  const handleContinue = async () => {
    // Clear previous error
    setError("");

    // Validate inputs
    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!paypalEmail.trim()) {
      setError("Please enter your PayPal email");
      return;
    }

    if (!usdAmount || Number(usdAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    // Check balance
    if (hasInsufficientBalance()) {
      setError(`Insufficient ${selectedCoin.symbol} balance. You have ${coinBalance.toFixed(8)} ${selectedCoin.symbol} available.`);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://backend-srtt.onrender.com/api/paypal/initiate",
        {
          asset: selectedCoin.key,
          amount: coinAmount,
          usdAmount: Number(usdAmount),
          paypalEmail: paypalEmail,
          fullName: fullName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/paypalwithdrawalotp", {
          state: {
            asset: selectedCoin.key,
            amount: coinAmount,
            usdAmount: Number(usdAmount),
            paypalEmail,
            fullName,
            price: price,
            transferId: response.data.data?.transferId
          },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate withdrawal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paypal-withdrawal-page">
      <div className="paypal-withdrawal-card">
        <span className="paypal-back" onClick={() => navigate(-1)}>←</span>

        <div className="paypal-withdrawal-logo">
          <img src={logo} alt="InstaCoinXPay" />
        </div>

        <h2 className="paypal-withdrawal-title">Paypal Withdrawal</h2>

        {error && (
          <div className="paypal-withdrawal-error">
            {error}
          </div>
        )}

        <div className="paypal-withdrawal-form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="paypal-withdrawal-form-group">
          <label>Paypal Email Address</label>
          <input 
            type="email" 
            placeholder="Enter email address"
            value={paypalEmail}
            onChange={(e) => setPaypalEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="paypal-withdrawal-form-group">
          <label>Select Crypto</label>
          <div className="paypal-input-with-icon">
            <img src={selectedCoin.icon} alt={selectedCoin.symbol} />
            <span className="paypal-coin-symbol">
              {selectedCoin.symbol}
            </span>
            <select
              value={selectedCoin.key}
              onChange={(e) =>
                setSelectedCoin(
                  coins.find((c) => c.key === e.target.value)
                )
              }
              disabled={loading}
            >
              {coins.map((coin) => (
                <option key={coin.key} value={coin.key}>
                  {coin.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="paypal-withdrawal-form-group">
          <label>Amount (USD)</label>
          <div className="paypal-input-with-icon">
            <span className="paypal-input-text">$</span>
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              placeholder="Enter amount in USD"
              disabled={loading}
            />
          </div>
          <small>
            ≈ {coinAmount.toFixed(8)} {selectedCoin.symbol}
          </small>
        </div>

        <div className="paypal-withdrawal-info-row">
          <span>Available</span>
          <div className="paypal-withdrawal-balance-coin">
            <img src={selectedCoin.icon} alt={selectedCoin.symbol} />
            <span>
              {coinBalance.toFixed(8)} {selectedCoin.symbol}
            </span>
          </div>
        </div>

        {/* Show USD balance like other components */}
        <div className="paypal-withdrawal-info-row" style={{ marginTop: "5px", fontSize: "12px", color: "#666" }}>
          <span></span>
          <span>{formatCurrency(usdBalance)} USD</span>
        </div>

        {hasInsufficientBalance() && (
          <div className="paypal-withdrawal-insufficient-warning">
            Insufficient balance. You have {coinBalance.toFixed(8)} {selectedCoin.symbol} ({formatCurrency(usdBalance)}) available.
          </div>
        )}

        <button
          className={`paypal-withdrawal-btn ${loading ? 'loading' : ''}`}
          onClick={handleContinue}
          disabled={loading || hasInsufficientBalance()}
        >
          {loading ? "Processing..." : "Continue"}
        </button>

      </div>
    </div>
  );
};

export default PaypalWithdrawal;