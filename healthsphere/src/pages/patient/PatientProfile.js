import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { User, Save, AlertCircle } from 'lucide-react';
import './PatientProfile.css';

export default function PatientProfile() {

  const { currentUser } = useData();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use the logged-in patient's DB id, fallback to 5 (John Doe) for demo
        const patientId = currentUser?.role === 'patient' && !isNaN(currentUser?.id)
          ? currentUser.id
          : 5;

        const res = await fetch(`http://localhost:5000/api/patients/${patientId}/records`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
        setPhone(data.contact_number || '');
        setAddress(data.address || '');
      } catch (err) {
        setError('Could not load profile. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleSave = async () => {
    setError('');
    if (!phone.trim()) { setError('Phone is required'); return; }

    try {
      const patientId = currentUser?.role === 'patient' && !isNaN(currentUser?.id)
        ? currentUser.id
        : 5;

      const res = await fetch(`http://localhost:5000/api/admin/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.full_name,
          email: profile.email,
          phone,
          dob: profile.date_of_birth,
          bloodType: profile.blood_type
        })
      });

      if (res.ok) {
        setProfile(prev => ({ ...prev, contact_number: phone }));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError('Failed to save changes');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading profile...</p>;
  if (error && !profile) return <p className="text-muted-foreground">{error}</p>;
  if (!profile) return <p className="text-muted-foreground">Patient not found</p>;

  return (
    <div className="patient-profile-container">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">View and update your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <User size={40} />
          </div>
          <h2 className="profile-name">{profile.full_name}</h2>
          <p className="profile-email">{profile.email}</p>
          
          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">DOB</span>
              <span className="profile-info-value">
                {profile.date_of_birth
                  ? new Date(profile.date_of_birth).toLocaleDateString()
                  : '—'}
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Blood Type</span>
              <span className="profile-info-value">{profile.blood_type || '—'}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Emergency</span>
              <span className="profile-info-value">{profile.emergency_contact_name || '—'}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Emerg. #</span>
              <span className="profile-info-value">{profile.emergency_contact_number || '—'}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="profile-edit-card lg:col-span-2">
          <h2 className="profile-edit-title">Edit Information</h2>

          {error && (
            <div className="profile-error-alert">
              <AlertCircle className="profile-alert-icon" />
              <span>{error}</span>
            </div>
          )}
          
          {saved && (
            <div className="profile-success-alert">
              <Save className="profile-alert-icon" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div className="profile-form-group">
            <label className="profile-label">Phone</label>
            <input 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              className="profile-input"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="profile-form-group">
            <label className="profile-label">Address</label>
            <input 
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="profile-input"
              placeholder="Enter your address"
            />
          </div>
          <button 
            onClick={handleSave}
            className="profile-save-button"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}