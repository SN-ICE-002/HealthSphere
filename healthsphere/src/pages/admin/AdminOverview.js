import React from 'react';
import { useData } from '../../context/DataContext';
import { Users, UserCheck, Calendar, ShieldAlert, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './AdminOverview.css';

const COLORS = ['#4338ca', '#0d9488', '#f59e0b', '#dc2626'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#0f172a'
      }}>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>{label}</p>
        <p style={{ margin: '0.25rem 0 0', color: '#4338ca', fontSize: '1rem' }}>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function AdminOverview() {
  const { patients, staff, appointments, emergencyMode } = useData();

  const statusData = [
    { name: 'Scheduled', value: appointments.filter(a => a.status === 'scheduled').length },
    { name: 'Completed', value: appointments.filter(a => a.status === 'completed').length },
    { name: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length },
  ];

  const roleData = [
    { name: 'Doctors', value: staff.filter(s => s.role === 'doctor').length },
    { name: 'Nurses',  value: staff.filter(s => s.role === 'nurse').length },
    { name: 'Admins',  value: staff.filter(s => s.role === 'admin').length },
  ];

  return (
    <div className="admin-overview-container">

      {/* ── Hero Banner ─────────────────────────────────── */}
      <div className="aov-hero">
        <div className="aov-hero-circles" />
        <div className="aov-hero-content">
          <h1>Admin Dashboard 🏥</h1>
          <p>System overview &nbsp;·&nbsp; Analytics &amp; Insights</p>
        </div>
        <div className="aov-hero-right">
          <div className="aov-system-status">
            <span className={`aov-status-dot ${emergencyMode ? 'emergency' : 'online'}`} />
            {emergencyMode ? 'Emergency Active' : 'Systems Online'}
          </div>
        </div>
      </div>

      {/* ── Emergency Banner ────────────────────────────── */}
      {emergencyMode && (
        <div className="admin-overview-emergency-banner">
          🚨 EMERGENCY MODE ACTIVE — All systems on high alert
        </div>
      )}

      {/* ── Top Stats Row ───────────────────────────────── */}
      <div className="admin-overview-stats-grid">

        <div className="admin-overview-stat-card patients">
          <div className="aov-card-row">
            <div>
              <p className="admin-overview-stat-label">Total Patients</p>
              <p className="admin-overview-stat-value">{patients.length}</p>
              <p className="admin-overview-stat-change positive">
                <TrendingUp size={12} /> ↑ 12% from last month
              </p>
            </div>
            <div className="aov-card-icon">
              <UserCheck size={22} />
            </div>
          </div>
        </div>

        <div className="admin-overview-stat-card staff">
          <div className="aov-card-row">
            <div>
              <p className="admin-overview-stat-label">Staff Members</p>
              <p className="admin-overview-stat-value">{staff.length}</p>
              <p className="admin-overview-stat-change positive">
                <TrendingUp size={12} /> ↑ 2 new hires
              </p>
            </div>
            <div className="aov-card-icon">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="admin-overview-stat-card appointments">
          <div className="aov-card-row">
            <div>
              <p className="admin-overview-stat-label">Appointments</p>
              <p className="admin-overview-stat-value">{appointments.length}</p>
              <p className="admin-overview-stat-change positive">
                <TrendingUp size={12} /> ↑ 8% increase
              </p>
            </div>
            <div className="aov-card-icon">
              <Calendar size={22} />
            </div>
          </div>
        </div>

        <div className="admin-overview-stat-card reports">
          <div className="aov-card-row">
            <div>
              <p className="admin-overview-stat-label">Emergency</p>
              <p className="admin-overview-stat-value">{emergencyMode ? 'ON' : 'OFF'}</p>
              <p className="admin-overview-stat-change">
                {emergencyMode ? '⚠ Active mode' : '✓ Normal mode'}
              </p>
            </div>
            <div className="aov-card-icon">
              <ShieldAlert size={22} />
            </div>
          </div>
        </div>

      </div>

      {/* ── Charts Section ──────────────────────────────── */}
      <div className="admin-overview-content-grid">

        {/* Bar Chart */}
        <div className="admin-overview-section">
          <h2>Appointments by Status</h2>
          <div className="admin-overview-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData} barSize={42}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4338ca" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="admin-overview-section">
          <h2>Staff by Role</h2>
          <div className="admin-overview-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="45%"
                  outerRadius={100}
                  innerRadius={52}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  stroke="none"
                >
                  {roleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: '#475569', fontSize: '0.82rem', fontWeight: 600 }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}