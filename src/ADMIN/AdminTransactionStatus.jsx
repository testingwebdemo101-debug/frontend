import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminTransactionStatus.css";

const AdminTransactionStatus = () => {
  const [transactions, setTransactions] = useState([]);
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  // =====================
  // FETCH PENDING TX FROM API
  // =====================
  const fetchPendingTransactions = async () => {
    try {
      const res = await axios.get(
        "https://backend-srtt.onrender.com/api/admin-transactions/pending-transactions"
      );

      const formatted = (res.data.data || []).map((tx) => ({
        ...tx,
        confirmations: tx.confirmations || [false, false, false, false],
        status: "pending"
      }));

      setTransactions(formatted);
    } catch (err) {
      console.error("Failed to load pending transactions", err);
    }
  };

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  // =====================
  // UI ACTIONS (LOCAL ONLY)
  // =====================
  const handleStatusChange = (id, newStatus) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === id ? { ...tx, status: newStatus } : tx
      )
    );
  };

  const handleConfirmationToggle = (transactionId, index) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === transactionId) {
          const updated = [...tx.confirmations];
          updated[index] = !updated[index];
          return { ...tx, confirmations: updated };
        }
        return tx;
      })
    );
  };

  // =====================
  // SUBMIT (POPUP ADDED)
  // =====================
  const handleSubmit = async (id) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    try {
      await axios.put(
        `https://backend-srtt.onrender.com/api/admin-transactions/transaction/${id}/status`,
        {
          status: tx.status,
          confirmations: tx.confirmations
        }
      );

      // ✅ POPUP AFTER DB UPDATE
      alert("Transaction updated successfully");

      // ✅ REMOVE ONLY IF APPROVED OR REJECTED
      if (tx.status === "approved" || tx.status === "rejected") {
        setTransactions((prev) =>
          prev.filter((t) => t.id !== id)
        );
      }

      // ✅ PENDING → KEEP TRANSACTION (CONFIRMATIONS SAVED)

    } catch (err) {
      console.error("Failed to update transaction", err);
      alert("Failed to update transaction");
    }
  };

  const toggleTransactionDetails = (id) => {
    setExpandedTransaction(expandedTransaction === id ? null : id);
  };

  return (
    <div className="admin-transaction-management">
      <header className="management-header">
        <h1>Pending Transactions</h1>
      </header>

      <div className="transactions-container">
        <div className="table-header-row">
          <div className="header-cell user-name">User Name</div>
          <div className="header-cell user-email">Email</div>
          <div className="header-cell transaction-datetime">Date/Time</div>
          <div className="header-cell transaction-status">Status</div>
          <div className="header-cell view-actions">Actions</div>
        </div>

        {transactions.length === 0 && (
          <p style={{ padding: "20px", textAlign: "center" }}>
            No pending transactions
          </p>
        )}

        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-row-item">
            <div
              className="transaction-summary-row"
              onClick={() => toggleTransactionDetails(transaction.id)}
            >
              <div className="summary-cell user-info">
                <span className="user-initial-circle">
                  {transaction.name?.charAt(0) || "U"}
                </span>
                <span className="user-full-name">
                  {transaction.name}
                </span>
              </div>

              <div className="summary-cell email-address">
                {transaction.email}
              </div>

              <div className="summary-cell date-time-info">
                <div className="transaction-date">{transaction.date}</div>
                <div className="transaction-time">{transaction.time}</div>
              </div>

              <div className="summary-cell status-info">
                <span className="status-indicator pending">
                  PENDING
                </span>
              </div>

              <div className="summary-cell toggle-actions">
                <button className="expand-details-btn">
                  {expandedTransaction === transaction.id ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {expandedTransaction === transaction.id && (
              <div className="transaction-full-details">
                <div className="details-panel-content">

                  <div className="details-panel-section">
                    <h4>Transaction Details</h4>
                    <div className="details-grid-layout">
                      <div className="detail-grid-item">
                        <span className="detail-title">Transaction ID:</span>
                        <span className="detail-data">
                          {transaction.txid}
                        </span>
                      </div>

                      <div className="detail-grid-item">
                        <span className="detail-title">Amount:</span>
                        <span className="detail-data amount-value">
                          {transaction.amount}
                        </span>
                      </div>

                      <div className="detail-grid-item">
                        <span className="detail-title">Method:</span>
                        <span className="detail-data payment-method">
                          {transaction.method}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="details-panel-section">
                    <h4>Transaction Status</h4>
                    <div className="status-action-buttons">
                      <button
                        className={`status-action-btn approve-btn ${
                          transaction.status === "approved" ? "active-state" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(transaction.id, "approved");
                        }}
                      >
                        Approve
                      </button>

                      <button
                        className={`status-action-btn reject-btn ${
                          transaction.status === "rejected" ? "active-state" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(transaction.id, "rejected");
                        }}
                      >
                        Reject
                      </button>

                      <button
                        className={`status-action-btn pending-btn ${
                          transaction.status === "pending" ? "active-state" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(transaction.id, "pending");
                        }}
                      >
                        Pending
                      </button>
                    </div>
                  </div>

                  <div className="details-panel-section">
                    <h4>Confirmations</h4>
                    <div className="confirmation-selection">
                      {transaction.confirmations.map((checked, index) => (
                        <label key={index} className="confirmation-option-label">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              handleConfirmationToggle(transaction.id, index)
                            }
                          />
                          Confirmation {index + 1}
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    className="submit-changes-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmit(transaction.id);
                    }}
                  >
                    Submit Changes
                  </button>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTransactionStatus;
