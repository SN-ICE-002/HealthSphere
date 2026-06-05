const db = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /api/admin/patients — list all patients
exports.getAllPatients = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.id, u.full_name AS name, u.email,
             p.contact_number AS phone, p.date_of_birth AS dob,
             p.blood_type AS "bloodType",
             p.address, p.gender,
             p.emergency_contact_name AS "emergencyContactName",
             p.emergency_contact_number AS "emergencyContactNumber",
             COALESCE((SELECT array_agg(allergy_name) FROM allergies WHERE patient_id = u.id), ARRAY[]::VARCHAR[]) AS allergies,
             COALESCE((SELECT array_agg(condition) FROM medical_history WHERE patient_id = u.id), ARRAY[]::VARCHAR[]) AS "medicalHistory"
      FROM patients p
      JOIN users u ON p.user_id = u.id
      ORDER BY u.full_name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error while fetching patients' });
  }
};

// POST /api/admin/patients — create a new patient (admin flow)
exports.createPatient = async (req, res) => {
  const { name, fullName, email, phone, dob, gender, address, bloodType, emergencyContactName, emergencyContactNumber, password } = req.body;
  const finalName = name || fullName;

  console.log('Backend received createPatient request:', req.body);

  if (!finalName || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const checkResult = await db.query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const username = normalizedEmail.split('@')[0] + Math.floor(Math.random() * 1000);
    const passwordToStore = password || 'patient123'; 
    
    // Hash the password so they can actually log in
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordToStore, salt);

    const userResult = await db.query(
      `INSERT INTO users (username, password_hash, role, full_name, email)
       VALUES ($1, $2, 'patient', $3, $4)
       RETURNING id, full_name AS name, email`,
      [username, hashedPassword, finalName, normalizedEmail]
    );
    const newUser = userResult.rows[0];

    await db.query(
      `INSERT INTO patients (user_id, date_of_birth, contact_number, blood_type, address, gender, emergency_contact_name, emergency_contact_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [newUser.id, dob || null, phone || null, bloodType || null, address || null, gender || null, emergencyContactName || null, emergencyContactNumber || null]
    );

    res.status(201).json({
      message: 'Patient created successfully',
      patient: { id: newUser.id, name: newUser.name, email: newUser.email, phone, dob, bloodType, gender, address, emergencyContactName, emergencyContactNumber }
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: 'Server error while creating patient' });
  }
};

// PUT /api/admin/patients/:id — update a patient
exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { name, fullName, email, phone, dob, gender, address, bloodType, emergencyContactName, emergencyContactNumber } = req.body;
  const finalName = name || fullName;

  if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    await db.query(
      'UPDATE users SET full_name = $1, email = $2 WHERE id = $3',
      [finalName, email, id]
    );
    await db.query(
      `UPDATE patients SET date_of_birth = $1, contact_number = $2, blood_type = $3, address = $4, gender = $5, emergency_contact_name = $6, emergency_contact_number = $7 WHERE user_id = $8`,
      [dob || null, phone || null, bloodType || null, address || null, gender || null, emergencyContactName || null, emergencyContactNumber || null, id]
    );
    res.json({ message: 'Patient updated successfully' });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Server error while updating patient' });
  }
};

// DELETE /api/admin/patients/:id — delete a patient
exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Server error while deleting patient' });
  }
};

// GET /api/admin/staff — list all staff
exports.getAllStaff = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, full_name AS name, email, role, phone, specialty,
             created_at AS "createdAt"
      FROM users
      WHERE role IN ('doctor', 'nurse', 'admin')
      ORDER BY role, full_name ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server error while fetching staff' });
  }
};

// POST /api/admin/staff — create a new staff member
exports.createStaff = async (req, res) => {
  const { name, fullName, email, phone, role, specialty, password } = req.body;
  const finalName = name || fullName;

  if (!finalName || !email || !role) {
    return res.status(400).json({ message: 'Name, email and role are required.' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const checkResult = await db.query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const username = normalizedEmail.split('@')[0] + Math.floor(Math.random() * 1000);
    const passwordToStore = password || 'staff123';

    // Hash the password so they can log in
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordToStore, salt);

    const result = await db.query(
      `INSERT INTO users (username, password_hash, role, full_name, email, phone, specialty)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, full_name AS name, email, role, phone, specialty, created_at AS "createdAt"`,
      [username, hashedPassword, role, finalName, normalizedEmail, phone || null, specialty || null]
    );

    res.status(201).json({
      message: 'Staff member created successfully',
      staff: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ message: 'Server error while creating staff' });
  }
};

// PUT /api/admin/staff/:id — update a staff member
exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, fullName, email, phone, role, specialty } = req.body;
  const finalName = name || fullName;

  if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });

  try {
    const result = await db.query(
      `UPDATE users 
       SET full_name = $1, email = $2, phone = $3, role = $4, specialty = $5 
       WHERE id = $6
       RETURNING id, full_name AS name, email, role, phone, specialty`,
      [finalName, email, phone || null, role, specialty || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json({ message: 'Staff member updated successfully', staff: result.rows[0] });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ message: 'Server error while updating staff' });
  }
};

// DELETE /api/admin/staff/:id — delete a staff member
exports.deleteStaff = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Staff member deleted' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Server error while deleting staff' });
  }
};

// GET /api/admin/appointments — list all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.id, a.status, a.appointment_date,
             a.reason,
             up.full_name AS patient_name,
             ud.full_name AS doctor_name,
             a.patient_id, a.doctor_id
      FROM appointments a
      JOIN users up ON a.patient_id = up.id
      JOIN users ud ON a.doctor_id = ud.id
      ORDER BY a.appointment_date DESC
    `);

    const formatted = result.rows.map(row => {
      const dateObj = new Date(row.appointment_date);
      return {
        id: row.id,
        patientId: row.patient_id,
        patientName: row.patient_name,
        doctorId: row.doctor_id,
        doctorName: row.doctor_name,
        date: dateObj.toISOString().split('T')[0],
        time: dateObj.toISOString().split('T')[1].substring(0, 5),
        reason: row.reason || 'Follow-up',
        status: row.status
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments' });
  }
};

// POST /api/admin/patients/:id/reset-password
exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (isNaN(id)) return res.status(400).json({ message: 'Invalid ID' });
  if (!newPassword) return res.status(400).json({ message: 'New password is required' });

  try {
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const result = await db.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [hashedPassword, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error while resetting password' });
  }
};