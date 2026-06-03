# Project Title: HealthSphere 🏥

**Group Names:** Ludovic Niere, Samson Nawiwa, Tim Roger

---

## 📖 Description

HealthSphere is a comprehensive full-stack healthcare management system designed to streamline the operations of a medical facility. It provides a unified platform for patients, medical staff, and administrators to manage appointments, medical records, prescriptions, and administrative tasks.

**Key Features:**
- 🧑‍⚕️ Patient portal — view appointments, medical history, prescriptions, and allergies
- 🩺 Doctor/Nurse portal — manage patient records, write notes, and handle appointments
- 🔐 Admin portal — manage all users, staff, and system settings
- 📋 Help desk — internal support request system
- 🔑 JWT-based authentication with role-based access control (RBAC)

---

## 🏗️ File Structure

```
HealthSphere/                          # Root project directory
│
├── README.md                          # This file
├── package.json                       # Root scripts (dev, build, install:all)
│
├── backend/                           # Node.js / Express REST API
│   ├── server.js                      # Entry point — Express app & static file serving
│   ├── package.json
│   ├── .env                           # Environment variables (not committed)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # PostgreSQL connection pool (pg)
│   │   ├── controllers/               # Route handler logic
│   │   ├── middleware/                # Auth middleware (JWT verification, role guards)
│   │   └── routes/                   # Express route definitions
│   └── scripts/
│       ├── init_db.js                 # Creates all database tables & views
│       └── seed_db.js                 # Seeds the database with sample/test data
│
└── healthsphere/                      # React frontend (Create React App)
    ├── package.json
    ├── public/
    └── src/
        ├── App.js                     # Main app component & routing
        ├── index.js                   # React entry point
        ├── components/                # Reusable UI components
        ├── pages/                     # Page-level components (Login, Dashboard, etc.)
        ├── context/                   # React Context (AuthContext, etc.)
        ├── styles/                    # Component-level CSS modules
        ├── lib/                       # API client / utility functions
        └── utils/                     # Helper functions
```

---

## 🖥️ Backend

- **Runtime:** Node.js with Express.js
- **Entry Point:** `backend/server.js`
- **Architecture:** RESTful API with MVC-style controllers and route separation
- **Authentication:** JSON Web Tokens (JWT) — tokens issued on login and verified via middleware
- **Role-Based Access Control:** Four roles — `patient`, `doctor`, `nurse`, `admin`
- **Key Routes:**
  - `POST /api/auth/login` — user login
  - `GET /api/patients/:id` — patient data
  - `GET /api/appointments` — appointment listings
  - `POST /api/appointments` — book an appointment
  - `GET /api/admin/users` — admin user management
- **Environment Variables** (create `backend/.env`):
  ```env
  PORT=5000
  NODE_ENV=development
  JWT_SECRET=your_jwt_secret_here
  CLIENT_URL=http://localhost:3000
  DATABASE_URL=postgres://postgres17:postgres17@localhost:5432/healthsphere
  ```

---

## 🌐 Frontend

- **Framework:** React (Create React App)
- **Port:** `http://localhost:3000` (dev)
- **Routing:** React Router v6 — protected routes based on user role
- **State Management:** React Context API (`AuthContext` for session)
- **API Communication:** Axios / Fetch to backend at `/api/*`
- **Pages:**
  - `/login` — authentication page
  - `/dashboard` — role-specific home dashboard
  - `/patients` — patient list & detail views (staff/admin)
  - `/appointments` — appointment management
  - `/profile` — user profile & settings
  - `/admin` — admin management panel
- **Environment Variables** (create `healthsphere/.env`):
  ```env
  REACT_APP_API_URL=/api
  ```

---

## 🗄️ Database

- **Engine:** PostgreSQL
- **ORM/Driver:** `pg` (node-postgres) — raw SQL queries via connection pool

### Tables

| Table              | Description                                              |
|--------------------|----------------------------------------------------------|
| `users`            | All system users (patient, doctor, nurse, admin)         |
| `patients`         | Extended patient details (DOB, blood type, contacts)     |
| `medical_history`  | Diagnosed conditions per patient                         |
| `allergies`        | Patient allergy records                                  |
| `prescriptions`    | Medications prescribed by doctors                        |
| `doctor_notes`     | Clinical notes written by doctors per patient            |
| `appointments`     | Scheduled, completed, or cancelled appointments          |
| `roles`            | Role reference table (Admin, Doctor, Nurse, Patient)     |

### Views

| View    | Description                                      |
|---------|--------------------------------------------------|
| `staff` | Joins `users` + `roles` for all non-patient users |

### Setup Commands

```bash
# From the root directory:
npm run db:init    # Creates all tables and views
npm run db:seed    # Seeds the database with test data
```

---

## 👤 Test User Credentials

> **Note:** Run `npm run db:seed` first to populate the database with these accounts.

### 🛡️ Admin
| Field    | Value                  |
|----------|------------------------|
| Username | `admin1`               |
| Password | `admin123`             |
| Role     | Admin                  |
| Name     | System Admin           |
| Email    | admin@health.com       |

### 🩺 Staff (Doctor)
| Field    | Value                  |
|----------|------------------------|
| Username | `doc_smith`            |
| Password | `doctor123`            |
| Role     | Doctor                 |
| Name     | Dr. Sarah Smith        |
| Email    | drsmith@health.com     |

### 🧑 Patient
| Field    | Value                    |
|----------|--------------------------|
| Username | `pat_doe`                |
| Password | `patient123`             |
| Role     | Patient                  |
| Name     | John Doe                 |
| Email    | john.doe@example.com     |

---

## 🚀 Quick Start (Development)

```bash
# 1. Install all dependencies
npm run install:all

# 2. Set up the database (ensure PostgreSQL is running)
npm run db:init
npm run db:seed

# 3. Run frontend and backend concurrently
npm run dev
```

> Frontend runs on `http://localhost:3000` | Backend API on `http://localhost:5000`
