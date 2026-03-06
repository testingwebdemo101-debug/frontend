import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SpinWheel.css";

const SEGMENTS = [
  { label: "Better Luck", sublabel: "Next Time",  type: "lose" },
  { label: "$25 BTC",          sublabel: "Cash Prize", type: "win"  },
  { label: "$100K BTC",        sublabel: "Jackpot!",   type: "mega" },
  { label: "Better Luck", sublabel: "Next Time",  type: "lose" },
  { label: "$100 BTC",         sublabel: "Cash Prize", type: "win"  },
  { label: "$75K BTC",         sublabel: "Big Win!",   type: "mega" },
  { label: "Better Luck", sublabel: "Next Time",  type: "lose" },
  { label: "$50 BTC",          sublabel: "Cash Prize", type: "win"  },
  { label: "Better Luck", sublabel: "Next Time",  type: "lose" },
  { label: "$50K BTC",         sublabel: "Grand Prize",type: "mega" },
];

const NUM   = SEGMENTS.length;
const ANGLE = 360 / NUM;

const COLORS = {
  lose: { bg: "#1a1a2e", text: "#ffff" },
  win:  { bg: "#0f3460", text: "#e2e8f0" },
  mega: { bg: "#16213e", text: "#e98f09" },
};
const ALT_COLORS = {
  lose: { bg: "#16162a", text: "#ffff" },
  win:  { bg: "#0d2d55", text: "#cbd5e1" },
  mega: { bg: "#131c38", text: "#e98f09" },
};

function polarToXY(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* Only the rotating segments */
function WheelInner() {
  const cx = 250, cy = 250, r = 235, innerR = 70;
  return (
    <svg className="sw-wheel-svg" width="500" height="500" viewBox="0 0 500 500">
      <defs>
        <filter id="textGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {SEGMENTS.map((seg, i) => {
        const startDeg = i * ANGLE;
        const endDeg   = startDeg + ANGLE;
        const p1  = polarToXY(cx, cy, r,      startDeg);
        const p2  = polarToXY(cx, cy, r,      endDeg);
        const ip1 = polarToXY(cx, cy, innerR, startDeg);
        const ip2 = polarToXY(cx, cy, innerR, endDeg);
        const palette = i % 2 === 0 ? COLORS[seg.type] : ALT_COLORS[seg.type];

        const path = [
          `M ${ip1.x} ${ip1.y}`,
          `L ${p1.x} ${p1.y}`,
          `A ${r} ${r} 0 0 1 ${p2.x} ${p2.y}`,
          `L ${ip2.x} ${ip2.y}`,
          `A ${innerR} ${innerR} 0 0 0 ${ip1.x} ${ip1.y}`,
          "Z",
        ].join(" ");

        const midDeg = startDeg + ANGLE / 2;
        const tp     = polarToXY(cx, cy, (r + innerR) / 2, midDeg);

        return (
          <g key={i}>
            <path d={path} fill={palette.bg} stroke="#0a0a1a" strokeWidth="1.5" />
            <line
              x1={ip1.x} y1={ip1.y} x2={p1.x} y2={p1.y}
              stroke="rgba(255,215,80,0.15)" strokeWidth="1"
            />
            <g
              transform={`translate(${tp.x}, ${tp.y}) rotate(${midDeg})`}
              filter={seg.type === "mega" ? "url(#textGlow)" : undefined}
            >
              <text
                textAnchor="middle" dominantBaseline="middle"
                y={seg.type === "lose" ? 0 : -9}
                fontSize={seg.label.length > 5 ? 11 : 16}
                fontWeight="900"
                fontFamily="'Bebas Neue', Impact, sans-serif"
                fill={palette.text}
                letterSpacing="1"
              >
                {seg.label}
              </text>
              <text
                textAnchor="middle" dominantBaseline="middle"
                y={9}
                fontSize={seg.type === "lose" ? 8 : 9}
                fontWeight="600"
                fontFamily="'Bebas Neue', Impact, sans-serif"
                fill={seg.type === "mega" ? "#f7931a" : seg.type === "win" ? "#94a3b8" : palette.text}
                opacity={seg.type === "lose" ? 0.6 : 1}
                letterSpacing="1.5"
              >
                {seg.type === "lose" ? "NEXT TIME" : seg.sublabel}
              </text>
            </g>
          </g>
        );
      })}

      {/* Hub - Updated with green circle */}
      <circle cx={cx} cy={cy} r={innerR + 4} fill="#0a0a1a" stroke="#c8a84b" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={innerR} fill="#0f0f1e" stroke="#8b6914" strokeWidth="1" />
      {/* Green center circle - ADDED */}
      <circle cx={cx} cy={cy} r="25" fill="#04f318" stroke="#ffffff" strokeWidth="3" filter="url(#textGlow)" />
      {/* Inner white circle for contrast */}
      <circle cx={cx} cy={cy} r="15" fill="#ffffff" opacity="0.3" />
    </svg>
  );
}

