import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import logo from "../assets/logo.png";
import chip from "../assets/silver_qr.png";
import sendarrow from "../assets/send.png";
import receivearrow from "../assets/recieve-arrow.png";
import buyarrow from "../assets/buy.png";
import historyarrow from "../assets/history.png";
import Card from "../assets/cards-dashboard/Card";
import { getCryptoIcon } from "../config/cryptoIcons";

// Static fallback data
const STATIC_ASSETS = [
  {
    name: "BTC",
    symbol: "btc",
    sub: "Bitcoin",
    price: 85966.43,
    balance: 0.0665,
    change: -0.17,
    balanceValue: 5713.45
  },
  {
    name: "USDT",
    symbol: "usdtBnb",
    sub: "Tether BEP-20",
    price: 1.0,
    balance: 8766.42,
    change: 0.0,
    balanceValue: 8766.42
  }
];

const getDisplayName = (symbol = "") => {
  const s = symbol.toLowerCase();

  if (s.startsWith("usdt")) return "USDT";

  return s.toUpperCase();
};

const mapCardType = (cardType = "") => {
  const t = cardType.toLowerCase();
  if (t.includes("merchant")) return "merchant";
  if (t.includes("classic")) return "classic";
  if (t.includes("prime")) return "prime";
  if (t.includes("platinum")) return "platinum";
  if (t.includes("elite")) return "elite";
  return "classic";
};


const ADMIN_EMAIL = "bitabox860@gmail.com";


