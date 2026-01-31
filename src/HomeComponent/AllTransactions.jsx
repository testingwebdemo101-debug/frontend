import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AllTransactions.css";
import { getCoinIcon } from "../utils/coinIcons";

/* ================= HELPERS ================= */
const normalizeStatus = (tx) => {
  const status = tx.status?.toLowerCase();

  if (status === "completed") return "Successful";
  if (status === "failed") return "Failed";
  if (status === "pending" || status === "pending_otp") return "Pending";

  return "Pending";
};



const formatAmount = (amount) => {
  if (typeof amount === "number") {
    return amount.toFixed(8);
  }
  return amount || "0";
};

/* ================= COMPONENT ================= */
const AllTransactions = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  const fetchGroupedTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        "https://backend-instacoinpay-1.onrender.com/api/history/grouped/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const normalized = (res.data?.data || []).map((group) => ({
        date: group.date,
        items: (group.items || []).map((tx, index) => ({
          id: tx.id || `${group.date}-${index}`,
          type: tx.type || "Unknown",
          coin: tx.coin || "N/A",
          to: tx.to || "—",
          amount: formatAmount(tx.amount),
          sub: tx.sub || "",
          status: normalizeStatus(tx, index, group.date),
          date: group.date,
        })),
      }));

      setTransactions(normalized);
    } catch (err) {
      console.error(err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedTransactions();
  }, []);

  /* ================= UI ================= */
  return (
    <div className="tx-wrapper-unique">
      <div className="tx-card-unique">

        {/* HEADER */}
        <div className="tx-header-unique">
          <span className="tx-back-unique" onClick={() => navigate(-1)}>←</span>
          <h2>All Transactions</h2>
        </div>

        {/* STATES */}
        {loading && <p className="tx-loading-unique">Loading...</p>}
        {error && <p className="tx-error-unique">{error}</p>}

        {!loading && !error && transactions.length === 0 && (
          <p className="tx-empty-unique">No transactions found</p>
        )}

        {/* TRANSACTIONS */}
        {transactions.map((group, i) => (
          <div key={i}>
            <p className="tx-date-unique">{group.date}</p>

            {group.items.map((tx) => (
              <div
                key={tx.id}
                className="tx-row-unique clickable"
                onClick={() =>
                  navigate(`/transaction/${tx.id}`, { state: tx })
                }
              >
                {/* LEFT */}
                <div className="tx-left-unique">
                  <div className={`tx-icon-unique ${tx.type.toLowerCase()}`}>
                    <img
                      src={getCoinIcon(tx.coin, tx.sub)}
                      alt={tx.coin}
                      className="tx-coin-img-unique"
                    />
                  </div>

                  <div>
                    <strong
                      className={`tx-type-unique ${tx.type.toLowerCase() === "send" || tx.type.toLowerCase() === "sent"
                          ? "sent"
                          : tx.type.toLowerCase() === "receive" || tx.type.toLowerCase() === "received"
                            ? "received"
                            : "pending"
                        }`}
                    >
                      {tx.type}
                    </strong>

                    <span>To: {tx.to}</span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="tx-right-unique">
                  <span
                    className={`tx-amount-unique ${tx.status.toLowerCase() === "pending"
                        ? "pending"
                        : tx.status.toLowerCase() === "successful"
                          ? "received"
                          : "failed"
                      }`}
                  >
                    {tx.amount}
                  </span>

                  {tx.sub && <small>{tx.sub}</small>}

                  <small className={`tx-status-unique ${tx.status.toLowerCase()}`}>
                    {tx.status}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
};

export default AllTransactions;