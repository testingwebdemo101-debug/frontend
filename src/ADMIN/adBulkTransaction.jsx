import { useEffect, useState } from "react";
import axios from "axios";
import "./AdBulkTransaction.css";

const COINS = [
  "BTC",
  "ETH",
  "BNB",
  "SOL",
  "XRP",
  "DOGE",
  "LTC",
  "TRX",
  "USDT-BNB",
  "USDT-TRON",
];

const API = "https://backend-srtt.onrender.com/api";

export default function AdBulkTransaction() {
  const [type, setType] = useState("CREDIT");
  const [coin, setCoin] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [group, setGroup] = useState("ALL");
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const token = localStorage.getItem("token");

  /* ===============================
     LOAD GROUP LIST
  =============================== */
  const loadGroups = async () => {
    try {
      const res = await axios.get(`${API}/bulk-groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data.groups);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     LOAD USERS PER GROUP
  =============================== */
  const loadUsers = async (selectedGroup) => {
    if (selectedGroup === "ALL") {
      setUsers([]);
      return;
    }

    try {
      const res = await axios.get(
        `${API}/bulk-group/${selectedGroup}/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===============================
     INITIAL LOAD
  =============================== */
  useEffect(() => {
    loadGroups();
  }, [token]);

  useEffect(() => {
    loadUsers(group);
  }, [group]);

  /* ===============================
     🔥 AUTO REFRESH WHEN PAGE FOCUSED
  =============================== */
  useEffect(() => {
    const handleFocus = () => {
      loadGroups();
      loadUsers(group);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [group]);

  /* ===============================
     SUBMIT BULK TRANSACTION
  =============================== */
  const handleSubmit = async () => {
    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        `${API}/bulk-transaction`,
        {
          type,
          coin,
          amount: Number(amount),
          group,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResult(res.data);
      setAmount("");

      await loadGroups();
      await loadUsers(group);

    } catch (err) {
      alert(err.response?.data?.error || "Bulk transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bulk-page">
      <div className="bulk-card">
        <h1 className="bulk-title">Bulk Credit / Debit</h1>

        <div className="bulk-group">
          <label>Select Group</label>
          <select value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="ALL">ALL USERS</option>
            {groups.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {group !== "ALL" && (
          <div className="bulk-users">
            <h3>
              Users in Group {group} ({users.length})
            </h3>
            <div className="bulk-user-list">
              {users.map((u) => (
                <div key={u._id} className="bulk-user">
                  <span className="name">{u.fullName || "User"}</span>
                  <span className="email">{u.email}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bulk-toggle">
          <button
            className={type === "CREDIT" ? "active" : ""}
            onClick={() => setType("CREDIT")}
          >
            Credit
          </button>
          <button
            className={type === "DEBIT" ? "active" : ""}
            onClick={() => setType("DEBIT")}
          >
            Debit
          </button>
        </div>

        <select value={coin} onChange={(e) => setCoin(e.target.value)}>
          {COINS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="number"
          value={amount}
          placeholder="Enter amount"
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          className="bulk-action-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Execute Bulk"}
        </button>

        {result && (
          <div className="bulk-result">
            <p><b>Group:</b> {result.group}</p>
            <p><b>Processed Users:</b> {result.processedUsers}</p>
            <p><b>Success:</b> {result.success}</p>
            <p><b>Failed:</b> {result.failed}</p>
          </div>
        )}
      </div>
    </div>
  );
}
