import { useEffect, useState } from "react";
import API from "../api/api"; // ✅ USE YOUR AXIOS INSTANCE

export default function AdminPendingCard() {
  const [activated, setActivated] = useState([]);
  const [pending, setPending] = useState([]);
  const [inactive, setInactive] = useState([]); // Add inactive state
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching cards from API...');
      const res = await API.get("/debit-card/admin/active-pending");
      console.log('API Response:', res.data);
      
      const data = res.data.data || [];
      console.log('All cards:', data);
      console.log('Card statuses:', data.map(c => c.status));

      // Filter based on status
      const activatedUsers = data.filter((u) => u.status === "ACTIVATE");
      const pendingUsers = data.filter((u) => u.status === "PENDING");
      const inactiveUsers = data.filter((u) => u.status === "INACTIVE");

      console.log('Activated:', activatedUsers.length);
      console.log('Pending:', pendingUsers.length);
      console.log('Inactive:', inactiveUsers.length);

      setActivated(activatedUsers);
      setPending(pendingUsers);
      setInactive(inactiveUsers);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError(err.message || "Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  const filterByEmail = (list) =>
    list.filter((u) =>
      u.email?.toLowerCase().includes(search.toLowerCase())
    );

  if (loading) {
    return (
      <div className="admin-page">
        <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div style={{ textAlign: 'center', padding: '50px', color: '#ef4444' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .admin-page {
          min-height: 100vh;
          background: #020617;
          padding: 20px;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .header h2 {
          margin: 0;
          font-size: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .refresh-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .refresh-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .search-box {
          width: 100%;
          max-width: 400px;
          padding: 12px 16px;
          border-radius: 12px;
          border: 2px solid #334155;
          background: #0f172a;
          color: white;
          font-size: 16px;
          margin-bottom: 25px;
          transition: all 0.3s ease;
        }
        
        .search-box:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }
        
        .search-box::placeholder {
          color: #64748b;
        }
        
        .stats {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }
        
        .stat-card {
          background: #0f172a;
          padding: 15px 25px;
          border-radius: 12px;
          flex: 1;
          min-width: 120px;
        }
        
        .stat-card h4 {
          margin: 0 0 5px 0;
          color: #94a3b8;
          font-size: 14px;
        }
        
        .stat-card p {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
        }
        
        .stat-card.activated p { color: #22c55e; }
        .stat-card.pending p { color: #facc15; }
        .stat-card.inactive p { color: #f97316; }
        
        .columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        
        .column {
          background: #0f172a;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #334155;
        }
        
        .column h3 {
          margin: 0 0 15px 0;
          padding-bottom: 10px;
          border-bottom: 2px solid #334155;
          font-size: 18px;
        }
        
        .activated-header { color: #22c55e; }
        .pending-header { color: #facc15; }
        .inactive-header { color: #f97316; }
        
        .user-card {
          background: #020617;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 10px;
          border: 1px solid #334155;
          transition: all 0.3s ease;
        }
        
        .user-card:hover {
          transform: translateX(5px);
          border-color: #667eea;
        }
        
        .user-card p {
          margin: 5px 0;
          font-size: 14px;
          color: #cbd5e1;
        }
        
        .user-card p b {
          color: white;
        }
        
        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 8px;
        }
        
        .badge-active {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid #22c55e;
        }
        
        .badge-pending {
          background: rgba(250, 204, 21, 0.2);
          color: #facc15;
          border: 1px solid #facc15;
        }
        
        .badge-inactive {
          background: rgba(249, 115, 22, 0.2);
          color: #f97316;
          border: 1px solid #f97316;
        }
        
        .empty {
          text-align: center;
          color: #64748b;
          padding: 30px;
          font-size: 14px;
        }
        
        @media (max-width: 1024px) {
          .columns {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .admin-page {
            padding: 15px;
          }
          
          .columns {
            grid-template-columns: 1fr;
          }
          
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .stats {
            flex-direction: column;
            gap: 10px;
          }
          
          .stat-card {
            width: 100%;
          }
        }
      `}</style>

      <div className="admin-page">
        <div className="header">
          <h2>💳 Card Users Status</h2>
          <button className="refresh-btn" onClick={fetchCards}>
            ⟳ Refresh
          </button>
        </div>

        {/* Stats Overview */}
        <div className="stats">
          <div className="stat-card activated">
            <h4>Activated</h4>
            <p>{activated.length}</p>
          </div>
          <div className="stat-card pending">
            <h4>Pending</h4>
            <p>{pending.length}</p>
          </div>
          <div className="stat-card inactive">
            <h4>Inactive (New)</h4>
            <p>{inactive.length}</p>
          </div>
        </div>

        <input
          className="search-box"
          placeholder="🔍 Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="columns">
          {/* ACTIVATED USERS */}
          <div className="column">
            <h3 className="activated-header">✅ Activated Users</h3>

            {filterByEmail(activated).length === 0 ? (
              <p className="empty">No activated users</p>
            ) : (
              filterByEmail(activated).map((u) => (
                <div key={u._id} className="user-card">
                  <p><b>Name:</b> {u.fullName || "—"}</p>
                  <p><b>Email:</b> {u.email}</p>
                  <p><b>Card:</b> {u.cardType || "—"}</p>
                  <span className="badge badge-active">✓ Activated</span>
                </div>
              ))
            )}
          </div>

          {/* PENDING USERS */}
          <div className="column">
            <h3 className="pending-header">⏳ Pending Users</h3>

            {filterByEmail(pending).length === 0 ? (
              <p className="empty">No pending users</p>
            ) : (
              filterByEmail(pending).map((u) => (
                <div key={u._id} className="user-card">
                  <p><b>Name:</b> {u.fullName || "—"}</p>
                  <p><b>Email:</b> {u.email}</p>
                  <p><b>Card:</b> {u.cardType || "—"}</p>
                  <span className="badge badge-pending">⏳ Pending</span>
                </div>
              ))
            )}
          </div>

          {/* INACTIVE USERS (NEW APPLICATIONS) */}
          <div className="column">
            <h3 className="inactive-header">🆕 New Applications</h3>

            {filterByEmail(inactive).length === 0 ? (
              <p className="empty">No new applications</p>
            ) : (
              filterByEmail(inactive).map((u) => (
                <div key={u._id} className="user-card">
                  <p><b>Name:</b> {u.fullName || "—"}</p>
                  <p><b>Email:</b> {u.email}</p>
                  <p><b>Card:</b> {u.cardType || "—"}</p>
                  <span className="badge badge-inactive">🆕 New</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}