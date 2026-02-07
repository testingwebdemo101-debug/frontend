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

const PaypalWithdrawal = () => {
  const navigate = useNavigate();

  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [usdAmount, setUsdAmount] = useState("");
  const [coinAmount, setCoinAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [coinBalance, setCoinBalance] = useState(0);
  const [usdBalance, setUsdBalance] = useState(0);

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

      const res = await axios.get(`${API}/balance`, {
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

  return (
    <div className="paypal-withdrawal-page">
      <div className="paypal-withdrawal-card">
        <span className="paypal-back" onClick={() => navigate(-1)}>←</span>

        <div className="paypal-withdrawal-logo">
          <img src={logo} alt="InstaCoinXPay" />
        </div>

        <h2 className="paypal-withdrawal-title">Paypal Withdrawal</h2>

        <div className="paypal-withdrawal-form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" />
        </div>

        <div className="paypal-withdrawal-form-group">
          <label>Paypal Email Address</label>
          <input type="email" placeholder="Enter email address" />
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
            <small>(~${usdBalance.toFixed(2)})</small>
          </div>
        </div>

        {/* 🔥 MODIFIED CONTINUE BUTTON (ONLY CHANGE) */}
        <button
          className="paypal-withdrawal-btn"
          onClick={async () => {
            const token = localStorage.getItem("token");

            await axios.post(
              "https://backend-srtt.onrender.com/api/paypal/initiate",
              {
                asset: selectedCoin.key,
                amount: coinAmount,
                usdAmount,
                paypalEmail: document.querySelector('input[type="email"]').value,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            navigate("/paypalwithdrawalotp", {
              state: {
                asset: selectedCoin.key,
                amount: coinAmount,
                usdAmount,
              },
            });
          }}
        >
          Continue
        </button>

      </div>
    </div>
  );
};

export default PaypalWithdrawal;
