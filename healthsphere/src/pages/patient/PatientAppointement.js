import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, X, AlertCircle, Check } from 'lucide-react';
import './PatientAppointement.css';

export default function PatientAppointments() {

  const { currentUser } = useData();

  const [myAppointments, setMyAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Use the logged-in patient's DB id; fallback to 5 (John Doe) for demo
  const patientId = currentUser?.role === 'patient' && !isNaN(currentUser?.id)
    ? currentUser.id
    : 5;

  // Fetch patient's appointments and available doctors from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load this patient's appointments
        const aptsRes = await fetch(`http://localhost:5000/api/appointments/patient/${patientId}`);
        const aptsData = await aptsRes.json();
        if (Array.isArray(aptsData)) setMyAppointments(aptsData);

        // Load all doctors from the admin staff endpoint
        const staffRes = await fetch(`http://localhost:5000/api/admin/staff`);
        const staffData = await staffRes.json();
        if (Array.isArray(staffData)) {
          setDoctors(staffData.filter(s => s.role === 'doctor'));
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!doctor) { setError('Please select a doctor'); return; }
    if (!date) { setError('Please select a date'); return; }
    if (!time) { setError('Please select a time'); return; }
    if (!reason.trim()) { setError('Please enter a reason'); return; }

    if (new Date(date) < new Date(new Date().toISOString().split('T')[0])) {
      setError('Cannot book past dates');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          doctorId: parseInt(doctor),
          date,
          time,
          reason
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Find doctor name for immediate UI update
        const selectedDoctor = doctors.find(d => String(d.id) === String(doctor));
        const newApt = { ...data, doctorName: selectedDoctor?.name || 'Doctor' };

        setMyAppointments(prev => [newApt, ...prev]);
        setSuccess('Appointment booked successfully!');
        setShowForm(false);
        setDoctor(''); setDate(''); setTime(''); setReason('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Is the backend running?');
    }
  };

  const handleCancel = async (id) => {
    // Only call API if id is a real DB integer
    if (!isNaN(id)) {
      try {
        await fetch(`http://localhost:5000/api/appointments/${id}/cancel`, { method: 'PATCH' });
      } catch (err) {
        console.error('Cancel error:', err);
      }
    }
    setMyAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a)
    );
  };

  if (loading) return <p className="text-muted-foreground">Loading appointments...</p>;

  return (
    <div className="patient-appointments-container">
      <div className="page-header">
        <div className="patient-appointments-title-group">
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">Manage your appointments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="patient-appointments-book-btn"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'Book Appointment'}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="patient-appointments-alert error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="patient-appointments-alert success">
          <Check size={16} />
          <span>{success}</span>
        </div>
      )}

      {/* Booking Form */}
      {showForm && (
        <div className="patient-appointments-form-card">
          <h2 className="patient-appointments-form-title">Book New Appointment</h2>
          <form onSubmit={handleBook} className="patient-appointments-form-grid">
            <div className="patient-appointments-form-group">
              <label className="patient-appointments-label">Doctor</label>
              <select
                value={doctor}
                onChange={e => setDoctor(e.target.value)}
                className="patient-appointments-select"
              >
                <option value="">Select a doctor</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="patient-appointments-form-group">
              <label className="patient-appointments-label">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="patient-appointments-input"
              />
            </div>
            <div className="patient-appointments-form-group">
              <label className="patient-appointments-label">Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="patient-appointments-input"
              />
            </div>
            <div className="patient-appointments-form-group">
              <label className="patient-appointments-label">Reason</label>
              <input
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Reason for visit"
                className="patient-appointments-input"
              />
            </div>
            <div className="patient-appointments-form-group full-width">
              <button type="submit" className="patient-appointments-confirm-btn">
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appointments List */}
      <div className="patient-appointments-table-card">
        <div className="patient-appointments-table-wrapper">
          <table className="patient-appointments-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myAppointments.map(apt => (
                <tr key={apt.id}>
                  <td>{apt.doctorName}</td>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>
                  <td>{apt.reason}</td>
                  <td>
                    <span className={`patient-appointments-status-badge ${apt.status}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    {apt.status === 'scheduled' && (
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="patient-appointments-cancel-btn"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {myAppointments.length === 0 && (
            <p className="patient-appointments-empty-state">No appointments found</p>
          )}
        </div>
      </div>
    </div>
  );
}