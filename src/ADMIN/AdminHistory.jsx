import { useEffect, useState } from "react";

export default function AdminHistory() {
  const [transactions, setTransactions] = useState([]);
  const [searchTxid, setSearchTxid] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://backend-srtt.onrender.com/api/transfer/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Map backend data → UI format
          const formatted = data.data.map((tx) => ({
            id: tx._id,
            txid: tx.transactionId,
            type:
              tx.toUser && tx.fromUser
                ? "TRANSFER"
                : "UNKNOWN",
            amount: `${tx.amount} ${tx.asset.toUpperCase()}`,
            date: new Date(tx.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }),
            status: tx.status.toUpperCase(),
            sender: {
              name: tx.fromUser?.fullName || "N/A",
              email: tx.fromUser?.email || "N/A",
              wallet: tx.fromAddress
            },
            receiver: {
              name: tx.toUser?.fullName || "N/A",
              email: tx.toUser?.email || "N/A",
              wallet: tx.toAddress
            }
          }));

          setTransactions(formatted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  // Search by TxID
  const filteredTransactions = transactions.filter((tx) =>
    tx.txid?.toLowerCase().includes(searchTxid.toLowerCase())
  );

  return (
    <>
      {/* INLINE CSS */}
      <style>
        {`
          .history-page {
            min-height: 100vh;
            background: #020617;
            padding: 30px;
            color: #ffffff;
            display: flex;
            justify-content: center;
          }

          .history-container {
            width: 100%;
            max-width: 800px;
          }

          .history-card {
            background: #0f172a;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
          }

          .history-row {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            margin-bottom: 8px;
          }

          .credit {
            color: #22c55e;
            font-weight: bold;
          }

          .debit {
            color: #ef4444;
            font-weight: bold;
          }

          .admin-status {
            color: #38bdf8;
            font-weight: bold;
          }

          .search-box {
            width: 100%;
            padding: 10px 12px;
            margin: 15px 0 25px;
            border-radius: 8px;
            border: none;
            outline: none;
            font-size: 14px;
          }

          hr {
            border: none;
            border-top: 1px solid #334155;
            margin: 15px 0;
          }

          h4 {
            margin-top: 10px;
            margin-bottom: 5px;
            color: #cbd5f5;
          }

          p {
            margin: 3px 0;
            font-size: 14px;
            color: #e5e7eb;
          }

          .no-data {
            text-align: center;
            color: #94a3b8;
            margin-top: 40px;
          }
        `}
      </style>

      <div className="history-page">
        <div className="history-container">
          <h2>Transaction History</h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search by Transaction ID (TxID)"
            className="search-box"
            value={searchTxid}
            onChange={(e) => setSearchTxid(e.target.value)}
          />

          {loading ? (
            <p className="no-data">Loading transactions...</p>
          ) : filteredTransactions.length === 0 ? (
            <p className="no-data">No transaction found</p>
          ) : (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="history-card">
                <div className="history-row">
                  <strong className="credit">TRANSFER</strong>
                  <span>{tx.amount}</span>
                </div>

                <p><strong>TxID:</strong> {tx.txid}</p>
                <p>Date: {tx.date}</p>
                <p>
                  Status: <span className="admin-status">{tx.status}</span>
                </p>

                <hr />

                <h4>Sender Details</h4>
                <p>Name: {tx.sender.name}</p>
                <p>Email: {tx.sender.email}</p>
                <p>Wallet: {tx.sender.wallet}</p>

                <h4>Receiver Details</h4>
                <p>Name: {tx.receiver.name}</p>
                <p>Email: {tx.receiver.email}</p>
                <p>Wallet: {tx.receiver.wallet}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
