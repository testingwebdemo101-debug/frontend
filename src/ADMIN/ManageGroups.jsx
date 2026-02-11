import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageGroups.css";

const API = "https://backend-srtt.onrender.com/api";

const ManageGroups = () => {
  const [autoGroups, setAutoGroups] = useState([]);
  const [selectedAutoGroup, setSelectedAutoGroup] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [customGroup, setCustomGroup] = useState("Coin-A");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= LOAD AUTO GROUPS ================= */
  useEffect(() => {
    axios
      .get(`${API}/bulk-groups`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAutoGroups(res.data.groups))
      .catch(console.error);
  }, [token]);

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    if (!selectedAutoGroup) return;

    setLoading(true);

    axios
      .get(`${API}/bulk-group/${selectedAutoGroup}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedAutoGroup, token]);

  /* ================= MOVE USER ================= */
  const handleAssign = async () => {
    if (!selectedUser) {
      alert("Please select a user first");
      return;
    }

    try {
      await axios.post(
        `${API}/assign-custom-group`,
        {
          userId: selectedUser,
          newGroup: customGroup,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("User moved successfully 🚀");

      // refresh users
      setSelectedUser(null);
      setSelectedAutoGroup("");
      setUsers([]);
    } catch (err) {
      alert("Error assigning group");
    }
  };

  return (
    <div className="manage-container">
      <div className="manage-card">
        <h2 className="manage-title">Move User To Custom Group</h2>

        {/* ===== AUTO GROUP SELECT ===== */}
        <div className="form-group">
          <label>Select Auto Group (100 Users)</label>
          <select
            value={selectedAutoGroup}
            onChange={(e) => setSelectedAutoGroup(e.target.value)}
          >
            <option value="">Select Group</option>
            {autoGroups.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* ===== USERS LIST ===== */}
        {selectedAutoGroup && (
          <div className="users-section">
            <h4>
              Users in {selectedAutoGroup}
              {loading && <span className="loading">Loading...</span>}
            </h4>

            <div className="user-list">
              {users.map((u) => (
                <label key={u._id} className="user-row">
                  <input
                    type="radio"
                    name="selectedUser"
                    value={u._id}
                    checked={selectedUser === u._id}
                    onChange={() => setSelectedUser(u._id)}
                  />
                  <div className="user-info">
                    <span className="user-name">
                      {u.fullName || "User"}
                    </span>
                    <span className="user-email">{u.email}</span>
                  </div>
                </label>
              ))}

              {users.length === 0 && !loading && (
                <p className="no-user">No users found</p>
              )}
            </div>
          </div>
        )}

        {/* ===== CUSTOM GROUP ===== */}
        <div className="form-group">
          <label>Move To</label>
          <select
            value={customGroup}
            onChange={(e) => setCustomGroup(e.target.value)}
          >
            <option value="Coin-A">Coin-A</option>
            <option value="Coin-B">Coin-B</option>
          </select>
        </div>

        <button onClick={handleAssign} className="assign-btn">
          Move User
        </button>
      </div>
    </div>
  );
};

export default ManageGroups;
