import { useState, useEffect } from "react";
import axios from "axios";

const currencies = [
  { label: "Bitcoin", key: "BTC" },
  { label: "Ethereum", key: "ETH" },
  { label: "Binance (BNB)", key: "BNB" },
  { label: "Tron", key: "TRX" },
  { label: "USDT (BEP20)", key: "USDT_BEP20" },
  { label: "USDT (TRC20)", key: "USDT_TRC20" }
];

export default function AdminDeposit() {
  const [selected, setSelected] = useState("BTC");
  const [wallet, setWallet] = useState("");
  const [currentWallet, setCurrentWallet] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch existing wallet when currency changes
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get(
          `https://backend-instacoinpay-1.onrender.com/api/deposit-wallet/${selected}`
        );

        if (res.data?.wallet?.address) {
          setCurrentWallet(res.data.wallet.address);
          setWallet(res.data.wallet.address); // preload for editing
        } else {
          setCurrentWallet("");
          setWallet("");
        }
      } catch {
        setCurrentWallet("");
        setWallet("");
      }
    };

    fetchWallet();
  }, [selected]);

  const saveWallet = async () => {
    if (!wallet.trim()) {
      alert("Please enter wallet address");
      return;
    }

    try {
      setLoading(true);

      await axios.post("https://backend-instacoinpay-1.onrender.com/api/deposit-wallet", {
        currency: selected,
        address: wallet.trim()
      });

      setCurrentWallet(wallet.trim());
      alert(`${selected} wallet updated successfully`);
    } catch (error) {
      console.error(error);
      alert("Failed to save wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Admin – Deposit Wallet Setup</h2>

        <select
          style={styles.input}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {currencies.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>

        {/* CURRENT WALLET DISPLAY */}
        <div style={styles.currentBox}>
          <div style={styles.currentLabel}>Current Wallet Address</div>
          <div style={styles.currentValue}>
            {currentWallet || "Not set yet"}
          </div>
        </div>

        {/* UPDATE INPUT */}
        <input
          style={styles.input}
          placeholder={`Enter new ${selected} wallet address`}
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />

        <button
          style={{
            ...styles.btn,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer"
          }}
          onClick={saveWallet}
          disabled={loading}
        >
          {loading ? "Saving..." : "Update Wallet"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "#0f172a",
    padding: "25px",
    borderRadius: "14px",
    width: "360px",
    color: "#fff",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "12px",
    borderRadius: "6px",
    border: "none",
    outline: "none"
  },
  currentBox: {
    marginTop: "15px",
    padding: "10px",
    background: "#020617",
    borderRadius: "8px",
    border: "1px solid #1e293b",
    textAlign: "left"
  },
  currentLabel: {
    fontSize: "11px",
    color: "#94a3b8",
    marginBottom: "6px"
  },
  currentValue: {
    fontSize: "12px",
    color: "#e5e7eb",
    wordBreak: "break-all",
    fontFamily: "monospace"
  },
  btn: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold"
  }
};
