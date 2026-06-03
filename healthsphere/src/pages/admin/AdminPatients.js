import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Pencil, Trash2, X, AlertCircle, Search, Key } from 'lucide-react';
import './AdminPatients.css';

export default function AdminPatients() {

  const { patients, setPatients } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    dob: '', 
    gender: 'Male', 
    bloodType: 'A+',
    emergencyContactName: '',
    emergencyContactNumber: ''
  });
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetPatient, setResetPatient] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const filtered = patients.filter(p =>
    (p.name || p.full_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => { 
    setForm({ name: '', email: '', phone: '', address: '', dob: '', gender: 'Male', bloodType: 'A+', emergencyContactName: '', emergencyContactNumber: '' }); 
    setEditing(null); 
    setShowForm(false); 
    setError(''); 
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return 'Valid email is required';
    if (!form.phone.trim()) return 'Phone is required';
    if (!form.dob) return 'Date of birth is required';
    return '';
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    try {
      if (editing) {
        // UPDATE existing patient in DB
        const response = await fetch(`http://localhost:5000/api/admin/patients/${editing.id}`, {

          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (response.ok) {
          setPatients(prev => prev.map(p => p.id === editing.id ? { ...p, ...form } : p));
          resetForm();
        } else {
          const data = await response.json();
          setError(data.message || 'Failed to update patient');
        }
      } else {
        // CREATE new patient in DB
        const response = await fetch(`http://localhost:5000/api/admin/patients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, password: 'patient123' }) // default password
        });
        const data = await response.json();
        if (response.ok) {
          setPatients(prev => [...prev, data.patient]);
          resetForm();
        } else {
          setError(data.message || 'Failed to create patient');
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Network error. Is the backend running?');
    }
  };

  const handleEdit = (p) => {
    setForm({ 
      name: p.name, 
      email: p.email, 
      phone: p.phone, 
      address: p.address, 
      dob: p.dob, 
      gender: p.gender, 
      bloodType: p.bloodType,
      emergencyContactName: p.emergencyContactName || p.emergency_contact_name || '',
      emergencyContactNumber: p.emergencyContactNumber || p.emergency_contact_number || ''
    });
    setEditing(p); 
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/patients/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPatients(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Failed to delete patient');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      alert('Please enter a new password');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/patients/${resetPatient.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });

      if (response.ok) {
        alert('Password reset successfully for ' + (resetPatient.name || resetPatient.full_name));
        setShowResetModal(false);
        setResetPatient(null);
        setNewPassword('');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Reset error:', err);
      alert('Network error. Is the backend running?');
    }
  };


  return (
    <div className="admin-patients-container">
      <div className="admin-patients-header">
        <div className="admin-patients-title-group">
          <h1 className="page-title">Patient Management</h1>
          <p className="page-subtitle">Add, edit, or remove patients</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }} 
          className="admin-patients-add-btn"
        >
          <Plus size={18} /> Add Patient
        </button>
      </div>

      {showForm && (
        <div className="admin-patients-form-card">
          <div className="admin-patients-form-header">
            <h2 className="admin-patients-form-title">
              {editing ? 'Edit Patient' : 'Add Patient'}
            </h2>
            <button onClick={resetForm} className="admin-patients-form-close-btn"><X size={20} /></button>
          </div>
          
          {error && (
            <div className="admin-patients-error">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="admin-patients-form-grid">
            <div className="admin-patients-form-group">
              <label className="admin-patients-label">Full Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" className="admin-patients-input" />
            </div>
            <div className="admin-patients-form-group">
              <label className="admin-patients-label">Email</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter email" type="email" className="admin-patients-input" />
            </div>
            <div className="admin-patients-form-group">
              <label className="admin-patients-label">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone" className="admin-patients-input" />
            </div>
            <div className="admin-patients-form-group">
              <label className="admin-patients-label">Address</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Enter address" className="admin-patients-input" />
            </div>
            <div className="admin-patients-form-group">
              <label className="admin-patients-label">Date of Birth</label>
              <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className="admin-patients-input" />
            </div>
            
            <div className="admin-patients-form-group">
              <label className="admin-patients-label">Gender</label>
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="admin-patients-select">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="admin-patients-form-group">
              <label className="admin-patients-label">Blood Type</label>
              <select value={form.bloodType} onChange={e => setForm({ ...form, bloodType: e.target.value })} className="admin-patients-select">
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => (
                  <option key={bt}>{bt}</option>
                ))}
              </select>
            </div>
            
            <div className="admin-patients-form-group">
              <label className="admin-patients-label">Emergency Name</label>
              <input value={form.emergencyContactName} onChange={e => setForm({ ...form, emergencyContactName: e.target.value })} placeholder="Enter emergency name" className="admin-patients-input" />
            </div>
            
            <div className="admin-patients-form-group">
              <label className="admin-patients-label">Emergency Number</label>
              <input value={form.emergencyContactNumber} onChange={e => setForm({ ...form, emergencyContactNumber: e.target.value })} placeholder="Enter emergency number" className="admin-patients-input" />
            </div>
          </div>
          
          <button onClick={handleSave} className="admin-patients-save-btn">
            {editing ? 'Update' : 'Add'} Patient
          </button>
        </div>
      )}

      <div className="admin-patients-search-card">
        <Search size={18} className="admin-patients-search-icon" />
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search patients..." 
          className="admin-patients-search-input" 
        />
      </div>

      <div className="admin-patients-table-card">
        <div className="admin-patients-table-wrapper">
          <table className="admin-patients-table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden-small">Email</th>
                <th className="hidden-medium">Phone</th>
                <th>Blood</th>
                <th className="hidden-medium">Emergency Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>{p.name || p.full_name}</td>
                  <td className="hidden-small">{p.email}</td>
                  <td className="hidden-medium">{p.phone || p.contact_number}</td>
                  <td>{p.bloodType || p.blood_type}</td>
                  <td className="hidden-medium">
                    {p.emergencyContactName || p.emergency_contact_name ? (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{p.emergencyContactName || p.emergency_contact_name}</span>
                        <span style={{ fontSize: '0.8em', color: '#666' }}>{p.emergencyContactNumber || p.emergency_contact_number}</span>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td>
                    <div className="admin-patients-actions">
                      <button onClick={() => handleEdit(p)} className="admin-patients-action-btn edit" title="Edit Patient">
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => { setResetPatient(p); setShowResetModal(true); }} 
                        className="admin-patients-action-btn reset"
                        title="Reset Password"
                        style={{ backgroundColor: '#f59e0b20', color: '#d97706' }}
                      >
                        <Key size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="admin-patients-action-btn delete" title="Delete Patient">
                        <Trash2 size={14} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="admin-patients-empty">No patients found</p>
          )}
        </div>
      </div>

      {showResetModal && (
        <div className="admin-patients-modal-overlay">
          <div className="admin-patients-form-card" style={{ maxWidth: '400px', margin: 'auto' }}>
            <div className="admin-patients-form-header">
              <h2 className="admin-patients-form-title">Reset Password</h2>
              <button onClick={() => { setShowResetModal(false); setResetPatient(null); setNewPassword(''); }} className="admin-patients-form-close-btn">
                <X size={20} />
              </button>
            </div>
            <div className="admin-patients-form-group" style={{ marginTop: '1rem' }}>
              <p style={{ marginBottom: '1rem', color: '#666' }}>
                Resetting password for: <strong>{resetPatient?.name || resetPatient?.full_name}</strong>
              </p>
              <label className="admin-patients-label">New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder="Enter new password" 
                className="admin-patients-input"
                autoFocus
              />
            </div>
            <button 
              onClick={handleResetPassword} 
              className="admin-patients-save-btn" 
              style={{ marginTop: '1rem', backgroundColor: '#d97706' }}
            >
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}