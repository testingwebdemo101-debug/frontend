import { useEffect, useState } from "react";
import API from "../api/api"; // ✅ USE YOUR AXIOS INSTANCE

export default function AdminPendingCard() {
  const [activated, setActivated] = useState([]);
  const [pending, setPending] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await API.get("/debit-card/admin/active-pending");
      const data = res.data.data;

      setActivated(data.filter((u) => u.status === "ACTIVATE"));
      setPending(data.filter((u) => u.status === "PENDING"));
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  const filterByEmail = (list) =>
    list.filter((u) =>
      u.email.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      <style>{`
        .admin-page {
          min-height: 100vh;
          background: #020617;
          padding: 30px;
          color: white;
        }
        .search-box {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: none;
          margin-bottom: 25px;
        }
        .columns {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .column {
          background: #0f172a;
          border-radius: 14px;
          padding: 20px;
        }
        .user-card {
          background: #020617;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 10px;
        }
        .badge-active {
          color: #22c55e;
          font-weight: bold;
        }
        .badge-pending {
          color: #facc15;
          font-weight: bold;
        }
        .empty {
          text-align: center;
          color: #94a3b8;
        }
        @media (max-width: 768px) {
          .columns {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="admin-page">
        <h2>Card Users Status</h2>

        <input
          className="search-box"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="columns">
          {/* ACTIVATED USERS */}
          <div className="column">
            <h3 className="badge-active">Activated Users</h3>

            {filterByEmail(activated).length === 0 ? (
              <p className="empty">No activated users</p>
            ) : (
              filterByEmail(activated).map((u) => (
                <div key={u._id} className="user-card">
                  <p><b>Name:</b> {u.fullName}</p>
                  <p><b>Email:</b> {u.email}</p>
                  <p><b>Card:</b> {u.cardType || "—"}</p>
                  <span className="badge-active">Activated</span>
                </div>
              ))
            )}
          </div>

          {/* PENDING USERS */}
          <div className="column">
            <h3 className="badge-pending">Pending Users</h3>

            {filterByEmail(pending).length === 0 ? (
              <p className="empty">No pending users</p>
            ) : (
              filterByEmail(pending).map((u) => (
                <div key={u._id} className="user-card">
                  <p><b>Name:</b> {u.fullName}</p>
                  <p><b>Email:</b> {u.email}</p>
                  <p><b>Card:</b> {u.cardType || "—"}</p>
                  <span className="badge-pending">Pending</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
