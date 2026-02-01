import { useNavigate } from "react-router-dom";

/* ================= WHATSAPP FLOAT COMPONENT (with inline styles) ================= */
const WhatsAppFloat = ({ 
  phoneNumber = "15485825756", 
  message = "Hello! I need assistance with currency selection on InstaCoinXPay.",
  position = "right",
  bottom = "30px",
  right = "30px",
  left = "auto",
  size = "54px",
  iconSize = "28px",
  pulseEffect = true
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
    border: 'none',
    outline: 'none',
    ...positionStyles,
  };

  // Add pulse animation with inline style tag
  const pulseAnimation = pulseEffect ? {
    animation: 'whatsappPulse 2s infinite'
  } : {};

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        style={{ ...combinedStyles, ...pulseAnimation }}
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
      
      {/* Inline styles for animation */}
      <style>{`
        @keyframes whatsappPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
          }
        }
        
        @media (max-width: 768px) {
          a[title="Chat on WhatsApp"] {
            width: 50px !important;
            height: 50px !important;
            right: 20px !important;
            bottom: 20px !important;
          }
          
          a[title="Chat on WhatsApp"] svg {
            width: 24px !important;
            height: 24px !important;
          }
        }
        
        @media (max-width: 480px) {
          a[title="Chat on WhatsApp"] {
            width: 48px !important;
            height: 48px !important;
            right: 15px !important;
            bottom: 15px !important;
          }
          
          a[title="Chat on WhatsApp"] svg {
            width: 22px !important;
            height: 22px !important;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          a[title="Chat on WhatsApp"] {
            transition: none !important;
            animation: none !important;
          }
        }
        
        @media print {
          a[title="Chat on WhatsApp"] {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

const currencies = [
  { label: "Bitcoin", code: "BTC" },
  { label: "Ethereum", code: "ETH" },
  { label: "Binance (BNB)", code: "BNB" },
  { label: "Tron", code: "TRX" },
  { label: "USDT (BEP20)", code: "USDT_BEP20" },
  { label: "USDT (TRC20)", code: "USDT_TRC20" }
];

export default function SelectDepositCurrency() {
  const navigate = useNavigate();

  const handleSelect = (code) => {
    // ✅ THIS IS THE MOST IMPORTANT LINE
    localStorage.setItem("SELECTED_CURRENCY", code);

    // Go to deposit page AFTER selection
    navigate("/deposit");
  };

  return (
    <>
      <div style={styles.page}>
        <div style={styles.card}>
          <h2>Select Deposit Currency</h2>

          {currencies.map((c) => (
            <div
              key={c.code}
              style={styles.item}
              onClick={() => handleSelect(c.code)}
            >
              {c.label}
            </div>
          ))}
        </div>
      </div>
      
      {/* WhatsApp Float Button - ADDED HERE (with inline styles) */}
      <WhatsAppFloat 
        phoneNumber="15485825756"
        message="Hello! I need assistance with selecting deposit currency on InstaCoinXPay."
        position="right"
        bottom="30px"
        right="30px"
        pulseEffect={true}
      />
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#355da6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    background: "#2f5597",
    padding: "25px",
    borderRadius: "20px",
    width: "360px",
    color: "#fff"
  },
  item: {
    background: "#ffffff",
    color: "#000",
    padding: "14px",
    borderRadius: "14px",
    marginBottom: "12px",
    cursor: "pointer",
    fontWeight: "600"
  }
};