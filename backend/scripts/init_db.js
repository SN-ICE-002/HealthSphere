const db = require('../src/config/db');

const createTables = async () => {
  const queryText = `
    -- Drop tables if you want a fresh start
    DROP VIEW IF EXISTS staff CASCADE;
    DROP TABLE IF EXISTS appointments, doctor_notes, prescriptions, allergies, medical_history, patients, users, roles, help_desk_requests CASCADE;

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'doctor', 'admin', 'nurse')),
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(20),
      specialty VARCHAR(100),
      reset_code VARCHAR(10),
      reset_code_expires TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patients (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      date_of_birth DATE,
      contact_number VARCHAR(20),
      blood_type VARCHAR(5),
      address TEXT,
      gender VARCHAR(20),
      emergency_contact_name VARCHAR(100),
      emergency_contact_number VARCHAR(20)
    );

    CREATE TABLE IF NOT EXISTS medical_history (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER REFERENCES patients(user_id) ON DELETE CASCADE,
      condition VARCHAR(255) NOT NULL,
      date_diagnosed DATE,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS allergies (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER REFERENCES patients(user_id) ON DELETE CASCADE,
      allergy_name VARCHAR(100) NOT NULL,
      severity VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS prescriptions (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER REFERENCES patients(user_id) ON DELETE CASCADE,
      doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      medication VARCHAR(100) NOT NULL,
      dosage VARCHAR(50) NOT NULL,
      frequency VARCHAR(50) NOT NULL,
      start_date DATE,
      end_date DATE
    );

    CREATE TABLE IF NOT EXISTS doctor_notes (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER REFERENCES patients(user_id) ON DELETE CASCADE,
      doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      note_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER REFERENCES patients(user_id) ON DELETE CASCADE,
      doctor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      appointment_date TIMESTAMP NOT NULL,
      reason VARCHAR(255),
      status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show'))
    );

    CREATE TABLE IF NOT EXISTS help_desk_requests (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      email VARCHAR(100) NOT NULL,
      subject VARCHAR(255),
      message TEXT NOT NULL,
      admin_response TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Role-based access control table
    CREATE TABLE IF NOT EXISTS roles (
      role_id SERIAL PRIMARY KEY,
      role_name VARCHAR(50) UNIQUE NOT NULL
    );

    INSERT INTO roles (role_name) VALUES ('Admin'), ('Doctor'), ('Nurse'), ('Patient') ON CONFLICT DO NOTHING;

    -- Create staff view to make querying easier for the user
    CREATE OR REPLACE VIEW staff AS
    SELECT 
        u.id AS staff_id, 
        u.id AS user_id, 
        r.role_id, 
        u.phone AS phone_number, 
        u.created_at,
        u.full_name,
        u.email,
        u.role AS user_role,
        u.specialty
    FROM users u
    LEFT JOIN roles r ON LOWER(u.role) = LOWER(r.role_name)
    WHERE u.role IN ('doctor', 'nurse', 'admin');
  `;

  try {
    console.log('Connecting to database and creating tables...');
    await db.query(queryText);
    console.log('Tables created successfully!');
  } catch (err) {
    console.error('Error creating tables. Check your database connection details in .env');
    console.error(err.stack);
  } finally {
    process.exit(0);
  }
};

createTables();
