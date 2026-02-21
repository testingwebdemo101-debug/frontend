import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TemplateLayout from "./TemplateLayout";

// Import card images - corrected paths
import classicCard from "../../assets/cards/classic.png";
import merchantCard from "../../assets/cards/merchant.png";
import primeCard from "../../assets/cards/prime.png";
import platinumCard from "../../assets/cards/platinum.png";
import eliteCard from "../../assets/cards/elite.png";

const cardOptions = [
  {
    id: "merchant",
    title: "Merchant Visa Card",
    price: "$100",
    limit: "Withdraw Limit $5000 / Day",
    image: merchantCard,
    theme: "debit-merchant"
  },
  {
    id: "classic",
    title: "Classic Visa Card",
    price: "$200",
    limit: "Withdraw Limit $20,000 / Day",
    image: classicCard,
    theme: "debit-classic"
  },
  {
    id: "prime",
    title: "Prime Visa Card",
    price: "$500",
    limit: "Withdraw Limit $50,000 / Day",
    image: primeCard,
    theme: "debit-prime"
  },
  {
    id: "platinum",
    title: "Platinum Visa Card",
    price: "$1000",
    limit: "Withdraw Limit $100,000 / Day",
    image: platinumCard,
    theme: "debit-platinum"
  },
  {
    id: "elite",
    title: "World Elite Visa Card",
    price: "$2000",
    limit: "Withdraw Limit Unlimited",
    image: eliteCard,
    theme: "debit-elite"
  }
];

