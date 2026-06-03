import React from 'react';
import { useData } from '../../context/DataContext';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './AdminReports.css';

export default function AdminReports() {
  const { patients, staff, appointments } = useData();

  // Appointments per day
  const aptByDate = {};
  appointments.forEach(a => { 
    aptByDate[a.date] = (aptByDate[a.date] || 0) + 1; 
  });
  
  const aptData = Object.entries(aptByDate)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  // Staff workload
  const workload = staff
    .filter(s => s.role === 'doctor' || s.role === 'nurse')
    .map(s => ({
      name: s.name.split(' ').slice(-1)[0],
      appointments: appointments.filter(a => a.doctorId === s.id).length,
    }));

  // Patient growth (by createdAt month)
  const growthMap = {};
  patients.forEach(p => {
    const month = p.createdAt ? String(p.createdAt).substring(0, 7) : 'Unknown'; // YYYY-MM
    growthMap[month] = (growthMap[month] || 0) + 1;
  });
  
  const growthData = Object.entries(growthMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({ month, patients: count }));

  return (
    <div className="admin-reports-container">
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <p className="page-subtitle">Data-driven insights</p>
      </div>

      <div className="admin-reports-grid">
        {/* Daily Appointments Chart */}
        <div className="admin-report-card">
          <h2 className="admin-report-title">Appointments per Day</h2>
          <div className="admin-report-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderColor: '#e0e0e0',
                    borderRadius: '8px' 
                  }} 
                />
                <Bar dataKey="count" fill="#4CAF50" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff Workload Chart */}
        <div className="admin-report-card">
          <h2 className="admin-report-title">Staff Workload</h2>
          <div className="admin-report-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workload}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderColor: '#e0e0e0',
                    borderRadius: '8px' 
                  }} 
                />
                <Bar dataKey="appointments" fill="#FFA500" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Long-term Patient Growth Chart */}
        <div className="admin-report-card">
          <h2 className="admin-report-title">Patient Growth</h2>
          <div className="admin-report-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderColor: '#e0e0e0',
                    borderRadius: '8px' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#4CAF50" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#4CAF50' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="admin-reports-stats">
        <div className="admin-stat-box">
          <p className="admin-stat-value">{patients.length}</p>
          <p className="admin-stat-label">Total Patients</p>
        </div>
        <div className="admin-stat-box">
          <p className="admin-stat-value">{staff.length}</p>
          <p className="admin-stat-label">Staff Members</p>
        </div>
        <div className="admin-stat-box">
          <p className="admin-stat-value">{appointments.length}</p>
          <p className="admin-stat-label">Total Appointments</p>
        </div>
      </div>
    </div>
  );
}