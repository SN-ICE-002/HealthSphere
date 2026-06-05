const db = require('../src/config/db');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    console.log('Starting database seeding...');
    const salt = await bcrypt.genSalt(10);

    const hash = async (password) => {
      return await bcrypt.hash(password, salt);
    };

    // Clean up existing data
    await db.query(`TRUNCATE TABLE appointments, help_desk_requests, doctor_notes, prescriptions, allergies, medical_history, patients, users RESTART IDENTITY CASCADE;`);

    // 1. Insert Users (Admin, Doctor, Nurse, Patients)
    const adminPass = await hash('admin123');
    const doctorPass = await hash('doctor123');
    const nursePass = await hash('nurse123');
    const patientPass = await hash('patient123');

    const usersQuery = `
      INSERT INTO users (username, password_hash, role, full_name, email, phone, specialty)
      VALUES 
        ('admin1', $1, 'admin', 'System Admin', 'admin@health.com', '555-0001', 'IT Systems'),
        ('doc_smith', $2, 'doctor', 'Dr. Sarah Smith', 'drsmith@health.com', '555-0002', 'Cardiology'),
        ('doc_jones', $2, 'doctor', 'Dr. Mike Jones', 'drlee@health.com', '555-0003', 'Pediatrics'),
        ('nurse_joy', $3, 'nurse', 'Nurse Joy', 'echen@health.com', '555-0004', 'General Nursing'),
        ('pat_doe', $4, 'patient', 'John Doe', 'john.doe@example.com', '555-0101', NULL),
        ('pat_lee', $4, 'patient', 'Amanda Lee', 'amanda.lee@example.com', '555-0201', NULL)
      RETURNING id, username, role;
    `;
    const usersResult = await db.query(usersQuery, [adminPass, doctorPass, nursePass, patientPass]);
    
    // Map created users to their IDs for relationships
    const userMap = {};
    usersResult.rows.forEach(u => {
      userMap[u.username] = u.id;
    });

    // 2. Insert Patients Details
    await db.query(`
      INSERT INTO patients (user_id, date_of_birth, contact_number, blood_type, address, gender, emergency_contact_name, emergency_contact_number)
      VALUES 
        ($1, '1985-06-15', '555-0101', 'O+', '123 Main St, New York', 'Male', 'Jane Doe', '555-0102'),
        ($2, '1992-11-23', '555-0201', 'A-', '456 Oak Ave, Los Angeles', 'Female', 'Robert Lee', '555-0202')
    `, [userMap['pat_doe'], userMap['pat_lee']]);

    // 3. Insert Medical History
    await db.query(`
      INSERT INTO medical_history (patient_id, condition, date_diagnosed, notes)
      VALUES 
        ($1, 'Hypertension', '2019-03-10', 'Controlled with medication'),
        ($1, 'Type 2 Diabetes', '2021-08-15', 'Diet controlled'),
        ($2, 'Asthma', '2005-04-20', 'Uses inhaler as needed')
    `, [userMap['pat_doe'], userMap['pat_lee']]);

    // 4. Insert Allergies
    await db.query(`
      INSERT INTO allergies (patient_id, allergy_name, severity)
      VALUES 
        ($1, 'Penicillin', 'Severe'),
        ($2, 'Peanuts', 'Moderate'),
        ($2, 'Pollen', 'Mild')
    `, [userMap['pat_doe'], userMap['pat_lee']]);

    // 5. Insert Prescriptions
    await db.query(`
      INSERT INTO prescriptions (patient_id, doctor_id, medication, dosage, frequency, start_date, end_date)
      VALUES 
        ($1, $3, 'Lisinopril', '10mg', 'Once daily', '2023-01-01', '2024-01-01'),
        ($2, $4, 'Albuterol Inhaler', '90mcg', 'As needed', '2023-05-15', '2024-05-15')
    `, [userMap['pat_doe'], userMap['pat_lee'], userMap['doc_smith'], userMap['doc_jones']]);

    // 6. Insert Doctor Notes
    await db.query(`
      INSERT INTO doctor_notes (patient_id, doctor_id, note_text)
      VALUES 
        ($1, $3, 'Patient is doing well. Blood pressure is stable. Advised to continue current diet.'),
        ($2, $4, 'Asthma symptoms have been mild recently. Refilled inhaler prescription.')
    `, [userMap['pat_doe'], userMap['pat_lee'], userMap['doc_smith'], userMap['doc_jones']]);

    // 7. Insert Appointments
    // Use dates in the future and past
    await db.query(`
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason, status)
      VALUES 
        ($1, $3, '2026-07-01 10:00:00', 'Annual Physical', 'scheduled'),
        ($2, $4, '2026-07-02 14:30:00', 'Cardiac Checkup', 'scheduled'),
        ($1, $4, '2026-04-10 09:00:00', 'Chest Pain Follow-up', 'completed')
    `, [userMap['pat_doe'], userMap['pat_lee'], userMap['doc_smith'], userMap['doc_jones']]);

    // 8. Insert Help Desk Requests
    await db.query(`
      INSERT INTO help_desk_requests (user_id, email, subject, message, status)
      VALUES 
        ($1, 'john.doe@example.com', 'Password Reset', 'Can you please help me reset my account password?', 'pending'),
        ($2, 'amanda.lee@example.com', 'Appointment Change', 'I need to move my appointment next week.', 'resolved'),
        (NULL, 'anonymous@guest.com', 'General Inquiry', 'Do you accept international insurance?', 'pending')
    `, [userMap['pat_doe'], userMap['pat_lee']]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

seedData();
