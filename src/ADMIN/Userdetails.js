import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Userdetails.css";

const API = "https://backend-srtt.onrender.com/api/admin";

const Userdetails = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ SEARCH STATE (NO LOGIC CHANGE)
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    setUsers(res.data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const saveUser = async () => {
    await axios.put(
      `${API}/users/${editingUser._id}`,
      editingUser,
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setEditingUser(null);
    setIsModalOpen(false);
    fetchUsers();
  };

  const suspendUser = async (id) => {
    const reason = prompt("Reason for suspension?");
    if (!reason) return;

    await axios.put(
      `${API}/users/${id}/suspend`,
      { reason },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchUsers();
  };

  const unsuspendUser = async (id) => {
    await axios.put(
      `${API}/users/${id}/unsuspend`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user permanently?")) return;

    await axios.delete(`${API}/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    fetchUsers();
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
  };

  // ✅ FILTER USERS (RENDER ONLY)
  const filteredUsers = users.filter(u =>
    `${u.fullName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <div className="header-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>User Management</h2>
          <div className="stats-info">
            <span className="stat-badge">Total Users: {users.length}</span>
          </div>
        </div>

        {/* ✅ SEARCH BAR (TOP RIGHT) */}
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            fontSize: "14px",
            width: "240px"
          }}
        />
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u._id}>
                <td data-label="Name">
                  <div className="user-info">
                    <div className="avatar-placeholder">
                      {u.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="user-name">{u.fullName}</span>
                  </div>
                </td>
                <td data-label="Email">{u.email}</td>
                <td data-label="Status">
                  <span className={`status-badge ${u.isSuspended ? 'suspended' : 'active'}`}>
                    {u.isSuspended ? "Suspended" : "Active"}
                  </span>
                </td>
                <td data-label="Actions">
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEditClick(u)}>
                      ✏️ Edit
                    </button>

                    {!u.isSuspended ? (
                      <button className="btn-suspend" onClick={() => suspendUser(u._id)}>
                        ⏸️ Suspend
                      </button>
                    ) : (
                      <button className="btn-unsuspend" onClick={() => unsuspendUser(u._id)}>
                        ▶️ Unsuspend
                      </button>
                    )}

                    <button className="btn-delete" onClick={() => deleteUser(u._id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && editingUser && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  value={editingUser.fullName || ""}
                  onChange={e =>
                    setEditingUser({ ...editingUser, fullName: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  value={editingUser.country || ""}
                  onChange={e =>
                    setEditingUser({ ...editingUser, country: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={editingUser.email || ""} disabled />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="btn-save" onClick={saveUser}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userdetails;
