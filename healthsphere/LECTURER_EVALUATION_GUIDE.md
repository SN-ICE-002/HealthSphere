# HealthSphere - Lecturer Evaluation Guide

This document maps the project's source code to the specific requirements outlined in the rubric. This acts as a reference guide to easily locate where each feature and requirement has been implemented within the codebase.

---

## Checkpoint 2 Requirements

### 1. Responsive UI
**Requirement:** Mobile-friendly layout & Proper use of CSS, Flexbox, Grid, or UI libraries.
*   **Implementation:** The application does not rely on external CSS frameworks like Tailwind or Bootstrap; instead, it uses robust custom CSS with CSS Variables, Flexbox, and Grid for complete control.
*   **Key Files:**
    *   `src/index.css`: Contains the foundational design system including CSS variables for theming, typography, and responsive breakpoints. Contains `@media` queries for mobile responsiveness (e.g., hiding sidebar on smaller screens).
    *   `src/App.css` & `src/styles/*.css`: Extensively uses `display: flex` and `display: grid` to structure dashboards, forms, and navigation menus responsively.

### 2. React Core Features
**Requirement:** Functional components, `useState` and `useEffect` hooks, Props and component reuse.
*   **Implementation:** The entire application is built on modern React functional components.
*   **Key Files:**
    *   **Hooks (`useState`, `useEffect`):** Visible throughout the project. E.g., `src/pages/Login.js` securely handles authentication state and side-effects. `src/pages/patient/PatientProfile.js` manages local component states for editing forms.
    *   **Props & Component Reuse:** `src/components/DashboardLayout.js` acts as a wrapper component using the `children` prop to render varying dashboards seamlessly. `ProtectedRoute` is reused to safeguard routes.

### 3. Dynamic Interactivity
**Requirement:** Real-time updates using state, Virtual DOM updates handled through React (not manual DOM manipulation).
*   **Implementation:** There are no `document.getElementById` or manual DOM manipulations. All interactivity triggers React state updates.
*   **Key Files:**
    *   `src/context/DataContext.js`: Acts as a centralized state hub. Any change to the state (like adding a new appointment) instantly broadcasts changes through context, triggering Virtual DOM updates across all subscribed components without a page reload.

### 4. Client-Side Storage
**Requirement:** Use LocalStorage or IndexedDB, Store and retrieve user data or app data.
*   **Implementation:** Data is intentionally persisted across sessions using HTML5 `localStorage` wrapped in a utility service.
*   **Key Files:**
    *   `src/utils/lstorage.js`: A specialized module that safely parses and stringifies JSON for `localStorage`. 
    *   `src/context/DataContext.js`: Loads mock data into `localStorage` natively on first-load using `useEffect`, and subsequently retrieves session and operational data back up into the React Context.

### 5. SPA Navigation
**Requirement:** Multi-page feeling using React Router, Smooth navigation without page reload.
*   **Implementation:** Uses `react-router-dom` to provide a robust Single Page Application (SPA) experience.
*   **Key Files:**
    *   `src/App.js`: Configures the main `<Routes>` and maps paths like `/login`, `/admin/*`, and `/doctor/*` to discrete components. 
    *   `src/components/DashboardLayout.js`: Implements `<NavLink>` from React Router to toggle active route classes and facilitate seamless page transitions without hard refreshes.

### 6. Dashboard Features
**Requirement:** Charts (Chart.js / Recharts), Data visualization.
*   **Implementation:** Incorporates `recharts` to render visual telemetry dynamically linked to internal data stores.
*   **Key Files:**
    *   `src/pages/admin/AdminOverview.js`: Implements multiple `recharts` components including structured `BarChart` (for viewing Scheduled/Completed/Cancelled appointments) and `PieChart` (for mapping the breakdown of Staff Roles).

### 7. Form Validation
**Requirement:** Required fields, Input validation (email, numbers, etc.), Error messages for incorrect input.
*   **Implementation:** Secure local validation on interactive forms ensuring accurate data flows.
*   **Key Files:**
    *   `src/pages/Register.js`: Client-side structural validation on registration.
    *   `src/pages/Login.js`: Includes visual error messages if incorrect authentication details are provided.
    *   Extensively applied in sub-components where `required` properties strictly force constraints prior to DOM submission. React state maps exact context string into visible warning texts dynamically.

