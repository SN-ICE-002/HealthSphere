import React from 'react';
import { useData } from '../../context/DataContext';
import { Calendar, Bell, Activity, Clock, Stethoscope } from 'lucide-react';
import './PatientOverview.css';

export default function PatientOverview() {
  const { currentUser, appointments, notifications, patients } = useData();

  const patient = patients.find(p => p.id === currentUser?.id);
  const myAppointments = appointments.filter(
    a => a.patientId === currentUser?.id && a.status === 'scheduled'
  );
  const myNotifications = notifications.filter(
    n => n.userId === currentUser?.id && !n.read
  );

  // Get current date for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="patient-overview-container">

      {/* ── Hero Banner ──────────────────────────────────── */}
      <div className="pov-hero">
        <div className="pov-hero-text">
          <h1>{greeting}, {currentUser?.name?.split(' ')[0]} 👋</h1>
          <p>Here's your personalised health summary for today.</p>
        </div>
        <div className="pov-hero-badge">
          <span className="pov-dot" />
          Active Patient
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────────── */}
      <div className="patient-overview-stats-grid">

        <div className="patient-overview-stat-card">
          <div className="patient-overview-stat-icon">
            <Calendar size={22} />
          </div>
          <div>
            <p className="patient-overview-stat-value">{myAppointments.length}</p>
            <p className="patient-overview-stat-label">Upcoming Appointments</p>
          </div>
        </div>

        <div className="patient-overview-stat-card warning">
          <div className="patient-overview-stat-icon">
            <Bell size={22} />
          </div>
          <div>
            <p className="patient-overview-stat-value">{myNotifications.length}</p>
            <p className="patient-overview-stat-label">Unread Notifications</p>
          </div>
        </div>

        <div className="patient-overview-stat-card success">
          <div className="patient-overview-stat-icon">
            <Activity size={22} />
          </div>
          <div>
            <p className="patient-overview-stat-value">{patient?.bloodType || 'N/A'}</p>
            <p className="patient-overview-stat-label">Blood Type</p>
          </div>
        </div>

        <div className="patient-overview-stat-card info">
          <div className="patient-overview-stat-icon">
            <Clock size={22} />
          </div>
          <div>
            <p className="patient-overview-stat-value">{patient?.prescriptions?.length || 0}</p>
            <p className="patient-overview-stat-label">Active Prescriptions</p>
          </div>
        </div>

      </div>

      {/* ── Content sections ─────────────────────────────── */}
      <div className="patient-content-grid">

        {/* Upcoming Appointments */}
        <div className="patient-card">
          <h2><Calendar size={16} />Upcoming Appointments</h2>
          {myAppointments.length === 0 ? (
            <p className="text-muted-foreground text-sm">No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {myAppointments.map(apt => (
                <div key={apt.id} className="patient-appointment-item">
                  <div className="patient-appointment-time">{apt.date}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{apt.doctorName}</p>
                    <p className="text-xs text-muted-foreground">{apt.reason}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-medium">{apt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notifications */}
        <div className="patient-card">
          <h2><Bell size={16} />Recent Notifications</h2>
          {myNotifications.length === 0 ? (
            <p className="text-muted-foreground text-sm">No new notifications</p>
          ) : (
            <div className="space-y-3">
              {myNotifications.map(n => (
                <div key={n.id} className={`patient-notification-item ${n.type}`}>
                  <div className="patient-notification-icon">
                    {n.type === 'medication'
                      ? <Stethoscope size={16} />
                      : <Bell size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{n.message}</p>
                    <p className="text-xs text-muted-foreground" style={{ marginTop: '0.25rem' }}>
                      {n.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}