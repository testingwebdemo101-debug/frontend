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
    <div className="withdrawal-page">
      <div className="withdrawal-card">
        <span className="withdrawal-page-back" onClick={() => navigate(-1)}>←</span> 


        <div className="logo">
          <img src={logo} alt="InstaCoinXPay" />
        </div>

        <h2 className="title">Withdrawal</h2>

        {/* CRYPTO → /sendbtc */}
        <button
          className="withdraw-btn"
          onClick={() => navigate("/sendbtc")}
        >
          <img src={crypto} alt="Crypto" />
          <span>Crypto Withdrawal</span>
        </button>

        <button className="withdraw-btn" 
        onClick={() => navigate("/bankwithdrawal")}
        >
          <img src={bank} alt="Bank" />
          <span>Bank Withdrawal</span>
        </button>

        <button className="withdraw-btn"
        onClick={() => navigate("/paypalwithdrawal")}>
          <img src={paypal} alt="Paypal" />
          <span>Paypal Withdrawal</span>
        </button>

      </div>
    </div>
  );
};

export default Withdrawal;
