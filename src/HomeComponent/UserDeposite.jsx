import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./UserDeposit.css";

export default function UserDeposit() {
  const [wallet, setWallet] = useState("");
  const [currency, setCurrency] = useState("");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const selected = localStorage.getItem("SELECTED_CURRENCY");

    if (!selected) {
      window.location.href = "/select-deposit-currency";
      return;
    }

    setCurrency(selected);

    const fetchWallet = async () => {
      try {
        const res = await axios.get(
          `https://backend-instacoinpay-1.onrender.com/api/deposit-wallet/${selected}`
        );
        setWallet(res.data.wallet.address);
      } catch {
        setWallet("");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const copyAddress = () => {
    if (!wallet) return;
    navigator.clipboard.writeText(wallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    setShowPopup(true);
  };

  return (
    <div className="page">
      <div className="card">
        <span onClick={() => navigate(-1)} className="backBtn">←</span>

        <h2 className="heading">{currency} Deposit</h2>

        {loading && <p>Loading wallet...</p>}

        {!loading && !wallet && (
          <p style={{ color: "red", marginTop: "10px" }}>
            Deposit wallet not available. Contact support.
          </p>
        )}

        <div
          className="timerBox"
          style={{
            background:
              timeLeft <= 60
                ? "#fee2e2"
                : timeLeft <= 300
                ? "#fef3c7"
                : "#dbeafe",
          }}
        >
          <div className="timerLabel">Pay Within</div>
          <div
            className="timerValue"
            style={{
              color:
                timeLeft <= 60
                  ? "#dc2626"
                  : timeLeft <= 300
                  ? "#d97706"
                  : "#2563eb",
            }}
          >
            {timeLeft > 0 ? formatTime(timeLeft) : "EXPIRED"}
          </div>
          {timeLeft <= 0 && (
            <div className="expiredText">Please refresh and try again</div>
          )}
        </div>

        {!loading && wallet && (
          <>
            <div className="qrContainer">
              <QRCodeCanvas value={wallet} size={100} />
            </div>

            <p style={{ marginTop: "15px", color: "#64748b", fontSize: "14px" }}>
              <b>Network:</b> {currency}
            </p>

            <div className="addressBox">{wallet}</div>

            <button
              className="copyBtn"
              style={{
                opacity: timeLeft <= 0 ? 0.5 : 1,
                cursor: timeLeft <= 0 ? "not-allowed" : "pointer",
                background: copied ? "#10b981" : "#2563eb",
              }}
              onClick={copyAddress}
              disabled={timeLeft <= 0}
            >
              {copied ? "Copied ✓" : "Copy Address"}
            </button>

            <button
              className="copyBtn"
              style={{
                opacity: timeLeft <= 0 ? 0.5 : 1,
                cursor: timeLeft <= 0 ? "not-allowed" : "pointer",
              }}
              onClick={handleConfirmPayment}
              disabled={timeLeft <= 0}
            >
              Confirm Payment
            </button>
          </>
        )}

        {showPopup && (
          <div className="popupOverlay">
            <div className="popupCard">
              <div style={{ marginBottom: "15px" }}>
                {/* SVG unchanged */}
              </div>

              <h3 className="popupTitle">Payment in Review</h3>

              <p className="popupText">
                Your payment is under pending review.
                <br /><br />
                Send a Payment Screenshot to our WhatsApp Chat Support or Email:
                <br />
                <b>instacoinxpay@gmail.com</b>
                <br />
                <b>contact@instacoinxpay.com</b>
              </p>

              <button onClick={() => setShowPopup(false)} className="popupBtn">
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}