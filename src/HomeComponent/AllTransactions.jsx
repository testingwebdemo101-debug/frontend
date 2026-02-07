import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AllTransactions.css";
import { getCoinIcon } from "../utils/coinIcons";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({ 
  phoneNumber = "15485825756", 
  message = "Hello! I need assistance with my transaction history on InstaCoinXPay.",
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
        "https://backend-srtt.onrender.com/api/history/grouped/all",
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
    <>
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
      
      {/* WhatsApp Float Button - ADDED HERE */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message="Hello! I need assistance with my transaction history on InstaCoinXPay."
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />
    </>
  );
};

export default AllTransactions;