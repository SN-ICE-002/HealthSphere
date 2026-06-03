import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Mail, Lock, User, Phone, MapPin, Calendar, AlertCircle } from 'lucide-react';
import LogoImage from '../image/Logo.png';
import './Register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    bloodType: '',
    allergies: '',
    medicalHistory: '',
    emergencyContactName: '',
    emergencyContactNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useData();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Invalid email format');
      setLoading(false);
      return;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }
    if (!formData.dob) {
      setError('Date of birth is required');
      setLoading(false);
      return;
    }
    if (!formData.gender) {
      setError('Gender is required');
      setLoading(false);
      return;
    }

    const success = await register(formData);
    if (!success) {
      setError('Email already exists');
      setLoading(false);
      return;
    }

    // Registration successful - redirect to login
    setLoading(false);
    navigate('/', { replace: true });
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-card-container">
          <div className="register-header">
            <div className="register-logo">
              <img src={LogoImage} alt="HealthSphere Logo" className="app-logo" />
            </div>
            <h1>HealthSphere</h1>
            <p>Create your patient account</p>
          </div>

          <div className="register-form-card">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="register-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="register-form-row">
                <div className="register-form-group">
                  <label className="register-label">Full Name</label>
                  <div className="register-input-wrapper">
                    <User />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="register-input"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label className="register-label">Email Address</label>
                  <div className="register-input-wrapper">
                    <Mail />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="register-input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="register-form-row">
                <div className="register-form-group">
                  <label className="register-label">Password</label>
                  <div className="register-input-wrapper">
                    <Lock />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="register-input"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label className="register-label">Confirm Password</label>
                  <div className="register-input-wrapper">
                    <Lock />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="register-input"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>

              <div className="register-form-row">
                <div className="register-form-group">
                  <label className="register-label">Phone Number</label>
                  <div className="register-input-wrapper">
                    <Phone />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="register-input"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label className="register-label">Date of Birth</label>
                  <div className="register-input-wrapper">
                    <Calendar />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="register-input"
                    />
                  </div>
                </div>
              </div>

              <div className="register-form-row">
                <div className="register-form-group">
                  <label className="register-label">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="register-select"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="register-form-group">
                  <label className="register-label">Blood Type</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="register-select"
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="register-form-group">
                <label className="register-label">Address</label>
                <div className="register-input-wrapper">
                  <MapPin />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="register-input"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <div className="register-form-row">
                <div className="register-form-group">
                  <label className="register-label">Emergency Contact Name (optional)</label>
                  <div className="register-input-wrapper">
                    <User />
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      className="register-input"
                      placeholder="Emergency contact name"
                    />
                  </div>
                </div>

                <div className="register-form-group">
                  <label className="register-label">Emergency Contact Number (optional)</label>
                  <div className="register-input-wrapper">
                    <Phone />
                    <input
                      type="tel"
                      name="emergencyContactNumber"
                      value={formData.emergencyContactNumber}
                      onChange={handleChange}
                      className="register-input"
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>
              </div>

              <div className="register-form-row">
                <div className="register-form-group">
                  <label className="register-label">Allergies (optional)</label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="register-textarea"
                    placeholder="List any allergies"
                    rows="2"
                  />
                </div>

                <div className="register-form-group">
                  <label className="register-label">Medical History (optional)</label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    className="register-textarea"
                    placeholder="Brief medical history"
                    rows="2"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="register-button"
              >
                {loading ? (
                  <>
                    <svg className="register-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>

          <div className="register-footer">
            <p>Already have an account? <Link to="/" className="register-link">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}