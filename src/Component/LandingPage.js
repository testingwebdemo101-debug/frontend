import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./LandingPage.css";
import coinsImg1 from "../assets/Cam1.png";
import coinsImg2 from "../assets/Cam2.png";
import coinsImg3 from "../assets/Cam3.png";
import BuyCrypto from "../assets/BuyCryptocurrency.png";
import globe from "../assets/globe.png";
import bitcoin from "../assets/beautiful_bitcoins.jpg"

import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Zap,
  Clock,
  Calendar,
  User,
  Clock as ClockIcon,
  Menu,
  X
} from 'lucide-react';

// Define LiveCounter component outside the main App component
const LiveCounter = ({ start, step, prefix = "", suffix = "", interval = 40 }) => {
  const [count, setCount] = useState(start);
  const intervalRef = useRef(null);
  const countRef = useRef(start);

  useEffect(() => {
    if (countRef.current !== start) {
      countRef.current = start;
      setCount(start);
    }
  }, [start]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      countRef.current += step;
      setCount(countRef.current);
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [step, interval]);

  return (
    <h4>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </h4>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [cryptoData, setCryptoData] = useState([]);
  const [blogArticles, setBlogArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogLoading, setBlogLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blogError, setBlogError] = useState(null);
  const [totalMarketCap, setTotalMarketCap] = useState(0);
  const [topGainer, setTopGainer] = useState(null);
  const [topLoser, setTopLoser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [lastBlogUpdate, setLastBlogUpdate] = useState(new Date());
  const [updateCount, setUpdateCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateIntervalRef = useRef(null);
  const blogUpdateIntervalRef = useRef(null);
  const initialDataRef = useRef(null);
  // Fetch live crypto news
  // Fetch live crypto news (REAL FIXED VERSION)
  const fetchCryptoNews = async () => {
    try {
      setBlogLoading(true);
      setBlogError(null);

      const response = await fetch(
        "https://newsdata.io/api/1/news?apikey=pub_3765199c264497a2409b55e38a35e9d2fdd4b&q=cryptocurrency&language=en&category=business"
      );

      const data = await response.json();

      const fallbackImages = [
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1642104704074-907c0698ab9f?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1640826511442-3c7b7a1b7f92?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1621760429962-7e1346f9e8c9?auto=format&fit=crop&w=900&q=80"
      ];

      const articles = (data.results || [])
        .slice(0, 6)
        .map((item, index) => {
          let imageUrl = item.image_url;

          // ✅ Validate API image
          if (!imageUrl || !imageUrl.startsWith("http")) {
            imageUrl = fallbackImages[index % fallbackImages.length];
          }

          return {
            id: index + "-" + Date.now(),
            title: item.title || "Crypto Market Update",
            excerpt: item.description || "Live crypto market updates.",
            image: imageUrl,
            category: item.category?.[0] || "Crypto",
            date: new Date(item.pubDate || Date.now()).toLocaleDateString(),
            readTime: `${Math.floor(Math.random() * 4) + 2} min read`,
            author: item.creator?.[0] || "Crypto Desk",
            authorRole: "Market Analyst",
            source: item.source_id || "Crypto News",
            trending: index === 0
          };
        });

      setBlogArticles(articles);
      setLastBlogUpdate(new Date());

    } catch (err) {
      console.error(err);

      // fallback content
      setBlogArticles([
        {
          id: "1",
          title: "Bitcoin price volatility increases",
          excerpt: "BTC market sees strong momentum.",
          image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=900&q=80",
          category: "Bitcoin",
          date: new Date().toLocaleDateString(),
          readTime: "3 min read",
          author: "Market Desk",
          authorRole: "Crypto Analyst",
          source: "Fallback",
          trending: true
        },
        {
          id: "2",
          title: "Ethereum adoption grows",
          excerpt: "ETH ecosystem expanding globally.",
          image: "https://images.unsplash.com/photo-1642104704074-907c0698ab9f?auto=format&fit=crop&w=900&q=80",
          category: "Ethereum",
          date: new Date().toLocaleDateString(),
          readTime: "4 min read",
          author: "Blockchain Desk",
          authorRole: "Blockchain Dev",
          source: "Fallback",
          trending: false
        }
      ]);
    } finally {
      setBlogLoading(false);
    }
  };



  // Time formatter
  const formatBlogTimeAgo = (date) => {
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Auto refresh
  useEffect(() => {
    fetchCryptoNews();
    const interval = setInterval(fetchCryptoNews, 5 * 60 * 1000); // every 5 min
    return () => clearInterval(interval);
  }, []);

  const handleBlogRefresh = () => {
    fetchCryptoNews();
  };





  // Helper function to get random author role
  const getRandomRole = () => {
    const roles = [
      'Senior Crypto Analyst',
      'Blockchain Developer',
      'Security Expert',
      'Market Researcher',
      'Investment Advisor',
      'Tech Journalist'
    ];
    return roles[Math.floor(Math.random() * roles.length)];
  };

  // Fetch live cryptocurrency data
  const fetchCryptoData = async () => {
    try {
      setRefreshing(true);
      setLastUpdated(new Date());

      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h%2C7d"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      const transformedData = data.map((crypto, index) => {
        const priceChange24h = crypto.price_change_percentage_24h || 0;
        const priceChange7d = crypto.price_change_percentage_7d_in_currency || 0;

        const sparkline = crypto.sparkline_in_7d?.price || Array(12).fill(0);

        let trend = "mixed";
        if (priceChange24h > 0) trend = "up";
        else if (priceChange24h < 0) trend = "down";

        return {
          id: crypto.id,
          rank: index + 1,
          name: crypto.name,
          symbol: crypto.symbol.toUpperCase(),
          price: crypto.current_price,
          priceFormatted: `$${crypto.current_price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`,
          change24h: priceChange24h,
          change24hFormatted: `${priceChange24h > 0 ? '+' : ''}${priceChange24h.toFixed(2)}%`,
          change7d: priceChange7d,
          change7dFormatted: `${priceChange7d > 0 ? '+' : ''}${priceChange7d.toFixed(2)}%`,
          marketCap: crypto.market_cap,
          marketCapFormatted: `$${(crypto.market_cap / 1000000000).toFixed(2)}B`,
          trend: trend,
          sparkline: sparkline,
          logoColor: getRandomColor(),
          image: crypto.image,
          volume: crypto.total_volume,
          circulatingSupply: crypto.circulating_supply,
          price_change_percentage_24h: priceChange24h
        };
      });

      setCryptoData(transformedData);
      initialDataRef.current = transformedData;

      const totalCap = data.reduce((sum, crypto) => sum + crypto.market_cap, 0);
      setTotalMarketCap(totalCap);

      if (data.length > 0) {
        const sortedBy24h = [...data].sort((a, b) =>
          (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
        );
        setTopGainer(sortedBy24h[0]);
        setTopLoser(sortedBy24h[sortedBy24h.length - 1]);
      }

      setError(null);
      setUpdateCount(prev => prev + 1);
    } catch (err) {
      console.error("Error fetching crypto data:", err);
      setError("Failed to load cryptocurrency data. Please try again.");

      const fallbackData = getFallbackData();
      setCryptoData(fallbackData);
      initialDataRef.current = fallbackData;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Simulate live price updates
  const simulateLiveUpdates = () => {
    if (!initialDataRef.current || !liveUpdates) return;

    setCryptoData(prevData => {
      return prevData.map(crypto => {
        const original = initialDataRef.current.find(c => c.id === crypto.id);
        if (!original) return crypto;

        const fluctuation = (Math.random() * 0.008 - 0.004);
        const newPrice = original.price * (1 + fluctuation);

        const newChange24h = original.change24h + (Math.random() * 0.1 - 0.05);

        const newSparkline = [...crypto.sparkline];
        if (newSparkline.length > 10) {
          newSparkline.shift();
        }
        newSparkline.push(newPrice);

        let newTrend = crypto.trend;
        if (newChange24h > 0.5) newTrend = "up";
        else if (newChange24h < -0.5) newTrend = "down";
        else newTrend = "mixed";

        return {
          ...crypto,
          price: newPrice,
          priceFormatted: `$${newPrice.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`,
          change24h: newChange24h,
          change24hFormatted: `${newChange24h > 0 ? '+' : ''}${newChange24h.toFixed(2)}%`,
          sparkline: newSparkline,
          trend: newTrend,
          marketCap: original.marketCap * (newPrice / original.price),
          marketCapFormatted: `$${((original.marketCap * (newPrice / original.price)) / 1000000000).toFixed(2)}B`
        };
      });
    });

    setUpdateCount(prev => prev + 1);
    setLastUpdated(new Date());
  };

  // Fallback data in case API fails
  const getFallbackData = () => {
    return [
      {
        id: 1,
        rank: 1,
        name: "Bitcoin",
        symbol: "BTC",
        price: 50964.19,
        priceFormatted: "$50,964.19",
        change24h: 4.72,
        change24hFormatted: "+4.72%",
        change7d: 8.57,
        change7dFormatted: "+8.57%",
        marketCap: 1056191721301,
        marketCapFormatted: "$1,056.19B",
        trend: "up",
        sparkline: [50000, 50200, 50500, 50300, 50800, 51000, 51200, 51500, 51200, 51000, 51300, 51500],
        logoColor: "#F7931A"
      },
      {
        id: 2,
        rank: 2,
        name: "Ethereum",
        symbol: "ETH",
        price: 2890.45,
        priceFormatted: "$2,890.45",
        change24h: -3.45,
        change24hFormatted: "-3.45%",
        change7d: -2.15,
        change7dFormatted: "-2.15%",
        marketCap: 347625891234,
        marketCapFormatted: "$347.63B",
        trend: "down",
        sparkline: [3000, 2950, 2900, 2850, 2900, 2950, 3000, 2950, 2900, 2850, 2900, 2850],
        logoColor: "#627EEA"
      },
      {
        id: 3,
        rank: 3,
        name: "Binance Coin",
        symbol: "BNB",
        price: 325.67,
        priceFormatted: "$325.67",
        change24h: 1.85,
        change24hFormatted: "+1.85%",
        change7d: 5.42,
        change7dFormatted: "+5.42%",
        marketCap: 52349178912,
        marketCapFormatted: "$52.35B",
        trend: "up",
        sparkline: [310, 315, 320, 318, 322, 325, 328, 330, 328, 330, 332, 335],
        logoColor: "#F0B90B"
      },
      {
        id: 4,
        rank: 4,
        name: "Tether",
        symbol: "USDT",
        price: 1.00,
        priceFormatted: "$1.00",
        change24h: -0.02,
        change24hFormatted: "-0.02%",
        change7d: 0.01,
        change7dFormatted: "+0.01%",
        marketCap: 95123456789,
        marketCapFormatted: "$95.12B",
        trend: "mixed",
        sparkline: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        logoColor: "#26A17B"
      },
      {
        id: 5,
        rank: 5,
        name: "Cardano",
        symbol: "ADA",
        price: 0.52,
        priceFormatted: "$0.52",
        change24h: 2.34,
        change24hFormatted: "+2.34%",
        change7d: 12.67,
        change7dFormatted: "+12.67%",
        marketCap: 18456123456,
        marketCapFormatted: "$18.46B",
        trend: "up",
        sparkline: [0.48, 0.49, 0.50, 0.49, 0.51, 0.52, 0.53, 0.54, 0.55, 0.56, 0.57, 0.58],
        logoColor: "#0033AD"
      },
      {
        id: 6,
        rank: 6,
        name: "Solana",
        symbol: "SOL",
        price: 102.45,
        priceFormatted: "$102.45",
        change24h: 8.92,
        change24hFormatted: "+8.92%",
        change7d: 23.45,
        change7dFormatted: "+23.45%",
        marketCap: 42123456789,
        marketCapFormatted: "$42.12B",
        trend: "up",
        sparkline: [90, 92, 95, 98, 100, 102, 105, 108, 110, 112, 115, 118],
        logoColor: "#00FFA3"
      },
      {
        id: 7,
        rank: 7,
        name: "XRP",
        symbol: "XRP",
        price: 0.55,
        priceFormatted: "$0.55",
        change24h: -1.23,
        change24hFormatted: "-1.23%",
        change7d: 3.45,
        change7dFormatted: "+3.45%",
        marketCap: 29456789123,
        marketCapFormatted: "$29.46B",
        trend: "mixed",
        sparkline: [0.53, 0.54, 0.55, 0.54, 0.56, 0.55, 0.57, 0.56, 0.58, 0.57, 0.59, 0.58],
        logoColor: "#23292F"
      },
      {
        id: 8,
        rank: 8,
        name: "Polkadot",
        symbol: "DOT",
        price: 7.89,
        priceFormatted: "$7.89",
        change24h: 3.21,
        change24hFormatted: "+3.21%",
        change7d: 15.67,
        change7dFormatted: "+15.67%",
        marketCap: 10234567890,
        marketCapFormatted: "$10.23B",
        trend: "up",
        sparkline: [6.5, 6.8, 7.0, 7.2, 7.4, 7.6, 7.8, 8.0, 8.2, 8.4, 8.6, 8.8],
        logoColor: "#E6007A"
      },
      {
        id: 9,
        rank: 9,
        name: "Dogecoin",
        symbol: "DOGE",
        price: 0.085,
        priceFormatted: "$0.085",
        change24h: -5.67,
        change24hFormatted: "-5.67%",
        change7d: -12.34,
        change7dFormatted: "-12.34%",
        marketCap: 12345678901,
        marketCapFormatted: "$12.35B",
        trend: "down",
        sparkline: [0.10, 0.095, 0.09, 0.085, 0.08, 0.075, 0.07, 0.065, 0.06, 0.055, 0.05, 0.045],
        logoColor: "#C2A633"
      }
    ];
  };

  // Generate random color for crypto logos
  const getRandomColor = () => {
    const colors = [
      "#F7931A", "#627EEA", "#F0B90B", "#26A17B", "#0033AD",
      "#00FFA3", "#23292F", "#E6007A", "#C2A633", "#FF6B35",
      "#00D1B2", "#3273DC", "#FF3860", "#FFDD57", "#23D160"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Start/stop live updates
  const toggleLiveUpdates = () => {
    setLiveUpdates(!liveUpdates);
  };


  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return "1 minute ago";
    return `${minutes} minutes ago`;
  };


  useEffect(() => {
    fetchCryptoData();


    const apiInterval = setInterval(fetchCryptoData, 30000);


    return () => {
      clearInterval(apiInterval);

      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      if (blogUpdateIntervalRef.current) {
        clearInterval(blogUpdateIntervalRef.current);
      }
    };
  }, []);

  // Start/stop live simulation interval
  useEffect(() => {
    if (liveUpdates) {
      updateIntervalRef.current = setInterval(simulateLiveUpdates, 1000);
    } else {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    }

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [liveUpdates]);

  const displayedData = showAll ? cryptoData : cryptoData.slice(0, 6);

  const getSparklinePath = (data) => {
    if (!data || data.length === 0) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    let sampledData = data;
    if (data.length > 12) {
      const step = Math.floor(data.length / 12);
      sampledData = [];
      for (let i = 0; i < 12; i++) {
        const idx = Math.min(i * step, data.length - 1);
        sampledData.push(data[idx]);
      }
    }

    const points = sampledData.map((value, index) => {
      const x = (index / (sampledData.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return '#10B981';
      case 'down': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  };

  const handleRefresh = () => {
    fetchCryptoData();
  };

  if (loading && cryptoData.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading cryptocurrency data...</p>
      </div>
    );
  }

  return (
    <div>
      {/* NAVBAR */}
      <div className="nav">
        <div className="logo">
          <img src={logo} alt="InstaCoinXPay Logo" />
        </div>


        <div className="auth">
          <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
          <button className="btn-signup" onClick={() => navigate("/getstarted")}>Signup</button>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            Buy, Sell & Swap <br />
            <span>Cryptocurrency</span> <br />in Minutes
          </h1>
          <p className="sub">
            Trade Bitcoin, Ethereum, Binance and top altcoins on one platform.
          </p>
          <div className="email-box">
            <button className="btn-signup" onClick={() => navigate("/login")}>Get Started</button>
          </div>
        </div>
        <div className="crypto-container">
          <img src={coinsImg3} alt="BNB Coin" className="coin bnb-coin-1" />
          <img src={coinsImg2} alt="ETH Coin" className="coin eth-coin-2" />
          <img src={coinsImg1} alt="BTC Coin" className="coin btc-coin-3" />
        </div>
      </section>

      {/* EXCHANGES */}
      <section className="exchanges">
        <img src={BuyCrypto} alt="Buy Cryptocurrency" />
      </section>

      {/* MARKET TABLE */}
      <section className="market">
        <div className="market-trend-container">
          <div className="market-trend-header">
            <div className="header-left">
              <div className="market-title-section">
                <h1>Trending in Market</h1>
                <div className="live-indicator">
                  <div className={`live-dot ${liveUpdates ? 'active' : ''}`}></div>
                  <span className="live-text">
                    {liveUpdates ? 'LIVE DATA' : 'PAUSED'}
                  </span>
                  <span className="update-count">
                    Updates: {updateCount}
                  </span>
                  <span className="last-updated">
                    <Clock size={14} />
                    {formatTimeAgo(lastUpdated)}
                  </span>
                </div>
              </div>
              <h2>Ranking Cryptocurrency</h2>
            </div>
            <div className="header-right">
              <button className="filter-btn">
                <Filter size={18} />
                Filter
              </button>
              <button
                className={`live-toggle-btn ${liveUpdates ? 'active' : ''}`}
                onClick={toggleLiveUpdates}
              >
                <Zap size={18} className={liveUpdates ? "pulse" : ""} />
                {liveUpdates ? 'Live ON' : 'Live OFF'}
              </button>
              <button className="view-chart-btn" onClick={handleRefresh}>
                <RefreshCw size={18} className={refreshing ? "spinning" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>


          <div className="market-table-container">
            <div className="table-wrapper">
              <table className="market-table">
                <thead>
                  <tr>
                    <th className="rank-header">#</th>
                    <th className="name-header">Name</th>
                    <th className="price-header">Price</th>
                    <th className="change-header">24h %</th>
                    <th className="change-header">7d %</th>
                    <th className="market-cap-header">Market Cap</th>
                    <th className="chart-header">Live Chart</th>
                    <th className="action-header"></th>
                  </tr>
                </thead>
                <tbody>
                  {displayedData.map((crypto) => (
                    <tr key={crypto.id} className="crypto-row">
                      <td className="rank-cell">
                        <div className="rank-number">{crypto.rank}</div>
                      </td>
                      <td className="name-cell">
                        <div className="crypto-info">
                          {crypto.image ? (
                            <img
                              src={crypto.image}
                              alt={crypto.name}
                              className="crypto-logo-img"
                            />
                          ) : (
                            <div
                              className="crypto-logo"
                              style={{ backgroundColor: crypto.logoColor }}
                            >
                              {crypto.symbol.charAt(0)}
                            </div>
                          )}
                          <div className="crypto-details">
                            <div className="crypto-name">{crypto.name}</div>
                            <div className="crypto-symbol">{crypto.symbol}</div>
                          </div>
                          {crypto.rank <= 3 && (
                            <div className="trending-tag">
                              <TrendingUp size={12} />
                              <span>Trending</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="price-cell">
                        <div className="price-amount">
                          {crypto.priceFormatted}
                          {liveUpdates && (
                            <div className="price-change-indicator">
                              {crypto.change24h > 0 ? '↗' : crypto.change24h < 0 ? '↘' : '→'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="change-cell">
                        <div
                          className={`change-badge ${crypto.change24h > 0 ? 'positive' : 'negative'} ${liveUpdates ? 'pulse' : ''}`}
                        >
                          {crypto.change24h > 0 ? (
                            <ArrowUpRight size={14} />
                          ) : (
                            <ArrowDownRight size={14} />
                          )}
                          {crypto.change24hFormatted}
                        </div>
                      </td>
                      <td className="change-cell">
                        <div
                          className={`change-badge ${crypto.change7d > 0 ? 'positive' : 'negative'}`}
                        >
                          {crypto.change7d > 0 ? (
                            <ArrowUpRight size={14} />
                          ) : (
                            <ArrowDownRight size={14} />
                          )}
                          {crypto.change7dFormatted}
                        </div>
                      </td>
                      <td className="market-cap-cell">
                        {crypto.marketCapFormatted}
                      </td>
                      <td className="chart-cell">
                        <div className="sparkline-container">
                          <svg
                            className="sparkline"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                          >
                            <path
                              d={getSparklinePath(crypto.sparkline)}
                              fill="none"
                              stroke={getTrendColor(crypto.trend)}
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="action-cell">
                        <button className="more-options-btn">
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="show-more-container">
              <button
                className="show-more-btn"
                onClick={() => setShowAll(!showAll)}
                disabled={cryptoData.length === 0}
              >
                {showAll ? (
                  <>
                    Show Less
                    <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    Show More
                    <ChevronDown size={16} />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="market-stats">
            <div className="stats-card live-card">
              <div className="stats-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <TrendingUp size={24} color="#10B981" />
              </div>
              <div className="stats-content">
                <div className="stats-label">Top Gainer (24h)</div>
                <div className="stats-value">
                  {topGainer ? `${topGainer.name} (${topGainer.symbol.toUpperCase()})` : 'Loading...'}
                </div>
                <div className="stats-change positive">
                  {topGainer ? `+${topGainer.price_change_percentage_24h?.toFixed(2) || '0.00'}%` : '+0.00%'}
                </div>
              </div>
              {liveUpdates && <div className="live-badge">LIVE</div>}
            </div>

            <div className="stats-card live-card">
              <div className="stats-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <TrendingDown size={24} color="#EF4444" />
              </div>
              <div className="stats-content">
                <div className="stats-label">Top Loser (24h)</div>
                <div className="stats-value">
                  {topLoser ? `${topLoser.name} (${topLoser.symbol.toUpperCase()})` : 'Loading...'}
                </div>
                <div className="stats-change negative">
                  {topLoser ? `${topLoser.price_change_percentage_24h?.toFixed(2) || '0.00'}%` : '0.00%'}
                </div>
              </div>
              {liveUpdates && <div className="live-badge">LIVE</div>}
            </div>

            <div className="stats-card live-card">
              <div className="stats-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <BarChart3 size={24} color="#3B82F6" />
              </div>
              <div className="stats-content">
                <div className="stats-label">Total Market Cap</div>
                <div className="stats-value">
                  {totalMarketCap > 0 ? formatMarketCap(totalMarketCap) : '$2.1T'}
                </div>
                <div className="stats-change positive">
                  {cryptoData.length > 0 ? '+3.2%' : '+0.00%'}
                </div>
              </div>
              {liveUpdates && <div className="live-badge">LIVE</div>}
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED SECTION */}
      <div className="trusted-top">
        <div className="trusted-cards">
          <div className="info-card-1">
            <h4>Secure Storage</h4>
            <p>We safely store your crypto using industry-leading technology.</p>
          </div>

          <div className="info-card-2">
            <h4>Protected by insurance</h4>
            <p>Your funds are covered with an extra layer of protection.</p>
          </div>

          <div className="info-card-1">
            <h4>24/7 Monitoring</h4>
            <p>Continuous system monitoring to prevent threats.</p>
          </div>
        </div>

        <div className="trusted-text">
          <h2>
            The Most Trusted <br />
            <span>Cryptocurrency</span> Platform
          </h2>
          <p>Explore the top reasons customers trust.</p>
        </div>
      </div>


      {/* HOW IT WORKS */}
      <section className="how-wrapper">
        <div className="how-header">
          <h2>How It Works</h2>
          <p>Crypters supports a variety of the most popular digital currencies</p>
        </div>

        <div className="how-title">
          <div>
            <h3>
              We Will <span>Help You to Start</span> <br />
              Crypto Investment ✨
            </h3>
          </div>
          <button className="btn-primary" onClick={() => navigate("/getstarted")}>Get Started</button>
        </div>

        <div className="how-cards">
          <div className="how-card active">
            <div className="step">
              <span className="icon">👤</span>
              <span className="number">1</span>
            </div>
            <h4>Create an Account</h4>
            <p>
              Set up a secure account to begin using our platform and keep your
              information protected.
            </p>
            <button className="btn-outline" onClick={() => navigate("/getstarted")}>Create New Account</button>
          </div>

          <div className="how-card">
            <div className="step">
              <span className="icon">🏦</span>
              <span className="number">2</span>
            </div>
            <h4>Link Your crypto wallet</h4>
            <p>
              Securely link your crypto wallet to enable fiat deposits and
              withdrawals for your crypto trades.
            </p>
          </div>

          <div className="how-card">
            <div className="step">
              <span className="icon">📈</span>
              <span className="number">3</span>
            </div>
            <h4>Start Buying & Selling</h4>
            <p>
              Start building your crypto portfolio with fast, intuitive, and
              secure transactions.
            </p>
          </div>
        </div>
      </section>
     <section className="bitcoin_img">
  <img src={bitcoin} alt="Bitcoin Background" />

  <div className="hero-overlay">
    <h1>InstaCoinXPay</h1>
    <p>
      InstaCoinXPay is a next-gen crypto transaction platform built for speed,
      security, and decentralization. Send and receive digital assets seamlessly
      with low fees and reliable performance. Designed for the modern web, it
      empowers users with full control over their transactions—anytime, anywhere.
    </p>
  </div>
</section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-left">
          <h2>
            Let's Start Your <br />
            <span>Crypto Investment</span> Now!
          </h2>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => navigate("/getstarted")}>Let's Begin</button>
          </div>
        </div>

        <div className="cta-right">
          <img src={globe} alt="Crypto Globe" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-col">
            <img src={logo} alt="Logo" className="footer-logo" />
            <div className="store-buttons">
              {/* App store buttons can be added here */}
            </div>
          </div>

          <div className="footer-col center">
            <h4>Join Our Telegram Channel</h4>

            <a
              href="https://t.me/instacoinxpay"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-telegram"
            >
              Join
            </a>
          </div>


          <div className="footer-col right">
            <h4>Contact</h4>
            <p>instacoinxpay.com</p>
            <p>Tel: +1 (548) 582-5756</p>
            <p>
              Main Office - 82 Richmond St E, <br />
              Toronto, ON M5C 1P1, Canada
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright © InstaCoinXPay. All Rights Reserved.</p>
          <p>Privacy Policy | Terms & Conditions</p>
        </div>
      </footer>
      {/* WhatsApp Floating Button */}
<a
  href="https://wa.me/15485825756"   // 🔴 replace with your real WhatsApp number
  target="_blank"
  rel="noopener noreferrer"
  className="whatsapp-float"
>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
    alt="WhatsApp"
  />
</a>
    </div>
  );
}