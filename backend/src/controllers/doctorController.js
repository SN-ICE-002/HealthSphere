const db = require('../config/db');

exports.getAppointments = async (req, res) => {
  const doctorId = req.params.id;

  if (isNaN(doctorId)) {
    return res.status(400).json({ message: "Invalid doctor ID. ID must be a number." });
  }

  try {
    const query = `
      SELECT a.*, 
             u.full_name as patient_name,
             p.date_of_birth,
             p.contact_number
      FROM appointments a
      JOIN patients p ON a.patient_id = p.user_id
      JOIN users u ON p.user_id = u.id
      WHERE a.doctor_id = $1
      ORDER BY a.appointment_date ASC
    `;
    
    const result = await db.query(query, [doctorId]);

    // Format appointments to match what the frontend expects
    const formattedAppointments = result.rows.map(row => {
      // Split postgres timestamp into date and time
      const dateObj = new Date(row.appointment_date);
      const date = dateObj.toISOString().split('T')[0];
      const time = dateObj.toISOString().split('T')[1].substring(0, 5);

      return {
        id: row.id,
        patientId: row.patient_id,
        patientName: row.patient_name,
        doctorId: row.doctor_id,
        date: date,
        time: time,
        reason: row.reason || 'Follow-up',
        status: row.status
      };
    });

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
};

exports.getPatients = async (req, res) => {
  const doctorId = req.params.id;
  if (isNaN(doctorId)) return res.status(400).json({ message: 'Invalid doctor ID' });

  try {
    const result = await db.query(`
      SELECT 
        u.id, u.full_name AS name, u.email,
        p.contact_number AS phone,
        p.date_of_birth AS dob,
        p.blood_type AS "bloodType",
        p.emergency_contact_name AS "emergencyContactName",
        COALESCE((SELECT array_agg(allergy_name) FROM allergies WHERE patient_id = u.id), ARRAY[]::VARCHAR[]) AS allergies,
        COALESCE((SELECT array_agg(condition) FROM medical_history WHERE patient_id = u.id), ARRAY[]::VARCHAR[]) AS "medicalHistory"
      FROM patients p
      JOIN users u ON p.user_id = u.id
      ORDER BY u.full_name ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    res.status(500).json({ message: 'Server error while fetching patients' });
  }
};
