# HealthSphere Pages CSS - Implementation Guide

## ✅ Styling Complete - CSS Classes Ready

All CSS classes are now available in `src/styles/pages.css`. This guide shows how to apply them.

---

## 📋 CSS Classes Summary

### Form Elements
```css
.form-group           /* Wrapper for input groups */
.form-label           /* Label styling */
.form-input           /* Text inputs */
.form-select          /* Select dropdowns */
.form-textarea        /* Text areas */
.form-error           /* Error text */
.form-error-alert     /* Error alert box */
```

### Buttons
```css
.btn                  /* Base button */
.btn-primary          /* Primary action */
.btn-secondary        /* Secondary action */
.btn-success          /* Success/confirm */
.btn-destructive      /* Delete/danger */
.btn-sm / .btn-lg     /* Sizes */
.btn-icon             /* Icon-only buttons */
```

### Tables
```css
.data-table           /* Main table */
.data-table-actions   /* Action buttons container */
.data-table-action-*  /* Edit, delete, success variants */
.data-table-hide-mobile /* Hidden on mobile */
```

### Cards & Lists
```css
.card                 /* Card container */
.card-header          /* Card header */
.card-title           /* Card title */
.card-body            /* Card body */
.list-item            /* List item */
.list-item-avatar     /* Avatar in list */
.list-item-content    /* Content wrapper */
```

### Status Elements
```css
.badge                /* Badge container */
.badge-primary/success/warning/destructive /* Badge variants */
.empty-state          /* Empty state container */
```

---

## 🎯 Page-by-Page Implementation

### 1. LOGIN PAGE
**File:** `src/pages/Login.js`

**CSS Classes to Apply:**
```jsx
// Container
<div className="min-h-screen flex items-center justify-center bg-background">
  <div className="w-full max-w-md px-4">
    
    // Card
    <div className="card">
      
      // Form groups
      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-input" type="email" />
      </div>
      
      // Button
      <button className="btn btn-primary btn-lg w-full">
        Sign In
      </button>
    </div>
  </div>
</div>
```

---

### 2. PATIENT PAGES

#### PatientOverview.js ✅
**Status:** Already styled with patient-specific classes

#### PatientAppointement.js
**CSS Classes:**
```jsx
<div className="patient-dashboard">
  <div className="page-header-actions">
    <h1 className="page-title">Appointments</h1>
    <button className="btn btn-primary">Book Appointment</button>
  </div>
  
  {/* Form */}
  <div className="appointment-form-wrapper">
    <form className="appointment-form-grid">
      <div className="form-group">
        <label className="form-label">Doctor</label>
        <select className="form-select"></select>
      </div>
    </form>
  </div>
  
  {/* Table */}
  <div className="card">
    <table className="data-table">
      <thead>
        <tr>
          <th>Doctor</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Dr. Smith</td>
          <td>2024-04-20</td>
          <td className="data-table-actions">
            <button className="data-table-action-btn data-table-action-success">Complete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

#### PatientProfile.js
**CSS Classes:**
```jsx
<div className="patient-dashboard">
  <div className="page-header">
    <h1 className="page-title">My Profile</h1>
  </div>
  
  <div className="profile-container">
    {/* Left side - Info */}
    <div className="profile-info-card">
      <div className="profile-avatar">AB</div>
      <h2 className="profile-name">Alice Brown</h2>
      <p className="profile-role">patient</p>
      
      <div className="profile-info-item">
        <p className="profile-info-label">Email</p>
        <p className="profile-info-value">alice@example.com</p>
      </div>
    </div>
    
    {/* Right side - Edit Form */}
    <div className="profile-edit-form">
      <div className="profile-form-section">
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" />
        </div>
      </div>
      <div className="profile-form-actions">
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </div>
  </div>
</div>
```

#### PatientRecord.js
**CSS Classes:**
```jsx
<div className="patient-dashboard">
  <div className="page-header">
    <h1 className="page-title">Medical Records</h1>
  </div>
  
  <div className="records-grid">
    <div className="records-card">
      <div className="records-card-header">
        <h3 className="records-card-title">Medical History</h3>
      </div>
      
      <div className="records-item">
        <div className="records-item-icon">
          <Heart size={18} />
        </div>
        <div className="records-item-content">
          <p className="records-item-title">Hypertension</p>
          <p className="records-item-subtitle">Diagnosed 2020</p>
        </div>
      </div>
    </div>
    
    <div className="records-card">
      <div className="records-card-header">
        <h3 className="records-card-title">Allergies</h3>
      </div>
      <span className="allergy-pill">Penicillin</span>
      <span className="allergy-pill">Peanuts</span>
    </div>
  </div>
