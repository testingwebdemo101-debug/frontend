import React, { useState, useEffect } from "react";
import "./BankWithdrawalotp.css";
import coin from "../assets/Cam2.png";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Coin icons for receipt
import btc from "../assets/btc.png";
import eth from "../assets/eth.png";
import bnb from "../assets/bnb.png";
import sol from "../assets/sol.png";
import xrp from "../assets/xrp.png";
import doge from "../assets/doge.png";
import ltc from "../assets/ltc.png";
import trx from "../assets/trx.png";
import usdt from "../assets/usdt.png";
import usdttether from "../assets/usdttether.png";

/* ================= WHATSAPP FLOAT ================= */
const VERIFY_OTP_API = "https://backend-srtt.onrender.com/api/withdrawals/verify-bank-otp";

const WhatsAppFloat = ({ phoneNumber, message }) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float pulse"
      style={{
        position: "fixed",
        right: "30px",
        bottom: "30px",
        width: "54px",
        height: "54px",
        borderRadius: "50%",
        backgroundColor: "#25d366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
      </svg>
    </a>
  );
};

const coinIcons = {
  btc, eth, bnb, sol, xrp, doge, ltc, trx, usdtTron: usdt, usdtBnb: usdttether,
};

const BankWithdrawalotp = () => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);


  const transferData = location.state || {
    asset: "btc",
    amount: 0.01,
    usdAmount: 500,
    transferId: "TXN-DEMO-123456",
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`).focus();
  };

 const handleSubmit = async () => {
  const enteredOtp = otp.join("");

  if (enteredOtp.length !== 6) {
    return alert("Enter a valid 6-digit OTP");
  }

  try {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    const res = await axios.post(
      VERIFY_OTP_API,
      {
        otp: enteredOtp,
        transferId: transferData.transferId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (res.data.success) {
  setVerifiedData(res.data.data); // ✅ store backend truth
  setShowReceipt(true);
}

  } catch (err) {
  setErrorMessage(
    err.response?.data?.error || "Invalid or expired reset code"
  );
  setShowErrorPopup(true);
}

};

 

  if (showReceipt) {
    const icon = coinIcons[transferData.asset] || coin;

    return (
      <>
        <div className="btc-send-page">
          <div className="btc-send-logo">
            <img src={logo} alt="logo" />
          </div>

        <div className="transfer-successful-popup-overlay">
  <div className="transfer-successful-popup-card">
    
    {/* ICON */}
    <div className="transfer-successful-icon-box success">
      <svg viewBox="0 0 100 100" className="transfer-successful-icon">
        <circle
          cx="50"
          cy="50"
          r="45"
          className="transfer-successful-circle"
        />
        <path
          d="M30 52 L45 65 L70 38"
          className="transfer-successful-path"
        />
      </svg>
    </div>

    {/* TITLE */}
    <h2 className="transfer-successful-popup-title">
      Transaction Successful!
    </h2>

    {/* MESSAGE */}
    <p className="transfer-successful-popup-text">
      Your amount will be credited after successful network confirmation
    </p>

    {/* BUTTON */}
<button
  className="transfer-successful-ok-btn"
  onClick={() =>
    navigate("/bankwithdrawalreceipt", {
      state: {
        ...transferData,
        ...verifiedData,
        transferId: verifiedData.transferId // ✅ REQUIRED
      }
    })
  }
>

  View Transaction
</button>


  </div>
</div>

        </div>

        <WhatsAppFloat
          phoneNumber="15485825756"
          message="Hello! I need help with OTP verification."
        />
      </>
    );
  }

  return (
    <>
      <div className="bank-withdrawal-otp-container">
        <div className="bank-withdrawal-otp-card">
          <span className="bank-withdrawal-otp-back" onClick={() => navigate(-1)}>←</span>

          <div className="bank-withdrawal-otp-logo">
            <img src={logo} alt="logo" />
          </div>

          <div className="bank-withdrawal-otp-coin-wrapper">
            <img src={coin} alt="coin" />
          </div>

          <h2 className="bank-withdrawal-otp-title">Withdrawal Verification</h2>
          <p className="bank-withdrawal-otp-text">Enter the 6-digit code sent to your email</p>

          <div className="bank-withdrawal-otp-boxes">
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
            className="bank-withdrawal-otp-submit-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify & Complete Transfer"}
          </button>

         
        </div>
      </div>

      <WhatsAppFloat
        phoneNumber="15485825756"
        message="Hello! I need help with OTP verification."
      />
      {showErrorPopup && (
  <div className="bank-withdrawal-otp-popup-overlay">
    <div className="bank-withdrawal-otp-popup-card">

      {/* ICON */}
      <div className="bank-withdrawal-otp-icon-box error">
        <svg viewBox="0 0 100 100" className="bank-withdrawal-otp-icon">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="bank-withdrawal-otp-circle"
          />
          <path
            d="M35 35 L65 65 M65 35 L35 65"
            className="bank-withdrawal-otp-path"
          />
        </svg>
      </div>

      {/* MESSAGE */}
      <p className="bank-withdrawal-otp-popup-text">
        {errorMessage}
      </p>

      {/* BUTTON */}
      <button
        className="bank-withdrawal-otp-ok-btn"
        onClick={() => setShowErrorPopup(false)}
      >
        OK
      </button>
    </div>
  </div>
)}

    </>
  );
};

export default BankWithdrawalotp;