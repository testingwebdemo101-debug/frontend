import React, { useState, useEffect } from "react";
import "./ForgetVerificationCode.css";
import coin from "../assets/Cam2.png";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const ForgotVerificationCode = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    success: false,
  });

  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  /* =========================
     GET EMAIL & START TIMER
  ========================= */
  useEffect(() => {
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem("resetEmail");

    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem("resetEmail", stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }

    startCountdown();
  }, [location]);

  const startCountdown = () => {
    setCountdown(30);
    setCanResend(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /* =========================
     OTP INPUT HANDLERS
  ========================= */
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtp(pasted.split(""));
    }
  };

  /* =========================
     VERIFY OTP
  ========================= */
  const handleSubmit = async () => {
    const resetCode = otp.join("");

    if (resetCode.length !== 6) {
      return setPopup({
        show: true,
        message: "Please enter complete 6-digit code",
        success: false,
      });
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        `https://backend-instacoinpay-1.onrender.com/api/auth/verify-reset-code`,
        { email, resetCode }
      );

      if (res.data.success) {
        setPopup({
          show: true,
          message: "OTP verified successfully",
          success: true,
        });

        localStorage.setItem("verifiedResetCode", resetCode);

        setTimeout(() => {
          navigate("/newpassword", {
            state: { email, resetCode },
          });
        }, 1500);
      }
    } catch (err) {
      setPopup({
        show: true,
        message: err.response?.data?.error || "Invalid or expired OTP",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     RESEND OTP (FIXED)
  ========================= */
  const handleResendCode = async () => {
    if (!canResend || !email) return;

    setIsLoading(true);

    try {
      const res = await axios.post(
        `https://backend-instacoinpay-1.onrender.com/api/auth/resend-forgot-password-otp`,
        { email }
      );

      if (res.data.success) {
        setPopup({
          show: true,
          message: "New reset code sent to your email",
          success: true,
        });

        setOtp(["", "", "", "", "", ""]);
        startCountdown();
      }
    } catch (err) {
      setPopup({
        show: true,
        message: err.response?.data?.error || "Failed to resend code",
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="forgot-verification-container">
      <div className="forgot-verification-card">
        <span className="getstarted-back" onClick={() => navigate(-1)}>←</span>
        <div className="forgot-verification-logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="forgot-verification-coin-wrapper">
          <img src={coin} alt="coin" />
        </div>

        <h2 className="forgot-verification-title">Verification Code</h2>
        <p className="forgot-verification-text">
          We have sent a verification code to your email.Please check your Spam or Junk folder if it doesn’t appear shortly.
        </p>

        {email && <p className="forgot-verification-email"><strong>{email}</strong></p>}

        <div className="forgot-verification-otp-boxes" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={isLoading}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          className="forgot-verification-submit-btn"
          onClick={handleSubmit}
          disabled={otp.join("").length !== 6 || isLoading}
        >
          {isLoading ? "Verifying..." : "Submit"}
        </button>

        <p className="forgot-verification-resend-text">
          Didn't receive code?{" "}
          {canResend ? (
            <button className="forgot-verification-resend-btn" onClick={handleResendCode}>
              Resend Code
            </button>
          ) : (
            <span className="countdown-text">
              Resend in {countdown}s
            </span>
          )}
        </p>
      </div>

      {/* POPUP - Note: Still using ca-popup classes from CreateAccount */}
      {popup.show && (
        <div className="forgot-verification-popup-overlay">
          <div className="forgot-verification-popup-card">
            <div className={`forgot-verification-icon-box ${popup.success ? "success" : "error"}`}>
              <svg viewBox="0 0 100 100" className="forgot-verification-icon">
                <circle cx="50" cy="50" r="45" className="forgot-verification-circle" />
                <path
                  className="forgot-verification-path"
                  d={
                    popup.success
                      ? "M30 52 L45 65 L70 38"
                      : "M35 35 L65 65 M65 35 L35 65"
                  }
                />
              </svg>
            </div>
            <p className="forgot-verification-popup-text">{popup.message}</p>
            <button
              className="forgot-verification-ok-btn"
              onClick={() => setPopup({ ...popup, show: false })}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotVerificationCode;