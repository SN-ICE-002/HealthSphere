import React from 'react';
import { useData } from '../../context/DataContext';
import { AlertTriangle, User } from 'lucide-react';
import './DoctorEmergency.css';

export default function DoctorEmergency() {
  const { emergencyMode, setEmergencyMode, patients } = useData();

  return (
    <div className="doctor-emergency-container">
      <div className="page-header">
        <h1 className="page-title">Emergency Mode 🚨</h1>
        <p className="page-subtitle">Quick access to critical patient information</p>
      </div>

      {/* Emergency Toggle Card */}
      <div className="doctor-emergency-banner">
        <div className="doctor-emergency-content">
          <AlertTriangle 
            size={24} 
            className={`doctor-emergency-icon ${emergencyMode ? 'active' : ''}`}
          />
          <div className="doctor-emergency-text">
            <p>
              {emergencyMode ? 'Emergency Mode ACTIVE' : 'Emergency Mode OFF'}
            </p>
            <p>
              Toggle to access all patient records instantly
            </p>
          </div>
        </div>
        <button 
          onClick={() => setEmergencyMode(!emergencyMode)}
          className={`doctor-emergency-btn ${emergencyMode ? 'active' : 'inactive'}`}
        >
          {emergencyMode ? 'Deactivate' : 'Activate'}
        </button>
      </div>

      {/* Conditional Patient List */}
      {emergencyMode && (
        <div className="doctor-emergency-grid">
          {patients.map(p => (
            <div key={p.id} className="doctor-emergency-patient-card">
              <div className="doctor-emergency-patient-header">
                <div className="doctor-emergency-patient-avatar">
                  <User size={20} />
                </div>
                <div className="doctor-emergency-patient-info">
                  <p className="doctor-emergency-patient-name">{p.name}</p>
                  <p className="doctor-emergency-patient-meta">
                    {p.bloodType} • {p.gender}
                  </p>
                </div>
              </div>
              
              <div className="doctor-emergency-patient-details">
                <div className="doctor-emergency-patient-detail">
                  <span className="doctor-emergency-detail-label">Allergies:</span>
                  <span className="doctor-emergency-detail-value">{p.allergies?.join(', ') || 'None'}</span>
                </div>
                <div className="doctor-emergency-patient-detail">
                  <span className="doctor-emergency-detail-label">Conditions:</span>
                  <span className="doctor-emergency-detail-value">{p.medicalHistory?.join(', ') || 'None'}</span>
                </div>
                <div className="doctor-emergency-patient-detail">
                  <span className="doctor-emergency-detail-label">Medications:</span>
                  <span className="doctor-emergency-detail-value">{p.prescriptions?.map(r => r.medication).join(', ') || 'None'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}