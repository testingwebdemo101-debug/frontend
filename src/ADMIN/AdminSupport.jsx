import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminSupport.css";

const API_URL = "http://localhost:5000/api/support";

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===============================
     FETCH ALL SUPPORT TICKETS
  ================================ */
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setTickets(res.data.data || []);
    } catch (err) {
      setError("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  /* ===============================
     RESOLVE TICKET (ADMIN ACTION)
  ================================ */
  const handleAction = async (id) => {
    const action = prompt("Enter action taken by admin:");
    if (!action) return;

    try {
      await axios.put(`${API_URL}/${id}`, {
        status: "resolved",
        actionTaken: action,
      });

      alert("Ticket resolved successfully");
      fetchTickets();
    } catch (error) {
      alert("Failed to update ticket");
    }
  };

  /* SORT BY LATEST FIRST */
  const sortedTickets = [...tickets].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="admin-support-page">
      <h2>Customer Support Tickets (Admin)</h2>

      {loading && (
        <p className="admin-support-info-text">Loading tickets...</p>
      )}
      {error && (
        <p className="admin-support-error-text">{error}</p>
      )}

      {!loading && sortedTickets.length === 0 && (
        <p className="admin-support-info-text">
          No support tickets found
        </p>
      )}

      {sortedTickets.map((ticket) => (
        <div
          key={ticket._id}
          className="admin-support-ticket-card"
        >
          <div className="admin-support-ticket-header">
            <strong>Ticket #{ticket._id}</strong>
            <span
              className={`admin-support-status ${
                ticket.status === "open" ? "open" : "resolved"
              }`}
            >
              {ticket.status.toUpperCase()}
            </span>
          </div>

          <p>
            <b>User Email:</b> {ticket.email}
          </p>
          <p>
            <b>Subject:</b> {ticket.subject}
          </p>
          <p>
            <b>Description:</b> {ticket.description}
          </p>

          {ticket.actionTaken && (
            <p className="admin-support-action-taken">
              <b>Action Taken:</b> {ticket.actionTaken}
            </p>
          )}

          <p>
            <b>Created At:</b>{" "}
            {new Date(ticket.createdAt).toLocaleString()}
          </p>

          {ticket.status === "open" && (
            <button
              className="admin-support-action-btn"
              onClick={() => handleAction(ticket._id)}
            >
              Resolve Ticket
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
