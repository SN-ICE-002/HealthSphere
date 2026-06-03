import React from 'react';
import { useData } from '../../context/DataContext';
import { Check, X } from 'lucide-react';
import './DoctorAppointements.css';

export default function DoctorAppointments() {
  const { currentUser, appointments, setAppointments } = useData();
  
  // Filter appointments specifically for the logged-in doctor, or show all for nurses
  const myApts = currentUser?.role === 'nurse' 
    ? appointments 
    : appointments.filter(a => a.doctorId === currentUser?.id);

  // Status update function (TypeScript type for 'id' and 'status' removed)
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/${id}/status`, {

        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setAppointments(prev => 
          prev.map(a => (a.id === id ? { ...a, status } : a))
        );
      } else {
        console.error('Failed to update status on server');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="doctor-appointments-container">
      <div className="page-header">
        <h1 className="page-title">Appointment Management</h1>
        <p className="page-subtitle">Approve, complete, or cancel appointments</p>
      </div>

      <div className="doctor-appointments-card">
        <div className="doctor-appointments-table-wrapper">
          <table className="doctor-appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>,
              </tr>
            </thead>
            <tbody>
              {myApts.map(apt => (
                <tr key={apt.id}>
                  <td>{apt.patientName}</td>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>
                  <td>{apt.reason}</td>
                  <td>
                    <span className={`doctor-apt-status-badge ${apt.status}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    {apt.status === 'scheduled' && (
                      <div className="doctor-apt-actions">
                        <button 
                          onClick={() => updateStatus(apt.id, 'completed')} 
                          className="doctor-apt-action-btn success"
                          title="Complete Appointment"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={() => updateStatus(apt.id, 'cancelled')} 
                          className="doctor-apt-action-btn danger"
                          title="Cancel Appointment"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {myApts.length === 0 && (
            <p className="doctor-apt-empty-state">No appointments found</p>
          )}
        </div>
      </div>
    </div>
  );
}