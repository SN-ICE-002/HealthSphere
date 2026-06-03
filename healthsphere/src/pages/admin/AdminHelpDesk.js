import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { 
  MessageSquare, Calendar, CheckCircle, 
  Send, Key, Search, Filter, MessageCircle, 
  ChevronRight
} from 'lucide-react';
import './AdminHelpDesk.css';

export default function AdminHelpDesk() {
  const { getHelpRequests, respondToHelpRequest } = useData();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetPassword, setResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const data = await getHelpRequests();
    setRequests(data);
    setLoading(false);
  }, [getHelpRequests]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!adminResponse) return;

    setLoading(true);
    const result = await respondToHelpRequest({
      requestId: selectedRequest.id,
      adminResponse,
      resetPassword,
      newPassword: resetPassword ? newPassword : null
    });

    if (result.success) {
      alert('Response sent and request resolved.');
      setAdminResponse('');
      setNewPassword('');
      setResetPassword(false);
      setSelectedRequest(null);
      fetchRequests();
    } else {
      alert('Failed to send response: ' + result.message);
    }
    setLoading(false);
  };

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'all' || req.status === filter;
    const matchesSearch = req.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (req.full_name && req.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-helpdesk-container">
      <div className="admin-helpdesk-header">
        <div className="header-title">
          <h1>Help Desk Requests</h1>
          <p>Manage patient support and password reset requests</p>
        </div>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <Filter size={18} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-helpdesk-content">
        {/* Sidebar: Request List */}
        <div className="requests-sidebar">
          {loading && requests.length === 0 ? (
            <div className="loading-state">Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="empty-state">No requests found.</div>
          ) : (
            filteredRequests.map(req => (
              <div 
                key={req.id} 
                className={`request-card ${selectedRequest?.id === req.id ? 'active' : ''} ${req.status}`}
                onClick={() => setSelectedRequest(req)}
              >
                <div className="request-card-info">
                  <div className="card-top">
                    <span className="user-name">{req.full_name || 'Guest User'}</span>
                    <span className={`status-pill ${req.status}`}>{req.status}</span>
                  </div>
                  <div className="card-email">{req.email}</div>
                  <div className="card-subject">{req.subject}</div>
                </div>
                <ChevronRight size={18} className="card-arrow" />
              </div>
            ))
          )}
        </div>

        {/* Main Content: Chat / Detail View */}
        <div className="request-detail">
          {selectedRequest ? (
            <div className="detail-view">
              <div className="detail-header">
                <div className="user-profile">
                  <div className="user-avatar">
                    {(selectedRequest.full_name || selectedRequest.email)[0].toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h3>{selectedRequest.full_name || 'Guest User'}</h3>
                    <p>{selectedRequest.email}</p>
                  </div>
                </div>
                <div className="request-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{new Date(selectedRequest.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="chat-container">
                <div className="chat-bubble patient">
                  <div className="bubble-header">Patient Message</div>
                  <p>{selectedRequest.message}</p>
                </div>

                {selectedRequest.admin_response && (
                  <div className="chat-bubble admin">
                    <div className="bubble-header">Your Response</div>
                    <p>{selectedRequest.admin_response}</p>
                    {selectedRequest.status === 'resolved' && (
                      <div className="resolved-marker">
                        <CheckCircle size={14} /> Request Resolved
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedRequest.status === 'pending' && (
                <form className="admin-reply-form" onSubmit={handleRespond}>
                  <div className="form-title">
                    <MessageCircle size={18} />
                    Respond to Patient
                  </div>
                  
                  <textarea 
                    placeholder="Type your message here... (e.g., Your password has been reset to [NewPassword])"
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    required
                  ></textarea>

                  <div className="password-reset-section">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={resetPassword} 
                        onChange={(e) => setResetPassword(e.target.checked)} 
                      />
                      <span>Perform secure password reset for this user</span>
                    </label>

                    {resetPassword && (
                      <div className="password-input-group">
                        <div className="input-with-icon">
                          <Key size={16} />
                          <input 
                            type="text" 
                            placeholder="Enter new temporary password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required={resetPassword}
                          />
                        </div>
                        <p className="hint">This will permanently update their login credentials.</p>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="send-btn" disabled={loading}>
                    <Send size={18} />
                    {loading ? 'Processing...' : 'Resolve & Send Response'}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <div className="no-selection-content">
                <MessageSquare size={64} />
                <h3>Select a request to start</h3>
                <p>Choose a help desk ticket from the sidebar to view details and respond.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
