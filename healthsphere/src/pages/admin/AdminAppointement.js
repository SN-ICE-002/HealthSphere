import React from 'react';
import { useData } from '../../context/DataContext';
import { X, Check } from 'lucide-react';
import './AdminAppointement.css';

export default function AdminAppointments() {
  const { appointments, setAppointments } = useData();

  // Updated to call backend API
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {

        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      } else {
        console.error('Failed to update status on server');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="admin-appointments-container">
      <div className="page-header">
        <h1 className="page-title">Appointment Control</h1>
        <p className="page-subtitle">View and manage all appointments</p>
      </div>

      <div className="admin-appointments-card">
        <div className="admin-appointments-table-wrapper">
          <table className="admin-appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th className="hidden-mobile">Date</th>
                <th className="hidden-mobile">Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(apt => (
                <tr key={apt.id}>
                  <td>{apt.patientName}</td>
                  <td>{apt.doctorName}</td>
                  <td className="hidden-mobile">{apt.date}</td>
                  <td className="hidden-mobile">{apt.time}</td>
                  <td>
                    <span className={`admin-apt-status-badge ${apt.status}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-apt-actions">
                      {apt.status !== 'completed' && (
                        <button 
                          onClick={() => updateStatus(apt.id, 'completed')} 
                          className="admin-apt-action-btn success"
                        >
                          <Check size={14} />
                        </button>
                      )}
                      {apt.status !== 'cancelled' && (
                        <button 
                          onClick={() => updateStatus(apt.id, 'cancelled')} 
                          className="admin-apt-action-btn danger"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <p className="admin-apt-empty-state">No appointments</p>
          )}
        </div>
      </div>
    </div>
  );
}