const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [tickerData, setTickerData] = useState([]);
  
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [loading, setLoading] = useState({
    dashboard: false,
    ticker: false,
    portfolio: false,
    balance: false,
  });
  const [userProfile, setUserProfile] = useState(null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [totalBalance, setTotalBalance] = useState("$0");
  const [userAssets, setUserAssets] = useState([]);
  const [dataSource, setDataSource] = useState("live");
  const [lastUpdate, setLastUpdate] = useState("");
  const [cardData, setCardData] = useState(null);

  const isAdmin = userEmail === ADMIN_EMAIL;

  /* ================= FETCH DEBIT CARD ================= */
  const fetchDebitCard = async () => {
  try {
    if (!userEmail) return;

    const res = await axios.get(
      `https://backend-instacoinpay-1.onrender.com/api/debit-card/by-email/${userEmail}`,
      { withCredentials: true }
    );

    // ✅ backend returns { success, data }
    setCardData(res.data.data);

  } catch (err) {
    // ✅ No debit card applied yet (NORMAL case)
    if (err.response?.status === 404) {
      setCardData(null);
    } else {
      console.error("Error fetching debit card:", err);
    }
  }
};


  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) return;

    const res = await axios.get(
      `https://backend-instacoinpay-1.onrender.com/api/auth/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setUserProfile(res.data.data);
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
  }
};


  // Format percentage
  const formatPercentage = (value) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  // ================= FETCH DASHBOARD DATA =================
  const fetchDashboardData = async () => {
    try {
      setLoading(prev => ({ ...prev, dashboard: true }));
      const token = localStorage.getItem("token");

      if (!token) return applyStaticData();

      const response = await axios.get(
        "https://backend-instacoinpay-1.onrender.com/api/crypto/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data.success) return applyStaticData();

      const assets = response.data.data.assets || [];

      const mappedAssets = assets.map(asset => ({
        icon: getCryptoIcon(asset.symbol),
        name: getDisplayName(asset.symbol),
        symbol: asset.symbol.toLowerCase(),
        sub: asset.name,
        price: formatCurrency(asset.currentPrice),
        rawChange: asset.priceChangePercentage24h,
        change: formatPercentage(asset.priceChangePercentage24h),
        balanceText: formatCurrency(asset.balance * asset.currentPrice),
        usdValue: asset.balanceValue,
        originalAsset: asset
      }));

      setUserAssets(mappedAssets);

      const totalUsd = assets.reduce(
        (sum, a) => sum + (a.balanceValue || 0),
        0
      );

      setTotalBalance(formatCurrency(totalUsd));
      setLastUpdate(new Date().toLocaleTimeString());
      setDataSource("live");

    } catch (err) {
      applyStaticData();
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

  // Use static data
  const applyStaticData = () => {
    setDataSource("static");
    setLastUpdate(new Date().toLocaleTimeString());

    const assetsWithIcons = STATIC_ASSETS.map(asset => ({
      ...asset,
      icon: getCryptoIcon(asset.symbol),
      price: formatCurrency(asset.price),
      balanceValue: asset.balanceValue,
      change: formatPercentage(asset.change)
    }));

    setUserAssets(assetsWithIcons);

    const total = STATIC_ASSETS.reduce(
      (sum, asset) => sum + asset.balanceValue,
      0
    );

    setTotalBalance(formatCurrency(total));
  };

  // Fetch Live Ticker Data
  const fetchTickerData = async () => {
    try {
      setLoading(prev => ({ ...prev, ticker: true }));
      const token = localStorage.getItem("token");

      if (!token) {
        const staticTicker = STATIC_ASSETS.map(asset => ({
          symbol: asset.name,
          name: asset.sub,
          price: asset.price,
          change: 0,
          changePercent: asset.change,
          volume: 0,
          marketCap: 0
        }));
        setTickerData(staticTicker);
        return;
      }

      const response = await axios.get("https://backend-instacoinpay-1.onrender.com/api/crypto/ticker", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      });

      if (response.data.success && response.data.data) {
        setTickerData(response.data.data);
        localStorage.setItem('cryptoPrices', JSON.stringify(response.data.data));
      } else {
        const staticTicker = STATIC_ASSETS.map(asset => ({
          symbol: asset.name,
          name: asset.sub,
          price: asset.price,
          change: 0,
          changePercent: asset.change,
          volume: 0,
          marketCap: 0
        }));
        setTickerData(staticTicker);
      }
    } catch (error) {
      console.log("Error fetching ticker, using static data:", error.message);
      const staticTicker = STATIC_ASSETS.map(asset => ({
        symbol: asset.name,
        name: asset.sub,
        price: asset.price,
        change: 0,
        changePercent: asset.change,
        volume: 0,
        marketCap: 0
      }));
      setTickerData(staticTicker);
    } finally {
      setLoading(prev => ({ ...prev, ticker: false }));
    }
  };

  // Fetch Wallet Balance
  const fetchWalletBalance = async () => {
    try {
      setLoading(prev => ({ ...prev, balance: true }));
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await axios.get("https://backend-instacoinpay-1.onrender.com/api/transfer/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setWalletBalance(response.data.data);
        localStorage.setItem('walletBalance', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.log("Error fetching wallet balance:", error.message);
    } finally {
      setLoading(prev => ({ ...prev, balance: false }));
    }
  };

  // Refresh all data
  const refreshAllData = () => {
    fetchDashboardData();
    fetchTickerData();
    fetchWalletBalance();
  };

  // Initial data fetch
  useEffect(() => {
    refreshAllData();
    fetchDebitCard();
     fetchUserProfile(); 

    const intervalId = setInterval(() => {
      fetchDashboardData();
      fetchTickerData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [userEmail]);

  const openWallet = (asset) => {
    navigate("/bitcoinwallet", {
      state: {
        ...asset,
        iconPath: asset.icon,
        originalAsset: asset.originalAsset || asset
      }
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleSend = () => {
    if (userAssets && userAssets.length > 0) {
      navigate("/sendbtc", {
        state: {
          ...userAssets[0],
          name: userAssets[0].name,
          sub: userAssets[0].sub,
          balance: userAssets[0].balance,
          icon: userAssets[0].icon
        }
      });
    } else {
      navigate("/sendbtc");
    }
  };

  const handleReceive = () => {
    navigate("/balreceive");
  };

  const handleBuy = () => {
    navigate("/trustwalletconnect");
  };

  const handleHistory = () => {
    navigate("/history");
  };

  const displayAssets = userAssets.length > 0 ? userAssets : STATIC_ASSETS.map(asset => ({
    ...asset,
    price: formatCurrency(asset.price),
    balanceValue: formatCurrency(asset.balanceValue),
    change: formatPercentage(asset.change)
  }));

  return (
    <>
      <div className={`dashboard ${sidebarOpen ? 'blur-background' : ''}`}>
        <header className="header">
          <img src={logo} alt="logo" />
          <div className="menu" onClick={toggleSidebar}>☰</div>
        </header>

        <div className="top-section">
          <div className="balance-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="connect">
                <Link className="Connect-link" to="/trustwalletconnect">Connect Wallet</Link>
              </span>
            </div>
            <p>Your Balance</p>
            <h2>{totalBalance}</h2>

            <div style={{
              fontSize: '11px',
              color: '#888',
              marginBottom: '15px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>Last updated: {lastUpdate || '--:--'}</span>
            </div>

            <div className="actions">
              <div onClick={handleReceive}>
                <div className="action-box">
                  <img src={receivearrow} alt="Receive" style={{ width: '48px', height: '40px' }} />
                </div>
                <span>Receive</span>
              </div>
              <div onClick={handleSend}>
                <div className="action-box">
                  <img src={sendarrow} alt="Send" style={{ width: '48px', height: '48px' }} />
                </div>
                <span>Send</span>
              </div>
              <div onClick={handleBuy}>
                <div className="action-box">
                  <img src={buyarrow} alt="Buy" style={{ width: '48px', height: '48px' }} />
                </div>
                <span>Buy</span>
              </div>
              <div onClick={handleHistory}>
                <div className="action-box">
                  <img src={historyarrow} alt="History" style={{ width: '48px', height: '48px' }} />
                </div>
                <span>History</span>
              </div>
            </div>
          </div>

          <div className="visa-container">
            {/* ✅ STEP 3: Updated Card component with dynamic + smart fallback */}
              <Card
  type={mapCardType(cardData?.cardType)}
  number={cardData?.cardNumber || "XXXX XXXX XXXX XXXX"}
  holder={
    cardData?.fullName ||
    userProfile?.fullName ||
    "CARD HOLDER"
  }
  expiry={cardData?.expiry || "XX/XX"}
  cvv={cardData?.cvv || "XXX"}
  status={cardData?.status?.toUpperCase() || "INACTIVE"}
/>

            
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 className="assets-title">Assets</h3>
          {loading.dashboard && (
            <small style={{ color: '#ff9800', fontSize: '11px' }}>
              Loading...
            </small>
          )}
        </div>

        <div className="assets">
          {displayAssets.map((item, i) => (
            <div
              className="asset-card"
              key={i}
              onClick={() => openWallet(item)}
              style={{ cursor: "pointer" }}
            >
              <img src={item.icon} alt={item.name} />
              <div className="asset-info">
                <strong>{item.name}</strong>
                <span>{item.sub}</span>
              </div>
              <div className="asset-price">
                <strong>{item.price}</strong>
                <span className={item.rawChange >= 0 ? "green" : "red"}>
                  {item.change} 24hr
                </span>
              </div>
              <div className="asset-balance">
                {item.balanceText}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
      <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <img src={logo} alt="logo" className="sidebar-logo" />
          <button className="close-sidebar" onClick={closeSidebar}>×</button>
        </div>
        <div className="sidebar-menu">
          {isAdmin && (
            <div className="sidebar-item">
              <Link to="/admin-panel" onClick={closeSidebar}>
                Admin Panel
              </Link>
            </div>
          )}

          <div className="sidebar-item">
            <Link to="/dashboard" onClick={closeSidebar}>Dashboard</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/sendbtc" onClick={closeSidebar}>Withdrawal</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/creditcards" onClick={closeSidebar}>Activate Debit Card</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/trustwalletconnect" onClick={closeSidebar}>Connect Trust Wallet</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/support" onClick={closeSidebar}>Support</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/report" onClick={closeSidebar}>Report</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/referearn" onClick={closeSidebar}>Referral Link</Link>
          </div>
          <div className="sidebar-item">
            <Link to="/" onClick={() => {
              localStorage.clear();
              closeSidebar();
            }}>Logout</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;