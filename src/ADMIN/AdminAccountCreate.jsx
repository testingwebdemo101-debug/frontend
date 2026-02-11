import { useState } from 'react';
import axios from 'axios';
import './AdminAccountCreate.css';

export default function AdminAccountCreate() {
  const [mode, setMode] = useState('single');
  const [singleUser, setSingleUser] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    country: '', 
    referral: '' 
  });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const token = localStorage.getItem('token');

  const createSingleUser = async () => {
    if (!singleUser.name || !singleUser.email || !singleUser.password || !singleUser.country) {
      return alert('Please fill all required fields');
    }

    try {
      const res = await axios.post(
        'https://backend-srtt.onrender.com/api/admin/users',
        singleUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setSingleUser({ name: '', email: '', password: '', country: '', referral: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating user');
    }
  };

  const uploadFile = async () => {
    if (!file) return alert('Please upload a CSV or Excel file');
    
    setIsUploading(true);
    setUploadResult(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(
        'https://backend-srtt.onrender.com/api/admin/users/upload',
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'multipart/form-data' 
          } 
        }
      );
      
      setUploadResult(res.data);
      setFile(null);
      
      // Reset file input
      document.getElementById('fileInput').value = '';
      
    } catch (err) {
      alert(err.response?.data?.error || 'Error uploading file');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      ['Name', 'Email', 'Country', 'ReferralCode', 'Password'],
      ['John Doe', 'john@example.com', 'USA', 'REF123', 'Default@123'],
      ['Jane Smith', 'jane@example.com', 'UK', '', 'Default@123'],
      ['Bob Wilson', 'bob@example.com', 'Canada', 'REF456', 'Default@123']
    ];

    let csvContent = template.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'user_template.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page">
      <div className="container">
        <h2>User Account Creation</h2>
        
        <div className="toggle">
          <button 
            className={mode === 'single' ? 'btnAccount active' : 'btn'} 
            onClick={() => setMode('single')}
          >
            Single User
          </button>
          <button 
            className={mode === 'multiple' ? 'btnAccount active' : 'btn'} 
            onClick={() => setMode('multiple')}
          >
            Multiple Users (File Upload)
          </button>
        </div>

        {mode === 'single' && (
          <div className="box">
            <input 
              placeholder="Name *" 
              value={singleUser.name} 
              onChange={e => setSingleUser({...singleUser, name: e.target.value})} 
            />
            <input 
              placeholder="Email *" 
              value={singleUser.email} 
              onChange={e => setSingleUser({...singleUser, email: e.target.value})} 
            />
            <input 
              placeholder="Password *" 
              type="password" 
              value={singleUser.password} 
              onChange={e => setSingleUser({...singleUser, password: e.target.value})} 
            />
            <input 
              placeholder="Country *" 
              value={singleUser.country} 
              onChange={e => setSingleUser({...singleUser, country: e.target.value})} 
            />
            <input 
              placeholder="Referral Code (Optional)" 
              value={singleUser.referral} 
              onChange={e => setSingleUser({...singleUser, referral: e.target.value})} 
            />
            <button onClick={createSingleUser} className="create-btn">
              Create User
            </button>
          </div>
        )}

        {mode === 'multiple' && (
          <div className="box">
            <div className="file-upload-section">
              <div className="upload-area">
                <input 
                  id="fileInput"
                  type="file" 
                  accept=".csv,.xlsx,.xls" 
                  onChange={e => setFile(e.target.files[0])}
                  className="file-input"
                />
                <div className="upload-info">
                  <p>Supported formats: CSV, Excel (.xlsx, .xls)</p>
                  <button onClick={downloadTemplate} className="template-btn">
                    Download Template
                  </button>
                </div>
              </div>
              
              {file && (
                <div className="file-info">
                  <p><strong>Selected File:</strong> {file.name}</p>
                  <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                </div>
              )}

              <button 
                onClick={uploadFile} 
                disabled={!file || isUploading}
                className={`upload-btn ${(!file || isUploading) ? 'disabled' : ''}`}
              >
                {isUploading ? 'Uploading...' : 'Upload & Create Users'}
              </button>

              {uploadResult && (
                <div className="upload-result">
                  <h4>Upload Result:</h4>
                  <p><strong>Total Processed:</strong> {uploadResult.total}</p>
                  <p><strong>Successfully Created:</strong> {uploadResult.created}</p>
                  <p><strong>Failed:</strong> {uploadResult.failed}</p>
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <div className="errors">
                      <h5>Errors:</h5>
                      <ul>
                        {uploadResult.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}