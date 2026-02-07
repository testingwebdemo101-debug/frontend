import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminReport.css";

export default function AdminReport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Get admin token (adjust if you store token differently)
  const token = localStorage.getItem("token");

  /* ===============================
     GET ALL REPORTS (ADMIN)
  ================================ */
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://backend-srtt.onrender.com/api/reports", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTickets(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  /* ===============================
     RESOLVE REPORT (ADMIN)
  ================================ */
  const handleAction = async (id) => {
    const actionTaken = prompt("Enter action taken by admin:");
    if (!actionTaken) return;

    try {
      await axios.put(
        `https://backend-srtt.onrender.com/api/reports/${id}/resolve`,
        { actionTaken },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update UI instantly
      setTickets((prev) =>
        prev.map((t) =>
          t._id === id
            ? { ...t, status: "RESOLVED", actionTaken }
            : t
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.error || "Failed to resolve report"
      );
    }
  };

  // Timeline: latest first
  const sortedTickets = [...tickets].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="Admin-report-page">
      <h2 className="report-title">
        Customer Support Reports (Admin)
      </h2>

      {loading && <p>Loading reports...</p>}
      {error && <p className="error-text">{error}</p>}

      {sortedTickets.map((ticket, index) => (
        <div key={ticket._id} className="Admin-report-card">
          <div className="report-row">
            <strong>Ticket #{index + 1}</strong>
            <span
              className={
                ticket.status === "OPEN"
                  ? "status-open"
                  : "status-resolved"
              }
            >
              {ticket.status}
            </span>
          </div>

          <p><b>User Email:</b> {ticket.userEmail}</p>
          <p><b>Reported Email:</b> {ticket.reportedEmail}</p>
          <p><b>Description:</b> {ticket.description}</p>
          <p>
            <b>Created At:</b>{" "}
            {new Date(ticket.createdAt).toLocaleString()}
          </p>

          {ticket.actionTaken && (
            <p className="action-text">
              <b>Action Taken:</b> {ticket.actionTaken}
            </p>
          )}

          {ticket.status === "OPEN" && (
            <button
              className="action-btn"
              onClick={() => handleAction(ticket._id)}
            >
              Action Taken
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
