import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BankWithdrawal.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

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

const BALANCE_API = "https://backend-srtt.onrender.com/api/transfer";
const WITHDRAW_API = "https://backend-srtt.onrender.com/api/withdrawals/bank-withdrawal";

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

const BankWithdrawal = () => {
  const navigate = useNavigate();

  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [usdAmount, setUsdAmount] = useState("");
  const [coinAmount, setCoinAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [coinBalance, setCoinBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  // Bank details
  const [fullName, setFullName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");

  /* ================= PRICE ================= */
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

  /* ================= BALANCE ================= */
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BALANCE_API}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const balances = res.data.data.walletBalances || {};
      const bal = balances[selectedCoin.key] || 0;

      const livePrice = await fetchLivePrice(selectedCoin.key);

      setCoinBalance(bal);
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
    if (!usdAmount || !price) {
      setCoinAmount(0);
      return;
    }
    setCoinAmount(Number(usdAmount) / price);
  }, [usdAmount, price]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (
      !fullName ||
      !bankName ||
      !accountNumber ||
      !swiftCode ||
      !usdAmount ||
      coinAmount <= 0
    ) {
      return alert("Please fill all fields correctly");
    }

    if (coinAmount > coinBalance) {
      return alert("Insufficient balance");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        WITHDRAW_API,
        {
          asset: selectedCoin.key,
          usdAmount,
          coinAmount,
          fullName,
          bankName,
          accountNumber,
          swiftCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 👉 Redirect to OTP verification screen
      navigate("/bankwithdrawalotp", {
        state: {
          asset: selectedCoin.key,
          amount: coinAmount,
          usdAmount,
          transferId: res.data.data.transferId,
          cardStatus: res.data.data.cardStatus, // ✅ IMPORTANT
          fullName,
          bankName,
          accountNumber,
          swiftCode,
        },
      });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bank-withdrawal-page">
      <div className="bank-withdrawal-card">
        <span className="bank-withdrawal-back" onClick={() => navigate(-1)}>
          ←
        </span>

        <div className="bank-withdrawal-logo">
          <img src={logo} alt="InstaCoinXPay" />
        </div>

        <h2 className="bank-withdrawal-title">Bank Withdrawal</h2>

        <div className="bank-withdrawal-form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div className="bank-withdrawal-form-group">
          <label>Bank Name</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="Enter bank name"
          />
        </div>

        <div className="bank-withdrawal-form-group">
          <label>Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter account number"
          />
        </div>

        <div className="bank-withdrawal-form-group">
          <label>Swift Code</label>
          <input
            type="text"
            value={swiftCode}
            onChange={(e) => setSwiftCode(e.target.value)}
            placeholder="Enter swift code"
          />
        </div>

        <div className="bank-withdrawal-form-group">
          <label>Select Crypto</label>
          <div className="bank-input-with-icon">
            <img src={selectedCoin.icon} alt={selectedCoin.symbol} />
            <select
              value={selectedCoin.key}
              onChange={(e) =>
                setSelectedCoin(coins.find(c => c.key === e.target.value))
              }
            >
              {coins.map((coin) => (
                <option key={coin.key} value={coin.key}>
                  {coin.symbol} — {coin.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bank-withdrawal-form-group">
          <label>Amount (USD)</label>
          <div className="bank-input-with-icon">
            <span className="bank-input-text">$</span>
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              placeholder="Enter amount in USD"
            />
          </div>
          <small>
            ≈ {coinAmount.toFixed(8)} {selectedCoin.symbol}
          </small>
        </div>

        <div className="bank-withdrawal-info-row">
          <span>Available</span>
          <div className="bank-withdrawal-balance-coin">
            <img src={selectedCoin.icon} alt={selectedCoin.symbol} />
            <span>{selectedCoin.symbol}</span>
            <small>(~${usdBalance.toFixed(2)})</small>
          </div>
        </div>

        <button
          className="bank-withdrawal-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default BankWithdrawal;
