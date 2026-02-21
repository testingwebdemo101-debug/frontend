import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./HistoryTransactionReceipt.css";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({
  phoneNumber = "15485825756",
  message = "Hello! I need assistance with my transaction receipt on InstaCoinXPay.",
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

  const whatsappUrl =
    `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

  const positionStyles =
    position === "left"
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
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
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
    >

      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>

    </a>

  );

};

/* ================= HELPER FUNCTIONS ================= */

// ✅ NEW: Function to format coin display with hyphens for USDT variants
const formatCoinDisplay = (asset) => {
  if (!asset) return "";
  
  const assetLower = asset.toLowerCase();
  
  if (assetLower === "usdttron") return "USDT-TRON";
  if (assetLower === "usdtbnb") return "USDT-BNB";
  
  // For other assets, return uppercase
  return asset.toUpperCase();
};

const getNetwork = (asset = "") => {
  const assetLower = asset.toLowerCase();
  
  const networkMap = {
    btc: "BTC",
    eth: "ERC20",
    usdttron: "TRC20",
    trx: "TRON",
    sol: "SOL",
    xrp: "XRP",
    bnb: "BEP20",
    usdtbnb: "BEP20",
    doge: "DOGE",
    ltc: "LTC",
  };
  
  return networkMap[assetLower] || "Unknown";
};

/* ================= MAIN COMPONENT ================= */

const HistoryTransactionReceipt = () => {

  const navigate = useNavigate();

  const { id } = useParams();

  const [tx, setTx] = useState(null);

  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState("");

  const copy = (text, type) => {

    if (!text) return;

    navigator.clipboard.writeText(text);

    setCopied(type);

    setTimeout(() => setCopied(""), 1200);

  };

  useEffect(() => {

    const fetchTx = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) return navigate("/login");

        const res = await axios.get(

          `https://backend-srtt.onrender.com/api/transfer/${id}`,

          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

        );

        const data = res.data.data;
        data.status = (data.status || "pending").toLowerCase();
        
        // ✅ Add confirmations from response
        data.confirmations = data.confirmations || [false, false, false, false];

        setTx(data);

      } catch {

        setTx(null);

      } finally {

        setLoading(false);

      }

    };

    fetchTx();

  }, [id, navigate]);

  if (loading)

    return (

      <div className="history-transaction-receipt-page">

        Loading...

      </div>

    );

  if (!tx)

    return (

      <div className="history-transaction-receipt-page">

        Transaction not found

      </div>

    );

  const amount = Number(tx.amount ?? 0);
  
  // ✅ Use the new formatter for coin display
  const coin = formatCoinDisplay(tx.asset);
  
  const fee = tx.networkFee ?? 0;
  
  // ✅ Confirmations data
  const confirmations = tx.confirmations || [false, false, false, false];
  const confirmedCount = confirmations.filter(Boolean).length;

  const formattedDate =

    tx.completedAt || tx.createdAt

      ? new Date(

        tx.completedAt || tx.createdAt

      ).toLocaleDateString("en-US", {

        day: "2-digit",

        month: "short",

        year: "numeric"

      })

      : "--";

  return (

    <>

      <div className="history-transaction-receipt-page">

        <div className="receipt-card">

          <h2 className="receipt-title">

            Transaction Receipt

          </h2>

          <div className="receipt-amount">

            {amount} {coin}

          </div>

          {/* STATUS */}

          <div className={`status-wrapper ${tx.status}`}>

            {["pending", "pending_otp", "processing"].includes(tx.status) &&

              <div className="loader" />

            }

            {tx.status === "completed" &&

              <div className="status-icon success">

                ✔

              </div>

            }

            {tx.status === "failed" &&

              <div className="status-icon failed">

                ✖

              </div>

            }

            <div className="status-text">

              {

                tx.status === "completed"

                  ? "Successful"

                  : tx.status === "failed"

                    ? "Failed"

                    : "Pending"

              }

            </div>

          </div>

          {/* STATUS MESSAGE */}

          <div className="receipt-info">

            {

              tx.status === "completed" &&

              "Your crypto transfer has been completed successfully."

            }

            {

              tx.status === "pending" &&

              "Your transaction is pending confirmation."

            }

            {

              tx.status === "failed" &&

              "Your transaction failed. Please activate your card or contact support."

            }

          </div>

          <div className="receipt-divider" />

          {/* ✅ CONFIRMATIONS SECTION - ONLY SHOW FOR PENDING TRANSACTIONS */}
          {["pending", "pending_otp", "processing"].includes(tx.status) && (
            <div className="receipt-row confirmations-row">
              <span>Confirmations</span>
              <div className="confirmations-visual">
                <div className="confirmation-dots">
                  {confirmations.map((confirmed, index) => (
                    <div
                      key={index}
                      className={`confirmation-dot ${confirmed ? "confirmed" : "pending"}`}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
                <small className="confirmations-count">
                  {confirmedCount} / {confirmations.length} confirmations completed
                </small>
              </div>
            </div>
          )}

          <div className="receipt-row">

            Network

            <strong>

              {getNetwork(tx.asset)}

            </strong>

          </div>

          <div className="receipt-row">

            Recipient Address

            <strong>

              {tx.toAddress}

              <button onClick={() => copy(tx.toAddress, "address")}>

                📋

              </button>

            </strong>

          </div>

          <div className="receipt-row">

            TxID

            <strong>

              {tx.transactionId}

              <button onClick={() => copy(tx.transactionId, "txid")}>

                📋

              </button>

            </strong>

          </div>

          <div className="receipt-row">

            Amount

            <strong>

              {amount} {coin}

            </strong>

          </div>

          <div className="receipt-row">

            Network Fee

            <strong>

              {fee} {coin}

            </strong>

          </div>

          <div className="receipt-row">

            Date

            <strong>

              {formattedDate}

            </strong>

          </div>

          <button

            className="receipt-back-btn"

            onClick={() => navigate("/dashboard")}

          >

            Dashboard

          </button>

        </div>

      </div>

      <WhatsAppFloat

        phoneNumber="15485825756"

        message={`Hello support, I need help with my ${coin} transaction (${id})`}

      />

    </>

  );

};

export default HistoryTransactionReceipt;