</div>
```

#### PatientNotifications.js
**CSS Classes:**
```jsx
<div className="patient-dashboard">
  <div className="page-header-actions">
    <h1 className="page-title">Notifications</h1>
    <button className="btn btn-secondary btn-sm">Mark All Read</button>
  </div>
  
  <div className="notifications-container">
    {notifications.map(n => (
      <div key={n.id} className={`notification-item ${n.type} ${n.read ? '' : 'unread'}`}>
        <div className="notification-icon">
          <Bell size={18} />
        </div>
        <div className="notification-content">
          <p className="notification-message">{n.message}</p>
          <p className="notification-date">{n.date}</p>
        </div>
        {!n.read && <div className="notification-unread-indicator"></div>}
      </div>
    ))}
  </div>
</div>
```

---

### 3. DOCTOR PAGES

#### DoctorOverview.js ✅
**Status:** Already styled with doctor-specific classes

#### DoctorAppointements.js
**CSS Classes:**
```jsx
<div className="doctor-dashboard">
  <div className="page-header">
    <h1 className="page-title">Appointments</h1>
    <p className="page-subtitle">Manage patient appointments</p>
  </div>
  
  <div className="card">
    <table className="data-table">
      <thead>
        <tr>
          <th>Patient</th>
          <th>Date</th>
          <th>Time</th>
          <th>Reason</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map(apt => (
          <tr key={apt.id}>
            <td>{apt.patientName}</td>
            <td>{apt.date}</td>
            <td>{apt.time}</td>
            <td>{apt.reason}</td>
            <td>
              <span className={`badge badge-${apt.status}`}>
                {apt.status}
              </span>
            </td>
            <td className="data-table-actions">
              <button className="data-table-action-btn data-table-action-success">Complete</button>
              <button className="data-table-action-btn data-table-action-delete">Cancel</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

#### DoctorPatients.js
**CSS Classes:**
```jsx
<div className="doctor-dashboard">
  <div className="page-header">
    <h1 className="page-title">My Patients</h1>
  </div>
  
  {/* Search */}
  <div className="card mb-6">
    <div className="search-wrapper">
      <Search size={18} className="search-icon" />
      <input 
        type="text" 
        placeholder="Search patients..." 
        className="search-input"
      />
    </div>
  </div>
  
  {/* Patient Grid */}
  <div className="patient-grid">
    {patients.map(p => (
      <div 
        key={p.id} 
        className="patient-card-item"
        onClick={() => handleSelectPatient(p.id)}
      >
        <div className="patient-card-avatar">
          {p.name.split(' ').map(n => n[0]).join('')}
        </div>
        <h3 className="patient-card-name">{p.name}</h3>
        <p className="patient-card-info">{p.gender} • {p.bloodType}</p>
      </div>
    ))}
  </div>
</div>
```

#### DoctorSchedule.js
**CSS Classes:**
```jsx
<div className="doctor-dashboard">
  <div className="page-header">
    <h1 className="page-title">My Schedule</h1>
  </div>
  
  {/* Filter */}
  <div className="schedule-filter-wrapper">
    <div>
      <p className="schedule-filter-label">Filter by Date</p>
      <div className="schedule-filter-inputs">
        <input type="date" className="form-input" />
        <button className="schedule-clear-btn">Clear Filter</button>
      </div>
    </div>
  </div>
  
  {/* Schedule Table */}
  <div className="card">
    <table className="data-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Patient</th>
          <th>Reason</th>
          <th>Status</th>
        </tr>
      </thead>
    </table>
  </div>
</div>
```

#### DoctorEmergency.js
**CSS Classes:**
```jsx
<div className="doctor-dashboard">
  <div className="page-header">
    <h1 className="page-title">Emergency Mode</h1>
  </div>
  
  <div className="card mb-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <AlertTriangle size={32} className="text-emergency" />
      <div>
        <h3 className="font-semibold">Emergency Access</h3>
        <p className="text-sm text-muted-foreground">
          When activated, access all patient records
        </p>
      </div>
      <button className="btn btn-destructive">Activate</button>
    </div>
  </div>
  
  {emergencyMode && (
    <div className="patient-grid">
      {allPatients.map(p => (
        <div key={p.id} className="patient-card-item">
          {/* Patient card content */}
        </div>
      ))}
    </div>
  )}
</div>
```

---

### 4. ADMIN PAGES

#### AdminOverview.js ✅
**Status:** Already styled with admin-specific classes

#### AdminAppointement.js
**CSS Classes:**
```jsx
<div className="admin-dashboard">
  <div className="page-header">
    <h1 className="page-title">All Appointments</h1>
  </div>
  
  <div className="card">
    <table className="data-table">
      <thead>
        <tr>
          <th>Patient</th>
          <th>Doctor</th>
          <th>Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map(apt => (
          <tr key={apt.id}>
            <td>{apt.patientName}</td>
            <td>{apt.doctorName}</td>
            <td>{apt.date}</td>
            <td>
              <span className={`badge badge-${apt.status}`}>
                {apt.status}
              </span>
            </td>
            <td className="data-table-actions">
              <button className="data-table-action-btn data-table-action-edit">
                <Edit2 size={14} />
              </button>
              <button className="data-table-action-btn data-table-action-delete">
                <Trash2 size={14} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

#### AdminPatients.js
**CSS Classes:**
```jsx
<div className="admin-dashboard">
  <div className="page-header-actions">
    <h1 className="page-title">Patients</h1>
    <button className="btn btn-primary">Add Patient</button>
  </div>
  
  {/* Add/Edit Form */}
  <div className="form-card">
    <div className="form-card-header" onClick={() => setFormOpen(!formOpen)}>
      <h3 className="form-card-title">Add New Patient</h3>
      <div className="form-card-toggle"></div>
    </div>
    
    <div className="form-card-content">
      <form className="form-card-body">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" type="text" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" />
        </div>
      </form>
      <div className="form-card-actions">
        <button className="btn btn-primary">Save Patient</button>
        <button className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
  
  {/* Search */}
  <div className="card mb-6">
    <div className="search-wrapper">
      <Search size={18} className="search-icon" />
      <input type="text" placeholder="Search patients..." className="search-input" />
    </div>
  </div>
  
  {/* Patients Table */}
  <div className="card">
    <table className="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Blood Type</th>
          <th>Actions</th>
        </tr>
      </thead>
    </table>
  </div>
</div>
```

#### AdminStaffs.js
**CSS Classes:**
```jsx
<div className="admin-dashboard">
  <div className="page-header-actions">
    <h1 className="page-title">Staff Members</h1>
    <button className="btn btn-primary">Add Staff</button>
  </div>
  
  {/* Form - Same pattern as AdminPatients */}
  <div className="form-card">
    {/* Form fields */}
  </div>
  
  {/* Staff Table */}
  <div className="card">
    <table className="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Specialty</th>
          <th>Actions</th>
        </tr>
      </thead>
    </table>
  </div>
</div>
```

#### AdminEmergency.js
**CSS Classes:**
Same pattern as DoctorEmergency.js but with admin-dashboard class

#### AdminReports.js
**CSS Classes:**
```jsx
<div className="admin-dashboard">
  <div className="page-header">
    <h1 className="page-title">Reports & Analytics</h1>
  </div>
  
  <div className="admin-content-grid">
    <div className="admin-section">
      <h2>Appointments per Day</h2>
      <div className="admin-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            {/* Chart */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    
    <div className="admin-section">
      <h2>Staff Workload</h2>
      <div className="admin-chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={workloadData}>
            {/* Chart */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
</div>
```

---

## 🚀 Quick Reference

### Always Include
1. **Role wrapper class**: `patient-dashboard`, `doctor-dashboard`, or `admin-dashboard`
2. **Page structure**: `page-header`, `page-title`, `page-subtitle`
3. **Form validation**: Use `form-error-alert` for errors

### Common Patterns
```jsx
// Form Group
<div className="form-group">
  <label className="form-label">Label</label>
  <input className="form-input" />
</div>

// Button
<button className="btn btn-primary">Action</button>

// Table Row with Actions
<tr>
  <td>Data</td>
  <td className="data-table-actions">
    <button className="data-table-action-btn data-table-action-edit">Edit</button>
    <button className="data-table-action-btn data-table-action-delete">Delete</button>
  </td>
</tr>

// Status Badge
<span className="badge badge-success">Active</span>

// Empty State
<div className="empty-state">
  <div className="empty-state-icon">Icon</div>
  <h3 className="empty-state-title">No items</h3>
  <p className="empty-state-description">Description</p>
</div>
```

---

## 📱 Responsive Notes
- All components are mobile-first responsive
- Tables hide columns automatically on mobile (use `.data-table-hide-mobile`)
- Forms stack vertically on mobile
- Grids adjust column count based on screen size
- All buttons are touch-friendly (min 44px height)

---

## ✨ Features
- ✅ Consistent styling across all pages
- ✅ Light/Dark mode support (via CSS variables)
- ✅ Smooth animations and transitions
- ✅ Accessible color contrast ratios
- ✅ Mobile-responsive by default
- ✅ Touch-friendly interactions
- ✅ Reduce motion support for accessibility
