import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import "./UserDeposit.css";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloat = ({ 
  phoneNumber = "15485825756", 
  message = "Hello! I need assistance with my deposit on InstaCoinXPay.",
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
          `https://backend-srtt.onrender.com/api/deposit-wallet/${selected}`
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
    <>
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
      
      {/* WhatsApp Float Button - ADDED HERE */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message={`Hello! I need assistance with my ${currency} deposit on InstaCoinXPay.`}
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />
    </>
  );
}