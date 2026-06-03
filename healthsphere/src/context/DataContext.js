import React, { createContext, useContext, useState, useEffect } from 'react';

// Context creation
const DataContext = createContext(undefined);

// Default mock data
const defaultPatients = [
  {
    id: 'p2', name: 'Bob Williams', email: 'bob@mail.com', phone: '555-0102',
    address: '456 Oak Ave', dob: '1985-07-22', gender: 'Male', bloodType: 'O-',
    allergies: ['Sulfa'], medicalHistory: ['Hypertension diagnosed 2020'],
    doctorNotes: ['Blood pressure stable'], prescriptions: [
      { id: 'rx2', medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2024-06-01', endDate: '2025-06-01', prescribedBy: 'Dr. Smith' }
    ], createdAt: '2024-02-14'
  },
  {
    id: 'p3', name: 'Carol Davis', email: 'carol@mail.com', phone: '555-0103',
    address: '789 Pine Rd', dob: '1978-11-03', gender: 'Female', bloodType: 'B+',
    allergies: [], medicalHistory: ['Knee surgery 2019'],
    doctorNotes: ['Recovery progressing well'], prescriptions: [], createdAt: '2024-03-20'
  },
  {
    id: 'p4', name: 'David Brown', email: 'david@mail.com', phone: '555-0104',
    address: '321 Elm Blvd', dob: '1995-01-30', gender: 'Male', bloodType: 'AB+',
    allergies: ['Latex'], medicalHistory: ['Type 2 Diabetes diagnosed 2023'],
    doctorNotes: ['A1C levels improving'], prescriptions: [
      { id: 'rx3', medication: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2024-03-01', endDate: '2025-03-01', prescribedBy: 'Dr. Lee' }
    ], createdAt: '2024-04-05'
  },
];

const defaultStaff = [
  { id: 's1', name: 'Dr. Sarah Smith', email: 'drsmith@health.com', role: 'doctor', specialty: 'General Practice', phone: '555-0201', createdAt: '2023-06-01' },
  { id: 's2', name: 'Dr. James Lee', email: 'drlee@health.com', role: 'doctor', specialty: 'Cardiology', phone: '555-0202', createdAt: '2023-07-15' },
  { id: 's3', name: 'Nurse Emily Chen', email: 'echen@health.com', role: 'nurse', phone: '555-0203', createdAt: '2023-08-01' },
  { id: 's4', name: 'Admin Mike Torres', email: 'admin@health.com', role: 'admin', phone: '555-0204', createdAt: '2023-01-01' },
];

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const defaultAppointments = [
  { id: 'a2', patientId: 'p2', patientName: 'Bob Williams', doctorId: 's1', doctorName: 'Dr. Sarah Smith', date: today, time: '10:30', reason: 'Blood pressure follow-up', status: 'scheduled' },
  { id: 'a3', patientId: 'p3', patientName: 'Carol Davis', doctorId: 's2', doctorName: 'Dr. James Lee', date: tomorrow, time: '14:00', reason: 'Post-surgery review', status: 'scheduled' },
  { id: 'a4', patientId: 'p4', patientName: 'David Brown', doctorId: 's2', doctorName: 'Dr. James Lee', date: today, time: '11:00', reason: 'Diabetes management', status: 'completed' },
];

const defaultNotifications = [
  { id: 'n3', userId: 'p2', message: 'Appointment reminder: Today at 10:30 AM with Dr. Smith', type: 'appointment', read: false, date: today },
  { id: 'n4', userId: 'p4', message: 'Time to take your Metformin medication', type: 'medication', read: false, date: today },
];


// Helper to handle localStorage
function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function DataProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => loadFromStorage('hs_user', null));
  const [patients, setPatients] = useState(() => loadFromStorage('hs_patients', defaultPatients));
  const [staff, setStaff] = useState(() => loadFromStorage('hs_staff', defaultStaff));
  const [appointments, setAppointments] = useState(() => loadFromStorage('hs_appointments', defaultAppointments));
  const [notifications, setNotifications] = useState(() => loadFromStorage('hs_notifications', defaultNotifications));
  const [emergencyMode, setEmergencyMode] = useState(() => loadFromStorage('hs_emergency', false));

  // Persistence effects
  useEffect(() => { localStorage.setItem('hs_user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('hs_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('hs_staff', JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem('hs_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('hs_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('hs_emergency', JSON.stringify(emergencyMode)); }, [emergencyMode]);

  // Fetch live data from the backend when the user logs in
  useEffect(() => {
    if (!currentUser) return;

    const role = currentUser.role;

    if (role === 'doctor') {
      // Fetch appointments for this doctor
      fetch(`http://localhost:5000/api/doctors/${currentUser.id}/appointments`)
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setAppointments(data); })
        .catch(err => console.error('Failed to fetch appointments:', err));

      // Fetch patients for this doctor
      fetch(`http://localhost:5000/api/doctors/${currentUser.id}/patients`)
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setPatients(data); })
        .catch(err => console.error('Failed to fetch doctor patients:', err));
    }

    if (role === 'admin' || role === 'nurse') {
      // Fetch all patients
      fetch('http://localhost:5000/api/admin/patients')
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setPatients(data); })
        .catch(err => console.error('Failed to fetch patients:', err));

      // Fetch all staff
      fetch('http://localhost:5000/api/admin/staff')
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setStaff(data); })
        .catch(err => console.error('Failed to fetch staff:', err));

      // Fetch all appointments
      fetch('http://localhost:5000/api/admin/appointments')
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setAppointments(data); })
        .catch(err => console.error('Failed to fetch appointments:', err));
    }

    if (role === 'patient') {
      // Fetch patient profile
      fetch(`http://localhost:5000/api/patients/${currentUser.id}/records`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.message) {
            setPatients([{
              ...data,
              id: data.user_id || currentUser.id,
              name: data.full_name || currentUser.name,
              bloodType: data.blood_type,
            }]);
          }
        })
        .catch(err => console.error('Failed to fetch patient records:', err));

      // Fetch patient appointments
      fetch(`http://localhost:5000/api/appointments/patient/${currentUser.id}`)
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setAppointments(data); })
        .catch(err => console.error('Failed to fetch patient appointments:', err));
    }
  }, [currentUser]);

  const login = async (email, password, role) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });

      const data = await response.json();

      if (response.ok) {
        // The backend returns an object with the same keys our app expects: id, name, email, role
        setCurrentUser(data.user);
        return true;
      } else {
        console.error('Login failed:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Network error during login:', error);
      return false;
    }
  };

  const register = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        return true;
      } else {
        const errData = await response.json();
        console.error('Registration failed:', errData.message);
        return false;
      }
    } catch (error) {
      console.error('Network error during registration:', error);
      return false;
    }
  };

  const requestResetCode = async (email) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/request-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Request failed' };
      }
    } catch (error) {
      console.error('Network error during code request:', error);
      return { success: false, message: 'Network error. Please try again later.' };
    }
  };

  const verifyResetCode = async (email, code) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Verification failed' };
      }
    } catch (error) {
      console.error('Network error during code verification:', error);
      return { success: false, message: 'Network error. Please try again later.' };
    }
  };

  const submitHelpRequest = async (email, subject, message) => {
    try {
      const response = await fetch('http://localhost:5000/api/help-desk/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, message })
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error('Help request error:', error);
      return { success: false, message: 'Network error.' };
    }
  };

  const getHelpRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/help-desk/requests');
      return await response.json();
    } catch (error) {
      console.error('Get help requests error:', error);
      return [];
    }
  };

  const respondToHelpRequest = async (payload) => {
    try {
      const response = await fetch('http://localhost:5000/api/help-desk/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      return { success: response.ok, message: data.message };
    } catch (error) {
      console.error('Respond help request error:', error);
      return { success: false, message: 'Network error.' };
    }
  };

  const checkRequestStatus = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/help-desk/status/${email}`);
      return await response.json();
    } catch (error) {
      console.error('Check status error:', error);
      return [];
    }
  };

  const logout = () => {

    setCurrentUser(null);
    localStorage.removeItem('hs_user');
  };

  return (
    <DataContext.Provider value={{
      currentUser,
      login,
      register,
      requestResetCode,
      verifyResetCode,
      submitHelpRequest,
      getHelpRequests,
      respondToHelpRequest,
      checkRequestStatus,
      logout,
      patients,
      setPatients,
      staff,
      setStaff,
      appointments,
      setAppointments,
      notifications,
      setNotifications,
      emergencyMode,
      setEmergencyMode
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}