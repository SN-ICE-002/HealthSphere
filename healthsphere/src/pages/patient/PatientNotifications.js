import React from 'react';
import { useData } from '../../context/DataContext';
import { Bell, Check } from 'lucide-react';
import './PatientNotifications.css';

export default function PatientNotifications() {
  const { currentUser, notifications, setNotifications } = useData();
  
  // Filter notifications for the current user
  const myNotifications = notifications.filter(n => n.userId === currentUser?.id);

  // Mark a specific notification as read
  const markRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Mark all of the current user's notifications as read
  const markAllRead = () => {
    setNotifications(prev => 
      prev.map(n => n.userId === currentUser?.id ? { ...n, read: true } : n)
    );
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div className="notifications-title-group">
          <h1>Notifications</h1>
          <p>Stay updated on your health</p>
        </div>
        <button 
          onClick={markAllRead} 
          className="mark-all-read-btn"
        >
          <Check size={18} /> Mark All Read
        </button>
      </div>

      <div className="notifications-card-container">
        {myNotifications.length === 0 ? (
          <div className="notifications-empty-state">
            <p className="notifications-empty-text">No notifications</p>
          </div>
        ) : (
          <div className="notifications-list">
            {myNotifications.map(n => (
              <div 
                key={n.id} 
                className={`notification-item ${n.read ? 'read' : 'unread'}`}
                onClick={() => markRead(n.id)}
              >
                <Bell 
                  size={18} 
                  className={`notification-icon ${
                    n.type === 'medication' ? 'medication' : 
                    n.type === 'alert' ? 'alert' : 'info'
                  }`}
                />
                <div className="notification-content">
                  <p className="notification-message">
                    {n.message}
                  </p>
                  <p className="notification-date">{n.date}</p>
                </div>
                {!n.read && (
                  <div className="notification-indicator" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}