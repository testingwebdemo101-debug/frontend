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
  style = {},
}) => {
  const formattedNumber = phoneNumber.replace(/[^\d]/g, "");
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(
    message
  )}`;

  const positionStyles =
    position === "left"
      ? { left: left || "20px", right: "auto" }
      : { right: right || "20px", left: "auto" };

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`whatsapp-float ${pulseEffect ? "pulse" : ""} ${className}`}
      style={{
        position: "fixed",
        bottom,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#25d366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        zIndex: 10000,
        cursor: "pointer",
        textDecoration: "none",
        ...positionStyles,
        ...style,
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967..." />
      </svg>
    </a>
  );
};

/* ================= HELPERS ================= */
const normalizeStatus = (tx) => {
  const status = tx.status?.toLowerCase();
  if (status === "completed") return "Successful";
  if (status === "failed") return "Failed";
  return "Pending";
};

/* ================= COMPONENT ================= */
const AllTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroupedTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await axios.get(
        "https://backend-srtt.onrender.com/api/history/grouped/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const normalized = (res.data?.data || []).map((group) => ({
        date: group.date,
        items: (group.items || []).map((tx, index) => ({
          id: tx.id || `${group.date}-${index}`,
          type: tx.type || "Unknown",
          coin: tx.coin || "N/A",
          to: tx.to || "—",
          fullAddress: tx.fullAddress,
          amount: tx.amount,
          sub: tx.sub || "",
          status: normalizeStatus(tx),
          confirmations: tx.confirmations || null,
        })),
      }));

      setTransactions(normalized);
    } catch (err) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedTransactions();
  }, []);

  return (
    <>
      <div className="tx-wrapper-unique">
        <div className="tx-card-unique">
          <div className="tx-header-unique">
            <span className="tx-back-unique" onClick={() => navigate(-1)}>
              ←
            </span>
            <h2>All Transactions</h2>
          </div>

          {loading && <p className="tx-loading-unique">Loading...</p>}
          {error && <p className="tx-error-unique">{error}</p>}

          {transactions.map((group, i) => (
            <div key={i}>
              <p className="tx-date-unique">{group.date}</p>

              {group.items.map((tx) => {
                const isBankWithdrawal =
                  tx.fullAddress === "BANK_WITHDRAWAL";

                // ✅ FIXED PAYPAL DETECTION
                const isPaypalWithdrawal =
                  tx.type === "PAYPAL_WITHDRAWAL" ||
                  tx.to === "PayPal" ||
                  tx.fullAddress === "PayPal";

                return (
                  <div
                    key={tx.id}
                    className="tx-row-unique clickable"
                    onClick={() => {
                      // BANK
                      if (isBankWithdrawal) {
                        navigate("/bankwithdrawalreceipt", {
                          state: { transferId: tx.id },
                        });
                        return;
                      }

                      // PAYPAL (DIRECT RECEIPT)
                    if (isPaypalWithdrawal) {
  const payload = {
    transferId: tx.id,
    transactionId: tx.id,

    // ✅ REQUIRED FOR FIRST RENDER (CRITICAL)
    asset: tx.coin?.toLowerCase() || "btc",
    amount: Number(tx.sub?.split(" ")[0]) || 0,
    usdAmount: Number(
      String(tx.amount).replace("$", "")
    ) || 0,
    paypalEmail: tx.to || "—",

    confirmations: tx.confirmations || [
      false,
      false,
      false,
      false,
    ],
  };

  sessionStorage.setItem(
    "paypalReceipt",
    JSON.stringify(payload)
  );

  navigate("/paypalwithdrawalreceipt", {
    state: payload,
  });
  return;
}


                      // DEFAULT
                      navigate(`/transaction/${tx.id}`, { state: tx });
                    }}
                  >
                    <div className="tx-left-unique">
                      <div
                        className={`tx-icon-unique ${tx.type.toLowerCase()}`}
                      >
                        <img
                          src={getCoinIcon(tx.coin, tx.sub)}
                          alt={tx.coin}
                          className="tx-coin-img-unique"
                        />
                      </div>
                      <div>
                        <strong>{tx.type}</strong>
                        <span>To: {tx.to}</span>
                      </div>
                    </div>

                    <div className="tx-right-unique">
                      <span
                        className={`tx-amount-unique ${tx.status.toLowerCase()}`}
                      >
                        {tx.amount}
                      </span>

                      {tx.sub && <small>{tx.sub}</small>}

                   <small
  className={`tx-status-unique ${tx.status.toLowerCase()}`}
>
  {isPaypalWithdrawal
    ? tx.status === "Successful" || tx.status === "completed"
      ? "Successful"
      : tx.status === "Failed" || tx.status === "failed"
      ? "Failed"
      : "Pending"
    : tx.status}
</small>

                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <WhatsAppFloat />
    </>
  );
};

export default AllTransactions;
