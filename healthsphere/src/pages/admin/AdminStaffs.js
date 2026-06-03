import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Pencil, Trash2, X, AlertCircle, Search } from 'lucide-react';
import './AdminStaffs.css';

export default function AdminStaff() {

  const { staff, setStaff } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    role: 'doctor', 
    specialty: '' 
  });
  const [error, setError] = useState('');

  const filtered = staff.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => { 
    setForm({ name: '', email: '', phone: '', role: 'doctor', specialty: '' }); 
    setEditing(null); 
    setShowForm(false); 
    setError(''); 
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return 'Valid email is required';
    if (!form.phone.trim()) return 'Phone is required';
    return '';
  };

  const handleSave = async () => {
    const err = validate();
    if (err) { 
      setError(err); 
      return; 
    }

    try {
      if (editing) {
        const response = await fetch(`http://localhost:5000/api/admin/staff/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        const data = await response.json();
        if (response.ok) {
          setStaff(prev => prev.map(s => s.id === editing.id ? data.staff : s));
          resetForm();
        } else {
          setError(data.message || 'Failed to update staff member');
        }
      } else {
        const response = await fetch(`http://localhost:5000/api/admin/staff`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, password: 'staff123' })
        });
        const data = await response.json();
        if (response.ok) {
          setStaff(prev => [...prev, data.staff]);
          resetForm();
        } else {
          setError(data.message || 'Failed to create staff member');
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Network error. Is the backend running?');
    }
  };

  const handleEdit = (s) => {
    setForm({ 
      name: s.name, 
      email: s.email, 
      phone: s.phone, 
      role: s.role, 
      specialty: s.specialty || '' 
    });
    setEditing(s); 
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/staff/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setStaff(prev => prev.filter(s => s.id !== id));
      } else {
        alert('Failed to delete staff member');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="admin-staff-container">
      <div className="admin-staff-header">
        <div className="admin-staff-title-group">
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">Manage doctors, nurses, and admins</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowForm(true); }} 
          className="admin-staff-add-btn"
        >
          <Plus size={18} /> Add Staff
        </button>
      </div>

      {showForm && (
        <div className="admin-staff-form-card">
          <div className="admin-staff-form-header">
            <h2 className="admin-staff-form-title">
              {editing ? 'Edit Staff' : 'Add Staff'}
            </h2>
            <button onClick={resetForm} className="admin-staff-form-close-btn"><X size={20} /></button>
          </div>
          
          {error && (
            <div className="admin-staff-error">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="admin-staff-form-grid">
            <div className="admin-staff-form-group">
              <label className="admin-staff-label">Full Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" className="admin-staff-input" />
            </div>
            <div className="admin-staff-form-group">
              <label className="admin-staff-label">Email</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter email" type="email" className="admin-staff-input" />
            </div>
            <div className="admin-staff-form-group">
              <label className="admin-staff-label">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone" className="admin-staff-input" />
            </div>
            
            <div className="admin-staff-form-group">
              <label className="admin-staff-label">Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="admin-staff-select">
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            {form.role === 'doctor' && (
              <div className="admin-staff-form-group">
                <label className="admin-staff-label">Specialty</label>
                <input value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} placeholder="Enter specialty" className="admin-staff-input" />
              </div>
            )}
          </div>
          <button onClick={handleSave} className="admin-staff-save-btn">
            {editing ? 'Update' : 'Add'} Staff
          </button>
        </div>
      )}

      <div className="admin-staff-search-card">
        <Search size={18} className="admin-staff-search-icon" />
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search staff..." 
          className="admin-staff-search-input" 
        />
      </div>

      <div className="admin-staff-table-card">
        <div className="admin-staff-table-wrapper">
          <table className="admin-staff-table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden-small">Email</th>
                <th>Role</th>
                <th className="hidden-medium">Specialty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td className="hidden-small">{s.email}</td>
                  <td>
                    <span className={`admin-staff-role-badge ${s.role}`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="hidden-medium">{s.specialty || '—'}</td>
                  <td>
                    <div className="admin-staff-actions">
                      <button onClick={() => handleEdit(s)} className="admin-staff-action-btn edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="admin-staff-action-btn delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="admin-staff-empty">No staff found</p>
          )}
        </div>
      </div>
    </div>
  );
}