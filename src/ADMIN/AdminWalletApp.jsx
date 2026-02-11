import React, { useState } from "react";
import axios from "axios";
import "./AdminWalletApp.css";

const API = "https://backend-srtt.onrender.com/api/addcoin";

export default function AdWalletApp() {
  const [email, setEmail] = useState("");
  const [showWallet, setShowWallet] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(false);

  const [balances, setBalances] = useState([
    { label: "BTC", key: "btc", value: 0, original: 0, editing: false },
    { label: "ETH", key: "eth", value: 0, original: 0, editing: false },
    { label: "USDT (TRON)", key: "usdtTron", value: 0, original: 0, editing: false },
    { label: "USDT (BNB)", key: "usdtBnb", value: 0, original: 0, editing: false },
    { label: "BNB", key: "bnb", value: 0, original: 0, editing: false },
    { label: "TRX", key: "trx", value: 0, original: 0, editing: false },
    { label: "SOL", key: "sol", value: 0, original: 0, editing: false },
    { label: "XRP", key: "xrp", value: 0, original: 0, editing: false },
    { label: "DOGE", key: "doge", value: 0, original: 0, editing: false },
    { label: "LTC", key: "ltc", value: 0, original: 0, editing: false },
  ]);

  /* =========================
     FETCH WALLET
  ========================= */
  const fetchWalletBalances = async () => {
    try {
      setLoadingWallet(true);
      const res = await axios.get(`${API}/${email}`);
      const walletBalances = res.data.walletBalances;

      const updated = balances.map((coin) => ({
        ...coin,
        value: walletBalances?.[coin.key] ?? 0,
        original: walletBalances?.[coin.key] ?? 0,
        editing: false,
      }));

      setBalances(updated);
      setShowWallet(true);
    } catch {
      alert("Failed to fetch wallet");
    } finally {
      setLoadingWallet(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email.trim()) return alert("Enter email");
    fetchWalletBalances();
  };

  /* =========================
     CONFIRM CREDIT / DEBIT
  ========================= */
  const confirmUpdate = async (index) => {
  const coin = balances[index];

  try {
    setLoadingIndex(index);

    await axios.post(API, {
      email,
      asset: coin.key,
      amount: coin.value, // FINAL BALANCE
      // No need to pass original balance as backend calculates it
    });

    const updated = [...balances];
    updated[index].original = coin.value;
    updated[index].editing = false;
    setBalances(updated);
  } catch {
    alert("Failed to update balance");
  } finally {
    setLoadingIndex(null);
  }
};

  const changeValue = (index, enteredAmount) => {
    const updated = [...balances];
    const coin = updated[index];

    // enteredAmount is the CREDIT/DEBIT amount
    coin.value =
      coin.mode === "credit"
        ? coin.original + enteredAmount
        : coin.original - enteredAmount;

    setBalances(updated);
  };

  const startCredit = (index) => {
    const updated = [...balances];
    updated[index].editing = true;
    updated[index].mode = "credit";
    updated[index].value = updated[index].original;
    setBalances(updated);
  };

  const startDebit = (index) => {
    const updated = [...balances];
    updated[index].editing = true;
    updated[index].mode = "debit";
    updated[index].value = updated[index].original;
    setBalances(updated);
  };

  return (
    <div className="wallet-app">
      {!showWallet ? (
        <div className="login-box">
          <h2>Admin Wallet</h2>
          <p>Access user wallet using email</p>

          <form onSubmit={submitHandler}>
            <input
              type="email"
              placeholder="User email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button disabled={loadingWallet}>
              {loadingWallet ? "Loading..." : "Open Wallet"}
            </button>
          </form>
        </div>
      ) : (
        <div className="wallet-box">
          <div className="wallet-header">
            <h2>Wallet Dashboard</h2>
            <span>{email}</span>
          </div>

          <div className="wallet-list">
            {balances.map((coin, index) => (
              <div key={coin.key} className="wallet-item">
                <p>{coin.label}</p>

                {coin.editing ? (
                  <input
                    type="number"
                    placeholder={`Enter amount to ${coin.mode}`}
                    onChange={(e) =>
                      changeValue(index, Number(e.target.value))
                    }
                  />
                ) : (
                  <h3>{coin.value}</h3>
                )}

                <div className="action-buttons">
                  {coin.editing ? (
                    <button
                      className="edit-btn confirm"
                      disabled={loadingIndex === index}
                      onClick={() => confirmUpdate(index)}
                    >
                      {loadingIndex === index ? "Saving..." : "Confirm"}
                    </button>
                  ) : (
                    <>
                      <button
                        className="edit-btn credit"
                        onClick={() => startCredit(index)}
                      >
                        Credit
                      </button>
                      <button
                        className="edit-btn debit"
                        onClick={() => startDebit(index)}
                      >
                        Debit
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}