---

## Checkpoint 3 Requirements

### 1. Server-Side Development
**Requirement:** Develop back-end applications using Node.js & Integrate the back-end with a front-end interface built using React.
*   **Status:** Met
*   **Implementation & Key Files:** 
    *   The `backend/` directory is built on Node.js and Express.js (`backend/server.js`, `backend/package.json`).
    *   The `healthsphere/` directory is a React application that integrates and communicates with the backend API.

### 2. Database Integration
**Requirement:** Connect the application to a PostgreSQL database & Design and manage database schemas for application entities.
*   **Status:** Met
*   **Implementation & Key Files:** 
    *   Managed via the `pg` package. Database configuration is handled in `backend/src/config/db.js`.
    *   The application has a fully relational PostgreSQL structure covering users, patients, appointments, medical_history, etc.

### 3. RESTful API Development
**Requirement:** Design and implement RESTful API endpoints. Handle standard HTTP methods (GET, POST, PUT, DELETE). Implement proper error handling and return appropriate HTTP status codes.
*   **Status:** Met
*   **Implementation & Key Files:** 
    *   Endpoints are strictly RESTful. See `backend/src/routes/`.
    *   **GET**: Fetching records (e.g., `router.get('/patient/:id')` in `appointmentRoutes.js`).
    *   **POST**: Creating records (e.g., `router.post('/')` in `appointmentRoutes.js`).
    *   **PUT**: Updating records fully (e.g., `router.put('/:id')` in `appointmentRoutes.js`).
    *   **DELETE**: Removing records (e.g., `router.delete('/:id')` in `appointmentRoutes.js`).
    *   Proper status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 500 Server Error) are returned natively across all controllers (e.g., `authController.js`).

### 4. Client–Server Communication
**Requirement:** Enable data exchange between front-end and back-end using Fetch API / AJAX. Ensure successful end-to-end data flow.
*   **Status:** Met
*   **Implementation & Key Files:** 
    *   The React frontend uses standard `fetch` API calls to communicate with the Node.js backend.
    *   Registration, login, and data fetching for dashboards correctly pull from the PostgreSQL DB through the Node backend to the React interface.

### 5. CRUD Operations
**Requirement:** Implement full Create, Read, Update, and Delete (CRUD) functionality. Apply CRUD operations to relevant entities (Routes, Bookings, Students, Patients).
*   **Status:** Met
*   **Implementation & Key Files:** 
    *   *Note: In HealthSphere, "Bookings" map to "Appointments" and "Students" map to generic "Users/Doctors".*
    *   **Patients** (Create, Read): Handled in `authController.js` and `patientController.js`.
    *   **Bookings/Appointments** (Create, Read, Update, Delete): Handled entirely in `backend/src/routes/appointmentRoutes.js`.

### 6. Authentication & Authorization
**Requirement:** Implement user authentication (e.g., login and logout functionality). Use secure authentication methods (token-based or session-based). Apply role-based access control (RBAC) (Admin, User). Protect restricted routes based on user roles.
*   **Status:** Met
*   **Implementation & Key Files:** 
    *   `authController.js` logic checks user credentials.
    *   Implemented JWT (JSON Web Tokens). Tokens are generated and signed during the login phase in `authController.js` (`jwt.sign`).
    *   Handled via custom middleware checking for `req.user.role`. See `backend/src/middleware/authMiddleware.js` (`isAdmin`, `isDoctor`).
    *   Route protection is available via `verifyToken` middleware in `authMiddleware.js`.

### 7. Input Validation & Security
**Requirement:** Validate incoming data (e.g., required fields, correct formats). Hash passwords before storing them in the database.
*   **Status:** Met
*   **Implementation & Key Files:** 
    *   Required payload checks are implemented before query execution (e.g., `if (!email || !password || !role)` in `authController.js`).
    *   Implemented using `bcryptjs`. The register method in `authController.js` generates a salt and hashes the password before insertion into the database, and login uses `bcrypt.compare()` for verification.