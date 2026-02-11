import React, { useState } from "react";
import "./PaypalWithdrawalOtp.css";
import coin from "../assets/Cam2.png";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

const PaypalOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ NEW STATES (UI ONLY)
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://backend-srtt.onrender.com/api/paypal/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ otp: enteredOtp }),
        }
      );

      const data = await res.json();
      setIsLoading(false);

      // ❌ WRONG OTP
      if (!data.success) {
        setIsSuccess(false);
        setShowResultPopup(true);

        setTimeout(() => {
          setShowResultPopup(false);
        }, 2000);

        return;
      }

      // ✅ CORRECT OTP
      setIsSuccess(true);
      setShowResultPopup(true);

      setTimeout(() => {
        setShowResultPopup(false);

        const payload = {
  transferId: data.data.transferId, // ✅ REQUIRED
  asset: data.data.asset,
  amount: data.data.amount,
  usdAmount: data.data.usdAmount,
  paypalEmail: data.data.paypalEmail,
  transactionId: data.data.transactionId,
  status: data.data.status,
};

sessionStorage.setItem(
  "paypalReceipt",
  JSON.stringify(payload)
);

navigate("/paypalreceipt", { state: payload });

      }, 2200);
    } catch (err) {
      setIsLoading(false);
      setIsSuccess(false);
      setShowResultPopup(true);

      setTimeout(() => {
        setShowResultPopup(false);
      }, 2000);
    }
  };

  return (
    <>
      <div className="paypal-otp-wrapper">
        <div className="paypal-otp-box">
          <span className="paypal-otp-back-btn" onClick={() => navigate(-1)}>
            ←
          </span>

          <div className="paypal-otp-header-logo">
            <img src={logo} alt="logo" />
          </div>

          <div className="paypal-otp-coin-animation">
            <img src={coin} alt="coin" />
          </div>

          <h2 className="paypal-otp-heading">Withdrawal Verification</h2>
          <p className="paypal-otp-subtitle">
            Enter the 6-digit code sent to your email
          </p>

          <div className="paypal-otp-inputs-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
              />
            ))}
          </div>

          <button
            className="paypal-otp-confirm-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify & Complete Transfer"}
          </button>
        </div>
      </div>

      {/* ================= RESULT POPUP ================= */}
      {showResultPopup && (
        <div className="otp-result-overlay">
          <div className="otp-result-card">
            {isSuccess ? (
              <>
                <svg className="success-svg" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="25" />
                  <path d="M14 27 l7 7 l17 -17" />
                </svg>
                <p>OTP Verified Successfully</p>
              </>
            ) : (
              <>
                <svg className="error-svg" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="25" />
                  <path d="M16 16 L36 36 M36 16 L16 36" />
                </svg>
                <p>Invalid OTP</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PaypalOtp;