const CardActivation = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  
  const [formData, setFormData] = useState({
    customer: "Customer",
    cardType: "Classic Visa Card",
    amount: "200",
    debitCard: "Classic Visa Debit Card",
    selectedCardId: "classic" // Default selected card
  });

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Get selected card details
  const selectedCard = cardOptions.find(card => card.id === formData.selectedCardId) || cardOptions[1];

  const handleCardSelect = (cardId) => {
    const card = cardOptions.find(c => c.id === cardId);
    if (card) {
      setFormData({
        ...formData,
        selectedCardId: cardId,
        cardType: card.title,
        amount: card.price.replace('$', ''),
        debitCard: card.title
      });
    }
  };

  const handleSend = async () => {
    try {
      setSending(true);
      setMessage({ type: '', text: '' });
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: 'Authentication token not found. Please login again.' });
        setSending(false);
        return;
      }

      if (!email) {
        setMessage({ type: 'error', text: 'Recipient email not found. Please go back and enter an email.' });
        setSending(false);
        return;
      }

      const response = await fetch('/api/admin/mail/card-activation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: email,
          customer: formData.customer,
          cardType: formData.cardType,
          amount: formData.amount,
          debitCard: formData.debitCard,
          selectedCardId: formData.selectedCardId
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `✅ Card Activation email sent successfully to ${email}` 
        });
        
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 5000);
      } else {
        setMessage({ type: 'error', text: `❌ Failed: ${data.error || 'Unknown error occurred'}` });
      }
    } catch (error) {
      console.error('Email send error:', error);
      setMessage({ 
        type: 'error', 
        text: '❌ Error sending email. Please check your connection and try again.' 
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <TemplateLayout 
      title="Edit Template - Card Activation" 
      formData={formData} 
      setFormData={setFormData}
    >
      {/* Message Display */}
      {message.text && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '6px',
          backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          border: message.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      {/* Email Info Display */}
      {email && (
        <div style={{
          padding: '10px 16px',
          marginBottom: '20px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b8daff',
          borderRadius: '6px',
          color: '#004085',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span><strong>📧 Sending to:</strong> {email}</span>
          <span style={{ fontSize: '12px', color: '#666' }}>(from previous step)</span>
        </div>
      )}

      {/* Card Selection */}
      <div className="cac-form-group">
        <label>
          Select Card <span style={{color: '#ff0000'}}>*</span>
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginTop: '10px'
        }}>
          {cardOptions.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardSelect(card.id)}
              style={{
                border: formData.selectedCardId === card.id ? '3px solid #4CAF50' : '1px solid #ddd',
                borderRadius: '10px',
                padding: '15px',
                cursor: 'pointer',
                backgroundColor: formData.selectedCardId === card.id ? '#f0fff0' : 'white',
                transition: 'all 0.3s ease',
                boxShadow: formData.selectedCardId === card.id ? '0 4px 15px rgba(76, 175, 80, 0.2)' : 'none'
              }}
            >
              <img 
                src={card.image} 
                alt={card.title}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'contain',
                  marginBottom: '10px'
                }}
              />
              <h4 style={{ margin: '10px 0 5px', fontSize: '14px' }}>{card.title}</h4>
              <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#4CAF50' }}>{card.price}</p>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>{card.limit}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cac-form-group">
        <label htmlFor="customer-name">
          Customer Name <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="customer-name"
          type="text"
          value={formData.customer}
          onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
          className="cac-form-input"
          placeholder="Enter customer name"
          required
        />
      </div>

      <div className="cac-form-group">
        <label htmlFor="card-type">
          Card Type <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="card-type"
          type="text"
          value={formData.cardType}
          onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
          className="cac-form-input"
          placeholder="e.g., Classic Visa Card"
          required
        />
      </div>

      <div className="cac-form-group">
        <label htmlFor="activation-fee">
          Activation Fee ($) <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="activation-fee"
          type="number"
          min="0"
          step="1"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="cac-form-input"
          placeholder="e.g., 200"
          required
        />
      </div>

      <div className="cac-form-group">
        <label htmlFor="debit-card">
          Debit Card Name <span style={{color: '#ff0000'}}>*</span>
        </label>
        <input
          id="debit-card"
          type="text"
          value={formData.debitCard}
          onChange={(e) => setFormData({ ...formData, debitCard: e.target.value })}
          className="cac-form-input"
          placeholder="e.g., Classic Visa Debit Card"
          required
        />
      </div>

      <div className="cac-preview" style={{ 
        marginTop: '30px', 
        border: '1px solid #e0e0e0', 
        padding: '20px', 
        borderRadius: '8px', 
        backgroundColor: '#f9f9f9' 
      }}>
        <h3 style={{ 
          marginTop: 0, 
          marginBottom: '20px', 
          color: '#333', 
          borderBottom: '1px solid #ddd', 
          paddingBottom: '10px' 
        }}>
          Email Preview
        </h3>
        
        {/* Card Display in Preview */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '300px',
            textAlign: 'center'
          }}>
            <img 
              src={selectedCard.image} 
              alt={selectedCard.title}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            />
            <p style={{
              margin: '10px 0 0',
              fontWeight: 'bold',
              color: '#333'
            }}>{selectedCard.title}</p>
            <p style={{
              margin: '5px 0',
              color: '#666',
              fontSize: '14px'
            }}>{selectedCard.limit}</p>
          </div>
        </div>

        <p className="cac-preview-text">
          Dear <span className="cac-red">{formData.customer}</span>,
        </p>
        <p className="cac-preview-text">Greetings from InstaCoinXPay.</p>
        <p className="cac-preview-text">
          We are pleased to inform you that your <span className="cac-red">{formData.cardType}</span> activation request has been successfully accepted. This is to confirm that we have received your activation fee payment of <span className="cac-red">${formData.amount}</span>, which is currently under processing.
        </p>
        <p className="cac-preview-text">
          Our verification and card activation procedures are now in progress. Upon successful completion of the activation process, your <span className="cac-red">{formData.debitCard}</span> will be fully enabled for withdrawals and transaction usage. A confirmation notification will be sent to you promptly once the activation is finalized.
        </p>
        <p className="cac-preview-text">
          Should you have any questions or require additional assistance, please do not hesitate to contact our Customer Support Team. We remain committed to providing you with secure and efficient service.
        </p>
        <p className="cac-preview-text">Thank you for choosing InstaCoinXPay.</p>
        <p className="cac-preview-text">Best Regards,<br />InstaCoinXPay Support Team</p>
        
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <p className="cac-preview-text" style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
            <strong>Risk warning:</strong> Cryptocurrency trading is subject to high market risk. InstaCoinXPay will make the best efforts to choose high-quality coins, but will not be responsible for your trading losses. Please trade with caution.
          </p>
          <p className="cac-preview-text" style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
            <strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official InstaCoinXPay website when entering sensitive data.
          </p>
          <p className="cac-preview-text" style={{ fontSize: "12px", color: "#666", textAlign: "center", marginTop: "15px" }}>
            © 2026 InstaCoinXPay, All Rights Reserved
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: "flex", 
        gap: "15px", 
        marginTop: "30px", 
        justifyContent: "flex-end",
        borderTop: '1px solid #e0e0e0',
        paddingTop: '20px'
      }}>
        
      </div>

      {/* Required Fields Note */}
      <p style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '10px',
        textAlign: 'right',
        fontStyle: 'italic'
      }}>
        <span style={{color: '#ff0000'}}>*</span> Required fields
      </p>
    </TemplateLayout>
  );
};

export default CardActivation;