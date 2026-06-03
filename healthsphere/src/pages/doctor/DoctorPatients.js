import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Search, User, Plus } from 'lucide-react';
import './DoctorPatients.css';

export default function DoctorPatients() {

  const { currentUser } = useData();

  const [allPatients, setAllPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetail, setPatientDetail] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [rxMed, setRxMed] = useState('');
  const [rxDosage, setRxDosage] = useState('');
  const [rxFreq, setRxFreq] = useState('');
  const [rxEnd, setRxEnd] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  const currentUserId = !isNaN(currentUser?.id) ? currentUser.id : 2;

  // Fetch patients on mount based on role
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        let res;
        if (currentUser?.role === 'admin' || currentUser?.role === 'nurse') {
          res = await fetch(`http://localhost:5000/api/admin/patients`);
        } else {
          res = await fetch(`http://localhost:5000/api/doctors/${currentUserId}/patients`);
        }
        
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllPatients(data);
          setFiltered(data);
        }
      } catch (err) {
        console.error('Failed to fetch patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [currentUser, currentUserId]);

  // Fetch full records when a patient is selected
  useEffect(() => {
    if (!selectedPatient) { setPatientDetail(null); return; }
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/patients/${selectedPatient}/records`);
        const data = await res.json();
        setPatientDetail(data);
      } catch (err) {
        console.error('Failed to fetch patient detail:', err);
      }
    };
    fetchDetail();
  }, [selectedPatient]);

  // Search handler — fires on button click or Enter key
  const handleSearch = () => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setFiltered(allPatients);
    } else {
      setFiltered(allPatients.filter(p =>
        (p.name || '').toLowerCase().includes(term) ||
        (p.email || '').toLowerCase().includes(term)
      ));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${selectedPatient}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: currentUserId, noteText })
      });
      if (response.ok) {
        setPatientDetail(prev => ({ ...prev, doctorNotes: [...(prev.doctorNotes || []), noteText] }));
        setNoteText('');
        setFeedback('Note added successfully!');
      } else {
        setFeedback('Failed to save note');
      }
    } catch { setFeedback('Network error'); }
    setTimeout(() => setFeedback(''), 2000);
  };

  const addPrescription = async () => {
    if (!rxMed.trim() || !rxDosage.trim() || !rxFreq.trim()) return;
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${selectedPatient}/prescriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: currentUserId,
          medication: rxMed,
          dosage: rxDosage,
          frequency: rxFreq,
          startDate: new Date().toISOString().split('T')[0],
          endDate: rxEnd || null
        })
      });
      if (response.ok) {
        const data = await response.json();
        const uiRx = {
          id: data.prescription.id,
          medication: rxMed,
          dosage: rxDosage,
          frequency: rxFreq,
          startDate: new Date().toISOString().split('T')[0],
          endDate: rxEnd || '—',
          prescribedBy: currentUser?.name || ''
        };
        setPatientDetail(prev => ({ ...prev, prescriptions: [...(prev.prescriptions || []), uiRx] }));
        setRxMed(''); setRxDosage(''); setRxFreq(''); setRxEnd('');
        setFeedback('Prescription added successfully!');
      } else {
        setFeedback('Failed to save prescription');
      }
    } catch { setFeedback('Network error'); }
    setTimeout(() => setFeedback(''), 2000);
  };

  // Patient Detail View
  if (selectedPatient && patientDetail) {
    return (
      <div className="doctor-patients-container">
        <div className="page-header">
          <button onClick={() => setSelectedPatient(null)} className="doctor-patients-back-btn">← Back</button>
          <div>
            <h1 className="page-title">{patientDetail.full_name}</h1>
            <p className="page-subtitle">{patientDetail.email} • {patientDetail.contact_number}</p>
          </div>
        </div>

        {feedback && <div className="doctor-patients-feedback">{feedback}</div>}

        <div className="doctor-patients-details-grid">
          <div className="doctor-patients-card">
            <h3 className="doctor-patients-card-title">Patient Info</h3>
            <div className="doctor-patients-info-list">
              <p><span>DOB:</span> {patientDetail.date_of_birth ? new Date(patientDetail.date_of_birth).toLocaleDateString() : '—'}</p>
              <p><span>Blood Type:</span> {patientDetail.blood_type || '—'}</p>
              <p><span>Emergency Contact:</span> {patientDetail.emergency_contact_name || '—'}</p>
              <p><span>Allergies:</span> {patientDetail.allergies?.join(', ') || 'None'}</p>
            </div>
          </div>

          <div className="doctor-patients-card">
            <h3 className="doctor-patients-card-title">Medical History</h3>
            <ul className="doctor-patients-list">
              {patientDetail.medicalHistory?.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>

          <div className="doctor-patients-card">
            <h3 className="doctor-patients-card-title">Doctor Notes</h3>
            <ul className="doctor-patients-list">
              {patientDetail.doctorNotes?.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
            <div className="doctor-patients-input-group">
              <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add note..."
                className="doctor-patients-input" />
              <button onClick={addNote} className="doctor-patients-add-btn"><Plus size={16} /></button>
            </div>
          </div>

          <div className="doctor-patients-card">
            <h3 className="doctor-patients-card-title">Prescriptions</h3>
            <div className="doctor-patients-list">
              {patientDetail.prescriptions?.map(rx => (
                <div key={rx.id} className="doctor-patients-rx-item">
                  <p className="doctor-patients-rx-name">{rx.medication} — {rx.dosage}</p>
                  <p className="doctor-patients-rx-freq">{rx.frequency}</p>
                </div>
              ))}
            </div>
            <div className="doctor-patients-rx-form">
              <input value={rxMed} onChange={e => setRxMed(e.target.value)} placeholder="Medication" className="doctor-patients-input" />
              <input value={rxDosage} onChange={e => setRxDosage(e.target.value)} placeholder="Dosage" className="doctor-patients-input" />
              <input value={rxFreq} onChange={e => setRxFreq(e.target.value)} placeholder="Frequency" className="doctor-patients-input" />
              <input type="date" value={rxEnd} onChange={e => setRxEnd(e.target.value)} className="doctor-patients-input" />
            </div>
            <button onClick={addPrescription} className="doctor-patients-save-btn">Add Prescription</button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="doctor-patients-container">
      <div className="page-header">
        <h1 className="page-title">My Patients</h1>
        <p className="page-subtitle">View and manage assigned patients</p>
      </div>

      {/* Search bar with button */}
      <div className="doctor-patients-search-card">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search patients by name or email..."
          className="doctor-patients-search-input"
        />
        <button onClick={handleSearch} className="doctor-patients-search-btn" title="Search">
          <Search size={18} />
        </button>
      </div>

      {loading ? (
        <p className="doctor-patients-empty">Loading patients...</p>
      ) : (
        <div className="doctor-patients-grid">
          {filtered.map(p => (
            <div key={p.id} className="doctor-patient-card" onClick={() => setSelectedPatient(p.id)}>
              <div className="doctor-patient-avatar">
                <User size={20} />
              </div>
              <div>
                <p className="doctor-patient-name">{p.name}</p>
                <p className="doctor-patient-meta">{p.bloodType || '—'} • {p.email}</p>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="doctor-patients-empty">
              {search ? `No patients found for "${search}"` : 'No patients assigned yet'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}