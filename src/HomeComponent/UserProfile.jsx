import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="profile-page">
        <p style={{ color: "#fff" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      
      {/* ✅ LOGO OUTSIDE CARD */}
      <div className="profile-logo-wrapper">
        <img src={logo} alt="InstaCoinXPay" className="profile-logo" />
      </div>

      {/* ✅ PROFILE CARD */}
      <div className="profile-card">
        <span
          className="user-profile-back"
          onClick={() => navigate(-1)}
        >
          ←
        </span>

        <h2 className="profile-title">User Profile</h2>

        <div className="profile-field">
          <label>Name</label>
          <input type="text" value={user.name || ""} disabled />
        </div>

        <div className="profile-field">
          <label>Email Address</label>
          <input type="email" value={user.email || ""} disabled />
        </div>

        <div className="profile-field">
          <label>Country</label>
          <input type="text" value={user.country || ""} disabled />
        </div>

        <Link to="/forgotpassword" style={{ textDecoration: "none" }}>
          <button className="reset-btn">Reset Password</button>
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
