import React from 'react';
import { useData } from '../../context/DataContext';
import { AlertTriangle, User } from 'lucide-react';
import './AdminEmergency.css';

export default function AdminEmergency() {
  const { emergencyMode, setEmergencyMode, patients } = useData();

  return (
    <div className="admin-emergency-container">
      <div className="page-header">
        <h1 className="page-title">Emergency Control 🚨</h1>
        <p className="page-subtitle">System-wide emergency management</p>
      </div>

      {/* Control Banner */}
      <div className="admin-emergency-banner">
        <div className="admin-emergency-content">
          <AlertTriangle 
            size={24} 
            className={`admin-emergency-icon ${emergencyMode ? 'active' : ''}`}
          />
          <div className="admin-emergency-text">
            <p>
              {emergencyMode ? 'Emergency Mode ACTIVE' : 'Emergency Mode OFF'}
            </p>
            <p>
              Activating grants all staff access to all patient records
            </p>
          </div>
        </div>
        <button 
          onClick={() => setEmergencyMode(!emergencyMode)}
          className={`admin-emergency-btn ${emergencyMode ? 'active' : 'inactive'}`}
        >
          {emergencyMode ? 'Deactivate' : 'Activate'} Emergency
        </button>
      </div>

      {/* Emergency Data Grid */}
      {emergencyMode && (
        <>
          <h2 className="admin-emergency-section-title">All Patient Records</h2>
          <div className="admin-emergency-grid">
            {patients.map(p => (
              <div key={p.id} className="admin-emergency-patient-card">
                <div className="admin-emergency-patient-header">
                  <div className="admin-emergency-patient-avatar">
                    <User size={20} />
                  </div>
                  <div className="admin-emergency-patient-info">
                    <p className="admin-emergency-patient-name">{p.name}</p>
                    <p className="admin-emergency-patient-meta">
                      {p.bloodType} • {p.gender} • {p.phone}
                    </p>
                  </div>
                </div>
                <div className="admin-emergency-patient-details">
                  <div className="admin-emergency-patient-detail">
                    <span className="admin-emergency-detail-label">Allergies:</span>
                    <span className="admin-emergency-detail-value">{p.allergies?.join(', ') || 'None'}</span>
                  </div>
                  <div className="admin-emergency-patient-detail">
                    <span className="admin-emergency-detail-label">Conditions:</span>
                    <span className="admin-emergency-detail-value">{p.medicalHistory?.join(', ') || 'None'}</span>
                  </div>
                  <div className="admin-emergency-patient-detail">
                    <span className="admin-emergency-detail-label">Meds:</span>
                    <span className="admin-emergency-detail-value">{p.prescriptions?.map(r => r.medication).join(', ') || 'None'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}