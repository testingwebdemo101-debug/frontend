import { useState } from "react";
import axios from "axios";
import Card from "../assets/cards-dashboard/Card.jsx";

const API = "https://backend-srtt.onrender.com/api/debit-card";

export default function AdCardActivation() {
  const [email, setEmail] = useState("");
  const [cardId, setCardId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [card, setCard] = useState({
    cardType: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    status: "PENDING",
  });

  /* =========================
     FETCH CARD BY EMAIL
  ========================= */
  const submitEmail = async () => {
  const trimmedEmail = email.trim(); // ← Trim whitespace
  if (!trimmedEmail) return alert("Enter email");

  try {
    console.log("Fetching card for email:", trimmedEmail); // ← Debug log

    const res = await axios.get(
      `${API}/by-email/${trimmedEmail}`,
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    console.log("API Response:", res.data); // ← Debug log

    if (!res.data.success) {
      alert("No card application found");
      return;
    }

    const data = res.data.data;

    console.log("Card Data:", data); // ← Debug log

    setCardId(data._id);
    setCard({
      cardType: data.cardType || "",
      cardNumber: data.cardNumber || "",
      expiry: data.expiry || "",
      cvv: data.cvv || "",
      status: data.status || "INACTIVE",
      fullName: data.fullName || "",
    });

    setSubmitted(true);
  } catch (err) {
    console.error("Error Details:", err); // ← Debug log
    console.error("Error Response:", err.response?.data); // ← Debug log
    console.error("Error Status:", err.response?.status); // ← Debug log
    alert("No card application found");
  }
};


  /* =========================
   INPUT FORMATTERS
========================= */

  
 // Card Number: 1234123412341234 -> 1234 1234 1234 1234
const formatCardNumber = (value) => {
  return value
    .replace(/\D/g, "")        // remove non-digits
    .slice(0, 16)              // ✅ allow 16 digits
    .replace(/(.{4})/g, "$1 ")
    .trim();
};




  // CVV: only 3 digits
  const formatCVV = (value) => {
    return value.replace(/\D/g, "").slice(0, 3);
  };

  // Expiry Date: 02 -> 02/30
  const formatExpiry = (value) => {
    value = value.replace(/\D/g, ""); // only digits

    if (value.length >= 3) {
      return value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    return value;
  };

  // =========================
  // CARD TYPE NORMALIZER
  // =========================
  const mapCardType = (value) => {
    if (!value) return "classic";

    const v = value.toLowerCase();

    if (v.includes("merchant")) return "merchant";
    if (v.includes("classic")) return "classic";
    if (v.includes("prime")) return "prime";
    if (v.includes("platinum")) return "platinum";
    if (v.includes("elite")) return "elite";

    return "classic";
  };


  /* =========================
     UPDATE CARD
  ========================= */
  const updateCard = async () => {
    try {
      await axios.put(`${API}/update/${cardId}`, card);
      alert("Card updated successfully");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="activation-container">
      <div className="activation-card">
        <h1 className="title">Card Activation Portal</h1>

        <div className="email-section">
          <label className="label">Enter Email Address</label>
          <div className="input-group">
            <input
              className="email-input"
              type="email"
              placeholder="customer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="fetch-btn" onClick={submitEmail}>
              <span className="btn-text">Submit Application</span>
              <span className="btn-icon">→</span>
            </button>
          </div>
        </div>

        {submitted && (
          <div className="card-details-section">
            <h2 className="section-title">Card Details</h2>



            <div className="form-group">
              <label className="label">Select Card Type</label>
              <select
                className="card-select"
                value={card.cardType}
                onChange={(e) =>
                  setCard({ ...card, cardType: e.target.value })
                }
              >
                <option value="">Select Card Type</option>
                <option value="Merchant Visa Card">Merchant Visa Card</option>
                <option value="Classic Visa Card">Classic Visa Card</option>
                <option value="Prime Visa Card">Prime Visa Card</option>
                <option value="Platinum Visa Card">Platinum Visa Card</option>
                <option value="World Elite Visa Card">World Elite Visa Card</option>
              </select>
            </div>

            <div className="card-info-grid">
              <div className="form-group">
                <label className="label">Card Number</label>
                <input
                  className="card-input"
                  placeholder="1234 1234 1234"
                  value={card.cardNumber}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      cardNumber: formatCardNumber(e.target.value),
                    })
                  }
                />

              </div>

              <div className="form-group">
                <label className="label">Expiry Date</label>
                <input
                  className="card-input"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      expiry: formatExpiry(e.target.value),
                    })
                  }
                />

              </div>

              <div className="form-group">
                <label className="label">CVV</label>
                <input
                  className="card-input"
                  placeholder="***"
                  type="password"
                  inputMode="numeric"
                  maxLength={3}
                  value={card.cvv}
                  onChange={(e) =>
                    setCard({
                      ...card,
                      cvv: formatCVV(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="status-section">
              <div className="status-header">
                <span className="status-label">Current Status:</span>
                <span className={`status-badge status-${card.status.toLowerCase()}`}>
                  {card.status}
                </span>
              </div>

              <div className="status-controls">
  <button
    className={`status-btn ${card.status === "ACTIVATE" ? "active" : ""}`}
    onClick={() => setCard({ ...card, status: "ACTIVATE" })}

  >
    Activate
  </button>

  <button
    className={`status-btn ${card.status === "PENDING" ? "active" : ""}`}
    onClick={() => setCard({ ...card, status: "PENDING" })}
  >
    Pending
  </button>

  <button
    className={`status-btn ${card.status === "INACTIVE" ? "active" : ""}`}
    onClick={() => setCard({ ...card, status: "INACTIVE" })}
  >
    Inactive
  </button>
</div>

            </div>

            <div className="action-buttons">
              <button className="save-btn" onClick={updateCard}>
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add styles to document head */}
      <style jsx="true">{`
        .activation-container {
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          overflow-x: hidden;
        }

        .activation-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(10px);
          margin: 16px 0;
        }

        .title {
          color: #2d3748;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.3;
        }

        .email-section {
          margin-bottom: 24px;
        }

        .label {
          display: block;
          color: #4a5568;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .email-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
          color: #2d3748;
          background: #f8fafc;
          box-sizing: border-box;
        }

        .email-input:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .email-input::placeholder {
          color: #a0aec0;
        }

        .fetch-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .fetch-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .fetch-btn:active {
          transform: translateY(0);
        }

        .btn-icon {
          font-size: 20px;
          transition: transform 0.3s ease;
        }

        .fetch-btn:hover .btn-icon {
          transform: translateX(4px);
        }

        .card-details-section {
          animation: slideIn 0.5s ease-out;
          width: 100%;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-title {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f7fafc;
        }

        .card-preview-container {
          margin-bottom: 24px;
          display: flex;
          justify-content: center;
          width: 100%;
          overflow: hidden;
          transform-origin: center;
        }

        .form-group {
          margin-bottom: 20px;
          width: 100%;
        }

        .card-select {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          background: #f8fafc;
          color: #2d3748;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%234a5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
          box-sizing: border-box;
        }

        .card-select:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .card-info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 24px;
          width: 100%;
        }

        .card-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
          outline: none;
          color: #2d3748;
          background: #f8fafc;
          box-sizing: border-box;
        }

        .card-input:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .card-input::placeholder {
          color: #a0aec0;
        }

        .status-section {
          background: #f8fafc;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          width: 100%;
        }

        .status-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 16px;
        }

        .status-label {
          color: #4a5568;
          font-weight: 600;
          font-size: 14px;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          display: inline-block;
        }

        .status-activate {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
        }

        .status-pending {
          background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
          color: white;
        }

        .status-inactive {
          background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
          color: white;
        }

        .status-controls {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .status-btn {
          padding: 14px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          color: #4a5568;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .status-btn:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .status-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .save-btn {
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          letter-spacing: 0.5px;
        }

        .save-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(102, 126, 234, 0.3);
        }

        .save-btn:active {
          transform: translateY(-2px);
        }

        /* Tablet Devices (481px to 768px) */
        @media (min-width: 481px) {
          .activation-container {
            padding: 20px;
            align-items: center;
          }
          
          .activation-card {
            padding: 30px;
            margin: 0;
          }
          
          .title {
            font-size: 26px;
          }
          
          .input-group {
            flex-direction: row;
          }
          
          .email-input {
            flex: 1;
          }
          
          .fetch-btn {
            width: auto;
            min-width: 180px;
          }
          
          .status-header {
            flex-direction: row;
            align-items: center;
          }
          
          .status-controls {
            flex-direction: row;
          }
          
          .status-btn {
            min-width: 100px;
          }
        }

        /* Small Laptops & Large Tablets (769px to 1024px) */
        @media (min-width: 769px) {
          .activation-card {
            padding: 40px;
          }
          
          .card-info-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .save-btn {
            max-width: 300px;
          }
        }

        /* Desktop Devices (1025px and above) */
        @media (min-width: 1025px) {
          .title {
            font-size: 28px;
          }
          
          .card-info-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          }
        }

        /* Very Small Mobile Devices (320px to 480px) */
        @media (max-width: 480px) {
          .activation-card {
            padding: 20px;
            border-radius: 16px;
          }
          
          .title {
            font-size: 22px;
            margin-bottom: 20px;
          }
          
          .email-input, .card-input, .card-select {
            padding: 12px 14px;
            font-size: 15px;
          }
          
          .fetch-btn, .save-btn {
            padding: 14px;
            font-size: 15px;
          }
          
          .section-title {
            font-size: 18px;
          }
          
          .status-section {
            padding: 16px;
          }
          
          .card-preview-container {
            transform: scale(0.85);
            margin-bottom: 16px;
          }
        }

        /* Extra Small Devices (below 320px) */
        @media (max-width: 320px) {
          .activation-container {
            padding: 12px;
          }
          
          .activation-card {
            padding: 16px;
            border-radius: 14px;
          }
          
          .title {
            font-size: 20px;
            margin-bottom: 16px;
          }
          
          .label {
            font-size: 12px;
          }
          
          .email-input, .card-input, .card-select {
            padding: 10px 12px;
            font-size: 14px;
          }
          
          .fetch-btn, .save-btn {
            padding: 12px;
            font-size: 14px;
          }
          
          .section-title {
            font-size: 16px;
          }
          
          .card-preview-container {
            transform: scale(0.75);
          }
        }

        /* Landscape Mode on Mobile */
        @media (max-height: 600px) and (orientation: landscape) {
          .activation-container {
            align-items: flex-start;
            padding-top: 20px;
            padding-bottom: 20px;
          }
          
          .activation-card {
            margin: 20px 0;
          }
          
          .card-preview-container {
            transform: scale(0.8);
          }
        }

        /* Prevent horizontal scroll on all devices */
        body, html {
          overflow-x: hidden;
          max-width: 100%;
        }
      `}</style>
    </div>
  );
}