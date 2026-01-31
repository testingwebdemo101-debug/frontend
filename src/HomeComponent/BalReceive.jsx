import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BalReceive.css";

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

const coins = [
  { key: "btc", symbol: "BTC", label: "Bitcoin", icon: btc },
  { key: "eth", symbol: "ETH", label: "Ethereum", icon: eth },
  { key: "bnb", symbol: "BNB", label: "BNB", icon: bnb },
  { key: "sol", symbol: "SOL", label: "Solana", icon: sol },
  { key: "xrp", symbol: "XRP", label: "XRP", icon: xrp },
  { key: "doge", symbol: "DOGE", label: "Dogecoin", icon: doge },
  { key: "ltc", symbol: "LTC", label: "Litecoin", icon: ltc },
  { key: "trx", symbol: "TRX", label: "TRON", icon: trx },
  { key: "usdtTron", symbol: "USDT-TRC20", label: "USDT (TRON)", icon: usdt },
  { key: "usdtBnb", symbol: "USDT-BEP20", label: "USDT (BNB)", icon: usdttether },
];

const BalReceive = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [open, setOpen] = useState(false);

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://backend-instacoinpay-1.onrender.com/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setUserData(data.data);
        }
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /* ================= ADDRESS ================= */
  const address =
    userData?.walletAddresses?.[selectedCoin.key] || "";

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bal-receive-wrapper">
      <div className="bal-receive-container">

        {/* Header */}
        <div className="bal-receive-header-section">
          <span
            className="bal-receive-back-button"
            onClick={() => navigate(-1)}
          >
            ←
          </span>
          <h2>Receive</h2>
        </div>

        {/* Coin Dropdown */}
        <div className="bal-receive-coin-section">
          <div
            className="cryptotransfer-network-selector"
            onClick={() => setOpen(!open)}
          >
            <div className="cryptotransfer-selected-network">
              <img src={selectedCoin.icon} alt={selectedCoin.symbol} />
              <span>{selectedCoin.symbol}</span>
            </div>
            <span
              className={`cryptotransfer-dropdown-arrow ${
                open ? "cryptotransfer-arrow-rotated" : ""
              }`}
            >
              ▼
            </span>
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
                    <div>
                      <strong>{coin.symbol}</strong>
                      <small>{coin.label}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="bal-receive-warning-message">
          Only send {selectedCoin.label} ({selectedCoin.symbol}) to this address.
        </div>

        {/* Address + QR */}
        {address ? (
          <>
            <div className="bal-receive-qr-container">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`}
                alt="QR Code"
              />
            </div>

            <p className="bal-receive-address-text">{address}</p>

            <div className="bal-receive-actions-section">
              <button
                className="bal-receive-copy-button"
                onClick={() => navigator.clipboard.writeText(address)}
              >
                Copy Address
              </button>
            </div>
          </>
        ) : (
          <p>No wallet address found</p>
        )}

        {/* Dashboard */}
        <button
          className="bal-receive-dashboard-button"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default BalReceive;
