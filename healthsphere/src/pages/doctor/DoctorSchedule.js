import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Filter } from 'lucide-react';
import './DoctorSchedule.css';

export default function DoctorSchedule() {
  const { currentUser, appointments } = useData();
  const [dateFilter, setDateFilter] = useState('');

  // Filtering and sorting logic
  const myApts = appointments
    .filter(a => currentUser?.role === 'nurse' || a.doctorId === currentUser?.id)
    .filter(a => !dateFilter || a.date === dateFilter)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  return (
    <div className="doctor-schedule-container">
      <div className="page-header">
        <h1 className="page-title">My Schedule</h1>
        <p className="page-subtitle">View your assigned appointments</p>
      </div>

      {/* Filter Section */}
      <div className="doctor-schedule-filter-card">
        <Filter size={18} className="doctor-schedule-filter-icon" />
        <input 
          type="date" 
          value={dateFilter} 
          onChange={e => setDateFilter(e.target.value)}
          className="doctor-schedule-date-input" 
        />
        {dateFilter && (
          <button 
            onClick={() => setDateFilter('')} 
            className="doctor-schedule-clear-btn"
          >
            Clear
          </button>
        )}
      </div>

      {/* Schedule Table */}
      <div className="doctor-schedule-table-card">
        <div className="doctor-schedule-table-wrapper">
          <table className="doctor-schedule-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Patient</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myApts.map(apt => (
                <tr key={apt.id}>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>
                  <td>{apt.patientName}</td>
                  <td>{apt.reason}</td>
                  <td>
                    <span className={`doctor-schedule-status-badge ${apt.status}`}>
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {myApts.length === 0 && (
            <p className="doctor-schedule-empty">
              No appointments found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}