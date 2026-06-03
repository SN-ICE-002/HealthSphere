import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { FileText, AlertTriangle, Pill, Stethoscope } from 'lucide-react';
import './PatientRecord.css';

export default function PatientRecords() {
  const { currentUser } = useData();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Fallback to ID 5 (John Doe from our seed data) if currentUser.id isn't in DB yet
        const patientId = currentUser?.role === 'patient' && !isNaN(currentUser?.id) ? currentUser.id : 5;
        const response = await fetch(`http://localhost:5000/api/patients/${patientId}/records`);

        if (!response.ok) {
          throw new Error('Failed to fetch patient records from backend');
        }
        const data = await response.json();
        setPatient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [currentUser]);

  if (loading) return <p className="text-muted-foreground">Loading records from database...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!patient) return <p className="text-muted-foreground">No records found</p>;

  return (
    <div className="patient-records-container">
      <div className="page-header">
        <h1 className="page-title">Medical Records</h1>
        <p className="page-subtitle">Your complete health history</p>
      </div>

      <div className="records-grid">
        <div className="records-card">
          <div className="records-card-header">
            <FileText className="records-icon primary" />
            <h2 className="records-card-title">Medical History</h2>
          </div>
          {patient.medicalHistory.length === 0 ? (
            <p className="records-empty-state">No medical history recorded</p>
          ) : (
            <div className="history-list">
              {patient.medicalHistory.map((item, i) => (
                <div key={i} className="history-item">{item}</div>
              ))}
            </div>
          )}
        </div>

        <div className="records-card">
          <div className="records-card-header">
            <AlertTriangle className="records-icon warning" />
            <h2 className="records-card-title">Allergies</h2>
          </div>
          {patient.allergies.length === 0 ? (
            <p className="records-empty-state">No known allergies</p>
          ) : (
            <div className="allergies-container">
              {patient.allergies.map((a, i) => (
                <span key={i} className="allergy-badge">{a}</span>
              ))}
            </div>
          )}
        </div>

        <div className="records-card">
          <div className="records-card-header">
            <Stethoscope className="records-icon primary" />
            <h2 className="records-card-title">Doctor Notes</h2>
          </div>
          {patient.doctorNotes.length === 0 ? (
            <p className="records-empty-state">No notes yet</p>
          ) : (
            <div className="notes-list">
              {patient.doctorNotes.map((note, i) => (
                <div key={i} className="note-item">{note}</div>
              ))}
            </div>
          )}
        </div>

        <div className="records-card">
          <div className="records-card-header">
            <Pill className="records-icon success" />
            <h2 className="records-card-title">Prescriptions</h2>
          </div>
          {patient.prescriptions.length === 0 ? (
            <p className="records-empty-state">No active prescriptions</p>
          ) : (
            <div className="prescriptions-list">
              {patient.prescriptions.map(rx => (
                <div key={rx.id} className="prescription-item">
                  <div className="prescription-medication">{rx.medication}</div>
                  <div className="prescription-dosage">{rx.dosage}</div>
                  <div className="prescription-frequency">
                    <span>{rx.frequency}</span>
                    <span>{rx.startDate} to {rx.endDate}</span>
                  </div>
                  <div className="prescription-meta">By {rx.prescribedBy}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}