/* Static outer ring + larger pointer — never rotates */
function OuterRing() {
  const cx = 250, cy = 250, r = 235;
  return (
    <svg className="sw-wheel-svg" width="500" height="500" viewBox="0 0 500 500">
      <defs>
        <radialGradient id="goldRing" cx="50%" cy="50%" r="50%">
          <stop offset="85%"  stopColor="#c8a84b" />
          <stop offset="100%" stopColor="#8b6914" />
        </radialGradient>
        <filter id="pointerGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="pointerGlowStrong">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r + 14} fill="url(#goldRing)" />
      {Array.from({ length: 28 }).map((_, i) => {
        const p = polarToXY(cx, cy, r + 14, (360 / 28) * i);
        return (
          <circle key={i} cx={p.x} cy={p.y} r={4}
            fill={i % 2 === 0 ? "#fff6c0" : "#a07820"} opacity="0.9" />
        );
      })}
      
      {/* 🎯 LARGER POINTER / ARROW - NOW AT TOP 🎯 */}
      {/* Main pointer triangle - positioned at top */}
      <polygon
        points={`${cx},${cy - r - 35} ${cx - 25},${cy - r + 20} ${cx + 25},${cy - r + 20}`}
        fill="#04f318" 
        stroke="#8b4a00" 
        strokeWidth="3"
        filter="url(#pointerGlowStrong)"
      />
      
      {/* Pointer tip accent - at the tip of arrow */}
      <circle cx={cx} cy={cy - r - 25} r={6} fill="#ffd700" stroke="#8b4a00" strokeWidth="2" />
      
      {/* Pointer base / stand */}
      <rect 
        x={cx - 15} 
        y={cy - r + 5} 
        width="30" 
        height="20" 
        fill="#c8a84b" 
        stroke="#8b6914" 
        strokeWidth="2"
        rx="5"
      />
      
      {/* Decorative elements on pointer */}
      <circle cx={cx} cy={cy - r + 10} r={4} fill="#ffd700" />
      <circle cx={cx - 8} cy={cy - r + 5} r={2.5} fill="#ffd700" opacity="0.7" />
      <circle cx={cx + 8} cy={cy - r + 5} r={2.5} fill="#ffd700" opacity="0.7" />
    </svg>
  );
}

export default function SpinWheel() {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation,   setRotation]   = useState(0);
  const [result,     setResult]     = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [lastSpinTime, setLastSpinTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [canSpin, setCanSpin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [pendingWin, setPendingWin] = useState(null);
  const rotRef = useRef(0);
  
  // Get user from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;
  const referralCode = userData?.referralCode || localStorage.getItem("userReferralCode");

  // Check spin availability from server
  useEffect(() => {
    const checkSpinAvailability = async () => {
      if (!userId) {
        setCanSpin(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://backend-srtt.onrender.com/api/spin/check-availability/${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setCanSpin(data.data.canSpin);
          setTimeRemaining(data.data.timeRemaining);
          setLastSpinTime(data.data.lastSpinTime);
        }
      } catch (error) {
        console.error("Error checking spin availability:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSpinAvailability();

    // Update countdown every second
    const interval = setInterval(() => {
      if (lastSpinTime && !canSpin) {
        const now = Date.now();
        const lastSpin = new Date(lastSpinTime).getTime();
        const timeSinceLastSpin = now - lastSpin;
        const COOLDOWN_MS = 84 * 60 * 60 * 1000;
        
        if (timeSinceLastSpin >= COOLDOWN_MS) {
          setCanSpin(true);
          setTimeRemaining(null);
        } else {
          setTimeRemaining(COOLDOWN_MS - timeSinceLastSpin);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userId, lastSpinTime]);

  // Format time remaining
  const formatTimeRemaining = (ms) => {
    if (!ms) return "";
    
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Share on WhatsApp function
  const handleShareOnWhatsApp = () => {
    if (!pendingWin) return;
    
    const winAmount = pendingWin.label;
    const shareMessage = `🎉 I just won ${winAmount} on InstaCoinXPay Fortune Wheel! 🎰\n\nJoin me and get 50 USDT welcome bonus! Use my referral code: ${referralCode}\n\nSign up here: https://www.instacoinxspay.xyz//spinwheelhome\n\n#InstaCoinXPay #Crypto #Win`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
    
    // After sharing, credit the prize
    creditPrize();
  };

  // Share with 2 members (simulated - user will share multiple times)
  const handleShareWithTwoMembers = () => {
    if (!pendingWin) return;
    
    const winAmount = pendingWin.label;
    const shareMessage = `🎉 I just won ${winAmount} on InstaCoinXPay Fortune Wheel! 🎰\n\nJoin me and get 50 USDT welcome bonus! Use my referral code: ${referralCode}\n\nSign up here:https://www.instacoinxspay.xyz//spinwheelhome\n\n#InstaCoinXPay #Crypto #Win`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
    
    // Show message to share with another person
    alert("✅ First share sent! Now share with one more person to claim your prize.");
    
    // Close modal after second share (in real scenario, you might want to track actual shares)
    setTimeout(() => {
      creditPrize();
    }, 1000);
  };

  // Credit the prize
  const creditPrize = async () => {
    if (!pendingWin) return;
    
    setIsClaiming(true);
    try {
      // Extract numeric amount from label (remove $ and K)
      const amountString = pendingWin.label.replace(/[^0-9]/g, "");
      let amount = Number(amountString);
      
      // Handle K notation (e.g., "100K" -> 100000)
      if (pendingWin.label.includes('K')) {
        amount = amount * 1000;
      }

      console.log('🎰 Claiming prize:', { userId, amount, label: pendingWin.label });

      const response = await fetch("https://backend-srtt.onrender.com/api/spin/credit-spin-reward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          amount: amount,
          prizeLabel: pendingWin.label
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setClaimMessage(`✅ ${pendingWin.label} credited to your account!`);
        
        // Update local user balance if available
        if (userData && userData.walletBalances) {
          userData.walletBalances.btc = data.data.totalBtcBalance;
          localStorage.setItem("user", JSON.stringify(userData));
        }
        
        // Update last spin time from server response
        if (data.data.lastSpinTime) {
          setLastSpinTime(data.data.lastSpinTime);
          setCanSpin(false);
        }
        
        // Close share modal
        setShowShareModal(false);
        setPendingWin(null);
      } else {
        setClaimMessage(`❌ ${data.error || 'Failed to claim prize'}`);
      }
    } catch (error) {
      console.error('Claim error:', error);
      setClaimMessage("❌ Error claiming prize. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleSpin = () => {
    if (isSpinning || !canSpin || !userId) return;
    
    setResult(null);
    setClaimMessage("");

    const extra  = 1440 + Math.floor(Math.random() * 360);
    const newRot = rotRef.current + extra;
    rotRef.current = newRot;
    setRotation(newRot);
    setIsSpinning(true);

    setTimeout(async () => {
      const finalRotation = rotRef.current;
      const actualDeg = finalRotation % 360;

      let winningIndex = Math.floor(((360 - actualDeg) % 360) / ANGLE) % NUM;
      let winningSegment = SEGMENTS[winningIndex];

      // 🎯 Ensure we never land on lose
      if (winningSegment.type === "lose") {
        let nextWinningIndex = winningIndex;
        let steps = 0;

        while (steps < NUM) {
          nextWinningIndex = (nextWinningIndex + 1) % NUM;
          if (SEGMENTS[nextWinningIndex].type !== "lose") {
            break;
          }
          steps++;
        }

        const adjustment =
          ((nextWinningIndex - winningIndex) * ANGLE + 360) % 360;

        rotRef.current += adjustment;
        setRotation(rotRef.current);

        // 🔥 IMPORTANT: Recalculate after adjustment
        const adjustedDeg = rotRef.current % 360;
        winningIndex = Math.floor(((360 - adjustedDeg) % 360) / ANGLE) % NUM;
        winningSegment = SEGMENTS[winningIndex];
      }

      setIsSpinning(false);
      setResult(winningSegment);

      // ✅ SHOW SHARE MODAL IF WIN (instead of auto-claiming)
      if (winningSegment.type !== "lose") {
        setPendingWin(winningSegment);
        setShowShareModal(true);
      } else {
        // For lose, just update last spin time
        try {
          await fetch("https://backend-srtt.onrender.com/api/spin/credit-spin-reward", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              amount: 0,
              prizeLabel: "Better Luck"
            }),
          });
        } catch (error) {
          console.error("Error updating spin time:", error);
        }
      }
    }, 5000);
  };

  const isWin  = result && result.type !== "lose";
  const isMega = result && result.type === "mega";

  if (loading) {
    return (
      <div className="sw-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: '20px', textShadow: '0 0 10px #f7931a' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="sw-page">
      {/* Back Button */}
      <button 
        className="sw-back-btn"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        ←
      </button>

      <div className="sw-bg-glow" />

      <div className="sw-title-block">
        <div className="sw-eyebrow">★ &nbsp; Try Your Luck &nbsp; ★</div>
        <h1 className="sw-title">Fortune Wheel</h1>
      </div>

      {/* Cooldown Timer Display */}
      {!canSpin && timeRemaining && (
        <div className="sw-cooldown">
          ⏳ Next spin available in: {formatTimeRemaining(timeRemaining)}
        </div>
      )}

      <div className={`sw-wheel-frame ${isSpinning ? "spinning" : ""}`}>
        {/* Static ring layer */}
        <div className="sw-layer">
          <OuterRing />
        </div>

        {/* Rotating disc layer */}
        <div className="sw-layer sw-disc" style={{ transform: `rotate(${rotation}deg)` }}>
          <WheelInner />
        </div>

        {/* Center button */}
        <button
          className={`sw-spin-btn ${isSpinning ? "active" : ""} ${!canSpin ? "disabled" : ""}`}
          onClick={handleSpin}
          disabled={isSpinning || !canSpin || !userId}
        >
          {isSpinning ? "●●●" : !canSpin ? "COOLDOWN" : "SPIN"}
        </button>
      </div>

      {/* Cooldown Message */}
      {!canSpin && !isSpinning && (
        <div className="sw-cooldown-message">
          <p style={{ margin: '0 0 5px 0', color: '#f7931a', fontWeight: 'bold' }}>
            ⏰ Spin Cooldown Active
          </p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            You can spin again after {formatTimeRemaining(timeRemaining)}
          </p>
        </div>
      )}

      {!userId && (
        <div className="sw-cooldown-message" style={{ borderColor: '#f7931a' }}>
          Please login to spin the wheel
        </div>
      )}

      {result && !isSpinning && !showShareModal && (
        <div className={`sw-result sw-result--${result.type}`}>
          <div className="sw-result-badge">
            {isMega ? "🏆 JACKPOT!" : isWin ? "✓ YOU WON" : "✕ TRY AGAIN"}
          </div>
          <div className="sw-result-label">{result.label}</div>
          {isWin && <div className="sw-result-sub">{result.sublabel}</div>}
          
          {/* Claim Status Message */}
          {claimMessage && (
            <div 
              className="sw-claim-message" 
              style={{
                backgroundColor: claimMessage.includes('✅') ? '#1a3a1a' : 
                               claimMessage.includes('❌') ? '#3a1a1a' : '#3a2a0a',
                color: claimMessage.includes('✅') ? '#9ae6b4' : 
                       claimMessage.includes('❌') ? '#feb2b2' : '#fbd38d',
                border: claimMessage.includes('✅') ? '1px solid #22c55e' : 
                       claimMessage.includes('❌') ? '1px solid #ef4444' : '1px solid #f59e0b'
              }}
            >
              {claimMessage}
            </div>
          )}
          
          <button 
            className="sw-result-btn" 
            onClick={() => {
              setResult(null);
              setClaimMessage("");
            }}
          >
            {isWin ? "Play Again" : "Spin Again"}
          </button>
        </div>
      )}

      {/* Share Modal for Winners */}
      {showShareModal && pendingWin && (
        <div className="sw-share-modal-overlay">
          <div className="sw-share-modal">
            <div className="sw-share-header">
              <span className="sw-share-icon">🎉</span>
              <h2>Share Your Win!</h2>
            </div>
            
            <div className="sw-share-content">
              <p className="sw-share-message">
                You won <span className="sw-share-amount">{pendingWin.label}</span>!
              </p>
              <p className="sw-share-instruction">
                Share on WhatsApp with 2 friends and your referral code to claim your prize:
              </p>
              
              <div className="sw-share-code">
                <strong>Your Referral Code:</strong>
                <div className="sw-code-box">{referralCode}</div>
              </div>
              
              <div className="sw-share-buttons">
                <button 
                  className="sw-share-btn whatsapp"
                  onClick={handleShareOnWhatsApp}
                  disabled={isClaiming}
                >
                  <span>📱</span> Share on WhatsApp
                </button>
                
                <button 
                  className="sw-share-btn share-two"
                  onClick={handleShareWithTwoMembers}
                  disabled={isClaiming}
                >
                  <span>👥</span> Share with 2 Members
                </button>
              </div>
              
              <p className="sw-share-note">
                <small>Share with 2 people to unlock your prize!</small>
              </p>
              
              {isClaiming && (
                <div className="sw-claiming">
                  Processing your prize...
                </div>
              )}
            </div>
            
            <button 
              className="sw-share-close"
              onClick={() => setShowShareModal(false)}
              disabled={isClaiming}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}