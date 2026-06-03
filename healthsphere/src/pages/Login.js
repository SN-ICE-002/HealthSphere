import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import LogoImage from '../image/Logo.png';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useData();
  const navigate = useNavigate();

  // If user is already logged in, redirect to their dashboard
  useEffect(() => {
    if (currentUser) {
      switch (currentUser.role) {
        case 'patient':
          navigate('/patient', { replace: true });
          break;
        case 'doctor':
        case 'nurse':
          navigate('/doctor', { replace: true });
          break;
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        default:
          break;
      }
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic Validation
    if (!role) { 
      setError('Please select a role');
      setLoading(false);
      return; 
    }
    if (!email.trim()) { 
      setError('Email is required');
      setLoading(false);
      return; 
    }
    if (!/\S+@\S+\.\S+/.test(email)) { 
      setError('Invalid email format');
      setLoading(false);
      return; 
    }
    if (!password.trim()) { 
      setError('Password is required');
      setLoading(false);
      return; 
    }
    if (password.length < 6) { 
      setError('Password must be at least 6 characters');
      setLoading(false);
      return; 
    }

    const success = await login(email, password, role);
    
    if (!success) { 
      setError('Invalid credentials for the selected role.');
      setLoading(false);
      return; 
    }

    // Login successful - redirect is handled by useEffect above
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card-container">
          <div className="login-header">
            <div className="login-logo">
              <img src={LogoImage} alt="HealthSphere Logo" className="app-logo" />
            </div>
            <h1>HealthSphere</h1>
            <p>Sign in to your health portal</p>
          </div>

          <div className="login-form-card">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="login-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="login-form-group">
                <label className="login-label">Role</label>
                <select 
                  value={role} 
                  onChange={e => setRole(e.target.value)}
                  className="login-select"
                >
                  <option value="">Select Role</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="login-form-group">
                <label className="login-label">Email Address</label>
                <div className="login-input-wrapper">
                  <Mail />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="login-input"
                    placeholder="your.email@example.com" 
                  />
                </div>
              </div>

              <div className="login-form-group">
                <label className="login-label">Password</label>
                <div className="login-input-wrapper">
                  <Lock />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="login-input"
                    placeholder="Enter your password" 
                  />
                </div>
                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                  <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#4CAF50', fontWeight: '600', textDecoration: 'none' }}>
                    Help Desk Assistance
                  </Link>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="login-button"
              >
                {loading ? (
                  <>
                    <svg className="login-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <div className="login-footer">
            <p>New patient? <Link to="/register" className="login-link">Create Account</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}