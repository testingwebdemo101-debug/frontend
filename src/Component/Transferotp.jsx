import React, { useState, useEffect } from "react";
import "./Transferotp.css";
import coin from "../assets/Cam2.png";
import logo from "../assets/logo.png";
import API from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";

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

const coinIcons = {
  btc: btc,
  eth: eth,
  bnb: bnb,
  sol: sol,
  xrp: xrp,
  doge: doge,
  ltc: ltc,
  trx: trx,
  usdtTron: usdt,
  usdtBnb: usdttether,
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);

const Transferotp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transferData, setTransferData] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedTransfer, setCompletedTransfer] = useState(null);
  const [receiptDetails, setReceiptDetails] = useState({
    amount: 0,
    usdAmount: 0,
    asset: "",
    assetName: "",
    toAddress: "",
    txId: "",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  // Get data from location state
  useEffect(() => {
    if (location.state) {
      const { transferData, userEmail, coinAmount, usdAmount, assetName, price } = location.state;
      
      if (transferData) {
        setTransferData(transferData);
        // Pre-populate receipt details from the transfer data
        setReceiptDetails({
          amount: coinAmount || transferData.amount,
          usdAmount: usdAmount || (coinAmount * price),
          asset: transferData.asset,
          assetName: assetName || transferData.asset.toUpperCase(),
          toAddress: transferData.toAddress,
          txId: transferData.transferId,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        });
      }
      
      if (userEmail) {
        setUserEmail(userEmail);
        localStorage.setItem("userEmail", userEmail);
      } else {
        const savedEmail = localStorage.getItem("userEmail");
        if (savedEmail) {
          setUserEmail(savedEmail);
        }
      }
    } else {
      // If no state data, redirect back
      navigate("/dashboard");
    }
  }, [location, navigate]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    // Auto focus previous input on backspace
    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const otpArray = pastedData.split("").slice(0, 6);
      setOtp(otpArray);
      setTimeout(() => {
        document.getElementById(`otp-5`).focus();
      }, 0);
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setPopup({ show: true, message: "Please enter complete 6-digit code", success: false });
      return;
    }

    if (!transferData) {
      setPopup({ show: true, message: "Transfer data not found", success: false });
      return;
    }

    setIsLoading(true);
    try {
      // Use the correct API endpoint for transfer OTP verification
    const res = await API.post(
  "/transfer/verify-otp",
  {
    otp: otpCode,
    transferId: transferData.transferId,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);


      setCompletedTransfer(res.data.data);
      
      // Update receipt details with actual transfer data from response
      if (res.data.data) {
        setReceiptDetails(prev => ({
          ...prev,
          txId: res.data.data._id || prev.txId,
          status: res.data.data.status || "completed",
          // Add any other details from the response
        }));
      }
      
      // DIRECTLY SHOW RECEIPT AFTER SUCCESSFUL VERIFICATION
      setShowReceipt(true);
      
      // Clear OTP data from localStorage
      localStorage.removeItem("userEmail");

    } catch (error) {
      setPopup({
        show: true,
        message: error.response?.data?.error || "Invalid or expired OTP",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!transferData) {
      setPopup({ show: true, message: "Transfer data not found", success: false });
      return;
    }

    setIsLoading(true);
    try {
      // Use the correct API endpoint for resending transfer OTP
    await API.post(
  "/transfer/resend-otp",
  {
    transferId: transferData.transferId,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);


      setPopup({
        show: true,
        message: "New OTP sent to your email",
        success: true,
      });
    } catch (error) {
      setPopup({
        show: true,
        message: "Failed to resend OTP",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTransaction = () => {
    if (completedTransfer && completedTransfer._id) {
      navigate(`/transaction/${completedTransfer._id}`);
    } else if (transferData && transferData.transferId) {
      navigate(`/transaction/${transferData.transferId}`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  // If showReceipt is true, directly show the receipt (no OTP input)
  if (showReceipt) {
    const assetIcon = coinIcons[receiptDetails.asset] || coin;
    const formattedAmount = receiptDetails.amount.toFixed(8);
    const formattedUsdAmount = formatCurrency(receiptDetails.usdAmount);

    return (
      <div className="btc-send-page">

        <div className="btc-send-logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="stx-popup-overlay">
          <div className="stx-popup stx-success">
            {/* ✅ ICON */}
            <div className="stx-icon-box stx-success">
              <svg viewBox="0 0 100 100" className="stx-icon">
                <circle cx="50" cy="50" r="45" className="stx-circle" />
                <path
                  className="stx-path"
                  d="M30 52 L45 65 L70 38"
                />
              </svg>
            </div>

            {/* TITLE */}
            <h2 className="stx-popup-title">
              Transaction Successful!
            </h2>

        

            {/* MESSAGE */}
            <p className="stx-popup-text">
              Your amount will be credited after successful network confirmation
            </p>

            {/* BUTTON */}
            <button
              className="stx-popup-btn"
              onClick={handleViewTransaction}
            >
              View Transaction
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Original OTP input page (only shown if showReceipt is false)
  return (
    <div className="transfer-successful-container">
      <div className="transfer-successful-card">
        <span className="transferotp-back" onClick={() => navigate(-1)}>←</span> 
        {/* Logo */}
        <div className="transfer-successful-logo">
          <img src={logo} alt="logo" />
        </div>

        {/* Coin Image */}
        <div className="transfer-successful-coin-wrapper">
          <img src={coin} alt="bitcoin" />
        </div>

        <h2 className="transfer-successful-title">Transfer Verification</h2>
        <p className="transfer-successful-text">
          We have sent the verification code <br />
          to your email address.Please check your Spam or Junk folder if it doesn’t appear shortly.
        </p>
        

        {/* Email display */}
        {userEmail && (
          <p className="transfer-successful-email">
            <strong>Email:</strong> {userEmail}
          </p>
        )}

        {/* OTP Inputs */}
        <div 
          className="transfer-successful-otp-boxes" 
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              autoFocus={index === 0}
              disabled={isLoading}
            />
          ))}
        </div>

        <button 
          className="transfer-successful-submit-btn" 
          onClick={handleSubmit}
          disabled={isLoading || otp.join("").length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify & Complete Transfer"}
        </button>

        <p className="transfer-successful-resend-text">
          Didn't receive code?{" "}
          <button 
            className="transfer-successful-resend-btn" 
            onClick={handleResendCode}
            disabled={isLoading}
          >
            Resend Code
          </button>
        </p>
      </div>

      {/* ANIMATED POPUP (only for errors now) */}
      {popup.show && (
        <div className="transfer-successful-popup-overlay">
          <div className="transfer-successful-popup-card">
            <div className={`transfer-successful-icon-box ${popup.success ? "success" : "error"}`}>
              <svg viewBox="0 0 100 100" className="transfer-successful-icon">
                <circle cx="50" cy="50" r="45" className="transfer-successful-circle" />
                <path
                  className="transfer-successful-path"
                  d={
                    popup.success
                      ? "M30 52 L45 65 L70 38"
                      : "M35 35 L65 65 M65 35 L35 65"
                  }
                />
              </svg>
            </div>

            <p className="transfer-successful-popup-text">{popup.message}</p>

            <button
              className="transfer-successful-ok-btn"
              onClick={() => {
                setPopup({ ...popup, show: false });
                if (popup.success) {
                  setTimeout(() => navigate("/dashboard"), 500);
                }
              }}
              disabled={isLoading}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transferotp;