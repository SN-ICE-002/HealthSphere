import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Mail, MessageSquare, AlertCircle, CheckCircle, ArrowLeft, Send, Search, Clock } from 'lucide-react';
import LogoImage from '../image/Logo.png';
import './ForgotPassword.css';

export default function HelpDesk() {
  const [view, setView] = useState('request'); // 'request' or 'status'
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const { submitHelpRequest, checkRequestStatus } = useData();

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !message) {
      setError('Email and message are required');
      setLoading(false);
      return;
    }

    try {
      const result = await submitHelpRequest(email, 'Password Reset Request', message);
      if (result.success) {
        setSuccess('Your request has been sent to the Help Desk. Our admin will review it shortly.');
        setMessage('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email to check status');
      setLoading(false);
      return;
    }

    try {
      const result = await checkRequestStatus(email);
      setRequests(result);
      if (result.length === 0) {
        setError('No requests found for this email.');
      }
    } catch (err) {
      setError('Failed to fetch requests.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-wrapper">
        <div className="forgot-card-container">
          <div className="forgot-header">
            <div className="forgot-logo">
              <img src={LogoImage} alt="HealthSphere Logo" className="app-logo" />
            </div>
            <h1>Help Desk Support</h1>
            <p>
              {view === 'request' 
                ? "Send a message to our administrators for assistance" 
                : "Enter your email to check the status of your requests"}
            </p>
          </div>

          <div className="view-toggle">
            <button 
              className={view === 'request' ? 'active' : ''} 
              onClick={() => { setView('request'); setError(''); setSuccess(''); }}
            >
              Submit Request
            </button>
            <button 
              className={view === 'status' ? 'active' : ''} 
              onClick={() => { setView('status'); setError(''); setSuccess(''); }}
            >
              Check Status
            </button>
          </div>

          <div className="forgot-form-card">
            {error && (
              <div className="login-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="forgot-success">
                <CheckCircle size={16} />
                <span>{success}</span>
              </div>
            )}

            {view === 'request' ? (
              <form onSubmit={handleSubmitRequest}>
                <div className="forgot-form-group">
                  <label className="login-label">Email Address</label>
                  <div className="login-input-wrapper">
                    <Mail />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      className="login-input"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="forgot-form-group">
                  <label className="login-label">Message</label>
                  <div className="login-input-wrapper textarea-wrapper">
                    <MessageSquare className="textarea-icon" />
                    <textarea 
                      value={message} 
                      onChange={e => setMessage(e.target.value)}
                      className="login-input login-textarea"
                      placeholder="Example: I forgot my password. Can you please reset it? My name is..."
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="login-button">
                  <Send size={18} />
                  {loading ? 'Sending...' : 'Send to Admin'}
                </button>
              </form>
            ) : (
              <div className="status-viewer">
                <form onSubmit={handleCheckStatus} className="status-search">
                  <div className="login-input-wrapper">
                    <Mail />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      className="login-input"
                      placeholder="Enter your email"
                      required
                    />
                    <button type="submit" disabled={loading} className="search-btn">
                      <Search size={18} />
                    </button>
                  </div>
                </form>

                <div className="request-list">
                  {requests.map(req => (
                    <div key={req.id} className={`request-item ${req.status}`}>
                      <div className="request-item-header">
                        <span className="request-date">
                          <Clock size={12} />
                          {new Date(req.created_at).toLocaleDateString()}
                        </span>
                        <span className={`status-badge ${req.status}`}>{req.status}</span>
                      </div>
                      <div className="request-message">
                        <strong>Your Message:</strong>
                        <p>{req.message}</p>
                      </div>
                      {req.admin_response && (
                        <div className="admin-chat-response">
                          <strong>Admin Response:</strong>
                          <p>{req.admin_response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && <p className="loading-text">Loading...</p>}
                </div>
              </div>
            )}
          </div>

          <div className="forgot-footer">
            <Link to="/" className="back-to-login">
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
