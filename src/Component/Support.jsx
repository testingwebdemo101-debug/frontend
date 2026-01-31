import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Support.css";
import logo from "../assets/logo.png";

const Support = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    description: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // IMAGE PREVIEW ONLY
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("https://backend-instacoinpay-1.onrender.com/api/support", formData);

      setMessage("✅ Support ticket submitted successfully");
      setFormData({ email: "", subject: "", description: "" });
      setPreview(null);
    } catch (error) {
      setMessage(error.response?.data?.error || "❌ Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page-wrapper">
      <header className="support-header-section">
        <div className="support-logo-container">
          <img src={logo} alt="help-logo" />
        </div>
      </header>


      <div className="support-form-card">
        <span className="supportpage-back" onClick={() => navigate(-1)}>←</span> 
         <h1 className="support-title">SUPPORT</h1>
        <form onSubmit={handleSubmit}>
          <div className="support-form-group">
            <label>Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="support-form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="support-form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* OPTIONAL IMAGE PREVIEW */}
          <div className="support-form-group">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="preview" className="support-preview-image" />}
          </div>

          <button className="support-submit-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>

          {message && <p className="support-message-text">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Support;