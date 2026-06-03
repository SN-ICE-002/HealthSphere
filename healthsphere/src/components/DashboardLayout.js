import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  LayoutDashboard, User, FileText, Calendar, Bell, Users, Clock,
  AlertTriangle, BarChart3, LogOut, Menu, X, Shield, Headphones
} from 'lucide-react';
import LogoImage from '../image/Logo.png';

const navByRole = {
  patient: [
    { label: 'Overview', path: '/patient', icon: <LayoutDashboard size={20} /> },
    { label: 'My Profile', path: '/patient/profile', icon: <User size={20} /> },
    { label: 'Medical Records', path: '/patient/records', icon: <FileText size={20} /> },
    { label: 'Appointments', path: '/patient/appointments', icon: <Calendar size={20} /> },
    { label: 'Notifications', path: '/patient/notifications', icon: <Bell size={20} /> },
  ],
  doctor: [
    { label: 'Overview', path: '/doctor', icon: <LayoutDashboard size={20} /> },
    { label: 'My Schedule', path: '/doctor/schedule', icon: <Clock size={20} /> },
    { label: 'Patients', path: '/doctor/patients', icon: <Users size={20} /> },
    { label: 'Appointments', path: '/doctor/appointments', icon: <Calendar size={20} /> },
    { label: 'Emergency', path: '/doctor/emergency', icon: <AlertTriangle size={20} /> },
  ],
  nurse: [
    { label: 'Overview', path: '/doctor', icon: <LayoutDashboard size={20} /> },
    { label: 'My Schedule', path: '/doctor/schedule', icon: <Clock size={20} /> },
    { label: 'Patients', path: '/doctor/patients', icon: <Users size={20} /> },
    { label: 'Appointments', path: '/doctor/appointments', icon: <Calendar size={20} /> },
    { label: 'Emergency', path: '/doctor/emergency', icon: <AlertTriangle size={20} /> },
  ],
  admin: [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Patients', path: '/admin/patients', icon: <Users size={20} /> },
    { label: 'Staff', path: '/admin/staff', icon: <Shield size={20} /> },
    { label: 'Appointments', path: '/admin/appointments', icon: <Calendar size={20} /> },
    { label: 'Reports', path: '/admin/reports', icon: <BarChart3 size={20} /> },
    { label: 'Emergency', path: '/admin/emergency', icon: <AlertTriangle size={20} /> },
    { label: 'Help Desk', path: '/admin/help-desk', icon: <Headphones size={20} /> },
  ],
};

export default function DashboardLayout({ children }) {
  const { currentUser, logout, emergencyMode } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!currentUser) return null;

  const navItems = navByRole[currentUser.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-main-wrapper" data-sidebar-open={sidebarOpen}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{ background: 'hsl(var(--sidebar-bg))' }}
      >
        <div className="p-5 flex items-center gap-3">
          <div 
            className="w-10 h-10 flex items-center justify-center" 
          >
            <img src={LogoImage} alt="HealthSphere Logo" className="app-logo-small" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span className="font-heading text-lg font-bold" style={{ color: 'hsl(var(--sidebar-active-fg))' }}>
            HealthSphere
          </span>
          <button 
            className="sidebar-toggle-btn sidebar-close-btn" 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            style={{ color: 'hsl(var(--sidebar-fg))' }}
          >
            <X size={20} />
          </button>
        </div>

        {emergencyMode && (
          <div className="mx-4 mb-3 emergency-banner text-xs">🚨 EMERGENCY MODE</div>
        )}

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer-card">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">
              {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div className="sidebar-user-details">
              <p className="sidebar-user-name" title={currentUser.name}>
                {currentUser.name}
              </p>
              <p className="sidebar-user-role">
                {currentUser.role}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="sidebar-logout-btn" 
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-content-wrapper">
        <header className="dashboard-header">
          <button 
            className="sidebar-toggle-btn lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <span className="text-sm text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </header>
        <div className="dashboard-main-content max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}