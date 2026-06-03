import React from 'react';
import { useData } from '../../context/DataContext';
import { Calendar, Users, AlertTriangle, Clock, Stethoscope } from 'lucide-react';
import './DoctorOverview.css';

export default function DoctorOverview() {
  const { currentUser, appointments, emergencyMode } = useData();

  const today = new Date().toISOString().split('T')[0];

  const todayApts = appointments.filter(
    (a) => (currentUser?.role === 'nurse' || a.doctorId === currentUser?.id) && a.date === today
  );

  const myPatientIds = [
    ...new Set(
      appointments
        .filter((a) => currentUser?.role === 'nurse' || a.doctorId === currentUser?.id)
        .map((a) => a.patientId)
    ),
  ];

  const scheduledCount = appointments.filter(
    (a) => (currentUser?.role === 'nurse' || a.doctorId === currentUser?.id) && a.status === 'scheduled'
  ).length;

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const roleLabel = currentUser?.role === 'nurse' ? 'Nurse' : 'Doctor';

  return (
    <div className="doctor-overview-container">

      {/* ── Hero Banner ────────────────────────────────── */}
      <div className="dov-hero">
        <div className="dov-hero-content">
          <h1>
            {greeting}, {currentUser?.name?.split(' ')[0]} 👋
          </h1>
          <p>
            {roleLabel} Dashboard &nbsp;·&nbsp; Here's your daily overview
          </p>
        </div>

        <div className="dov-hero-stats">
          <div className="dov-hero-mini">
            <span className="dov-hero-mini-val">{todayApts.length}</span>
            <span className="dov-hero-mini-lbl">Today</span>
          </div>
          <div className="dov-hero-mini">
            <span className="dov-hero-mini-val">{myPatientIds.length}</span>
            <span className="dov-hero-mini-lbl">Patients</span>
          </div>
        </div>
      </div>

      {/* ── Emergency Banner ───────────────────────────── */}
      {emergencyMode && (
        <div className="doctor-overview-emergency-banner">
          🚨 EMERGENCY MODE ACTIVE — All patient records accessible
        </div>
      )}

      {/* ── Stats Grid ─────────────────────────────────── */}
      <div className="doctor-overview-stats-grid">

        <div className="doctor-overview-stat-card primary">
          <div className="doctor-overview-stat-icon">
            <Calendar size={22} />
          </div>
          <div>
            <p className="doctor-overview-stat-value">{todayApts.length}</p>
            <p className="doctor-overview-stat-label">Today's Appointments</p>
          </div>
        </div>

        <div className="doctor-overview-stat-card success">
          <div className="doctor-overview-stat-icon">
            <Users size={22} />
          </div>
          <div>
            <p className="doctor-overview-stat-value">{myPatientIds.length}</p>
            <p className="doctor-overview-stat-label">My Patients</p>
          </div>
        </div>

        <div className="doctor-overview-stat-card warning">
          <div className="doctor-overview-stat-icon">
            <Clock size={22} />
          </div>
          <div>
            <p className="doctor-overview-stat-value">{scheduledCount}</p>
            <p className="doctor-overview-stat-label">Pending</p>
          </div>
        </div>

        <div className="doctor-overview-stat-card destructive">
          <div className="doctor-overview-stat-icon">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p className="doctor-overview-stat-value">{emergencyMode ? 'ON' : 'OFF'}</p>
            <p className="doctor-overview-stat-label">Emergency Mode</p>
          </div>
        </div>

      </div>

      {/* ── Today's Schedule ───────────────────────────── */}
      <div className="doctor-overview-schedule-section">
        <h2><Stethoscope size={16} />Today's Schedule</h2>

        {todayApts.length === 0 ? (
          <p className="doctor-overview-no-appointments">No appointments scheduled for today</p>
        ) : (
          <div className="doctor-overview-appointments-list">
            {todayApts.map((apt) => (
              <div key={apt.id} className="doctor-overview-appointment-item">
                <div className="doctor-overview-appointment-time">{apt.time}</div>
                <div className="doctor-overview-appointment-info">
                  <p className="doctor-overview-appointment-title">{apt.patientName}</p>
                  <p className="doctor-overview-appointment-reason">{apt.reason}</p>
                </div>
                <span className={`doctor-overview-appointment-badge ${apt.status}`}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}