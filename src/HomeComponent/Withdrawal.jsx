import React from "react";
import { useNavigate } from "react-router-dom";
import "./Withdrawal.css";
import logo from "../assets/logo.png";
import bank from "../assets/bank.png";
import crypto from "../assets/crypto.png";
import paypal from "../assets/paypal.png";

const Withdrawal = () => {
  const navigate = useNavigate();

  return (
    <div className="withdrawal-page-container">
      <div className="withdrawal-content-card">
        <span className="withdrawal-back-arrow" onClick={() => navigate(-1)}>←</span> 

        <div className="withdrawal-logo-wrapper">
          <img src={logo} alt="InstaCoinXPay" />
        </div>

        <h2 className="withdrawal-heading">Withdrawal</h2>

        {/* CRYPTO → /sendbtc */}
        <button
          className="withdrawal-method-btn"
          onClick={() => navigate("/sendbtc")}
        >
          <img src={crypto} alt="Crypto" />
          <span>Crypto Withdrawal</span>
        </button>

        <button className="withdrawal-method-btn" 
        onClick={() => navigate("/bankwithdrawal")}
        >
          <img src={bank} alt="Bank" />
          <span>Bank Withdrawal</span>
        </button>

        <button className="withdrawal-method-btn"
        onClick={() => navigate("/paypalwithdrawal")}>
          <img src={paypal} alt="Paypal" />
          <span>Paypal Withdrawal</span>
        </button>

      </div>
    </div>
  );
};

export default Withdrawal;