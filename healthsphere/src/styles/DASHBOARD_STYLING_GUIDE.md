# HealthSphere Dashboard CSS Styling Guide

## Overview

This document describes the new dashboard-specific CSS styling system implemented for HealthSphere. The styling is organized into three main sections: **Patient Dashboard**, **Doctor Dashboard**, and **Admin Dashboard**, each with unique visual styling while maintaining a consistent layout structure.

---

## File Structure

```
src/
├── styles/
│   └── dashboards.css          # All dashboard-specific styles (1000+ lines)
├── index.css                    # Global styles (imports dashboards.css)
├── App.css                      # Utility CSS classes
└── components/
    └── DashboardLayout.js       # Updated with new wrapper classes
└── pages/
    ├── patient/
    │   └── PatientOverview.js   # Updated with patient-specific classes
    ├── doctor/
    │   └── DoctorOverview.js    # Updated with doctor-specific classes
    └── admin/
        └── AdminOverview.js     # Updated with admin-specific classes
```

---

## Layout Architecture

### Main Structure

```
.dashboard-main-wrapper (flex h-screen)
├── .dashboard-sidebar (fixed on desktop, overlay on mobile)
└── .dashboard-content-wrapper (flex-1)
    ├── .dashboard-header (sticky, top bar)
    └── .dashboard-main-content (scrollable main content area)
```

### Key CSS Classes

| Class | Purpose | Usage |
|-------|---------|-------|
| `dashboard-main-wrapper` | Main layout container | Root div in DashboardLayout |
| `dashboard-sidebar` | Sidebar area | Aside element in DashboardLayout |
| `dashboard-content-wrapper` | Main content wrapper | New wrapper after sidebar |
| `dashboard-header` | Top navigation bar | Sticky header |
| `dashboard-main-content` | Scrollable content area | Page content container |

---

## Patient Dashboard Styling

### Colors & Styling
- **Primary Color**: Teal green (#2D9F5F)
- **Emphasis**: Health-focused, calming design
- **Cards**: Gradient backgrounds on stat cards (hover effect with lift animation)

### Key Classes

#### Stat Cards
```css
.patient-stats-grid                 /* Responsive grid layout */
.patient-stat-card                  /* Individual stat card with gradient */
.patient-stat-card.warning          /* Warning state (yellow) */
.patient-stat-card.success          /* Success state (green) */
.patient-stat-card.info             /* Info state (blue) */
.patient-stat-icon                  /* Icon container in stat card */
.patient-stat-content               /* Content wrapper in stat card */
```

#### Cards & Lists
```css
.patient-content-grid               /* Main content area grid */
.patient-card                       /* Individual content card */
.patient-appointment-item           /* Appointment list item */
.patient-appointment-time           /* Time badge in appointment */
.patient-notification-item          /* Notification list item */
.patient-notification-icon          /* Icon in notification */
```

### Example Usage

```jsx
// Patient overview wrapper
<div className="patient-dashboard">
  {/* Stat cards */}
  <div className="patient-stats-grid">
    <div className="patient-stat-card">
      <div className="patient-stat-icon"><Icon /></div>
      <div className="patient-stat-content">
        <p className="text-2xl font-bold">42</p>
        <p>Appointments</p>
      </div>
    </div>
  </div>

  {/* Content cards */}
  <div className="patient-content-grid">
    <div className="patient-card">
      <h2>Upcoming Appointments</h2>
      {appointments.map(apt => (
        <div key={apt.id} className="patient-appointment-item">
          <div className="patient-appointment-time">{apt.date}</div>
          {/* ... */}
        </div>
      ))}
    </div>
  </div>
</div>
```

---

## Doctor Dashboard Styling

### Colors & Styling
- **Primary Color**: Teal green with colored stat cards
- **Emphasis**: Schedule and patient management
- **Cards**: Individual color coding (primary, success, warning, destructive)
- **Emergency Mode**: Pulsing animation banner

### Key Classes

#### Stat Cards
```css
.doctor-stats-grid                  /* Grid layout for stat cards */
.doctor-stat-card                   /* Base stat card */
.doctor-stat-card.primary           /* Primary colored card */
.doctor-stat-card.success           /* Success colored card */
.doctor-stat-card.warning           /* Warning colored card */
.doctor-stat-card.destructive       /* Destructive/red card */
.doctor-stat-icon                   /* Icon container */
```

#### Schedule Section
```css
.doctor-emergency-banner            /* Emergency mode banner with pulse effect */
.doctor-schedule-section            /* Schedule container card */
.doctor-appointment-item            /* Individual appointment row */
.doctor-appointment-time            /* Time display with gradient */
.doctor-appointment-info            /* Appointment details */
.doctor-appointment-title           /* Patient name */
.doctor-appointment-reason          /* Appointment reason */
.doctor-patient-badge               /* Status badge */
```

### Example Usage

```jsx
<div className="doctor-dashboard">
  {emergencyMode && (
    <div className="doctor-emergency-banner">
      🚨 EMERGENCY MODE ACTIVE
    </div>
  )}

  <div className="doctor-stats-grid">
    <div className="doctor-stat-card primary">
      {/* Card content */}
    </div>
    <div className="doctor-stat-card success">
      {/* Card content */}
    </div>
  </div>

  <div className="doctor-schedule-section">
    <h2>Today's Schedule</h2>
    {appointments.map(apt => (
      <div key={apt.id} className="doctor-appointment-item">
        <div className="doctor-appointment-time">{apt.time}</div>
        <div className="doctor-appointment-info">
          <p className="doctor-appointment-title">{apt.patientName}</p>
          <p className="doctor-appointment-reason">{apt.reason}</p>
        </div>
      </div>
    ))}
  </div>
</div>
```

---

## Admin Dashboard Styling

### Colors & Styling
- **Primary Color**: Teal green
- **Emphasis**: Data visualization and system management
- **Cards**: Top border accent (color-coded by function)
- **Features**: Data tables, status badges, user lists

### Key Classes

#### Stat Cards with Accents
```css
.admin-stats-grid                   /* Grid for admin stat cards */
.admin-stat-card                    /* Base stat card with top border */
.admin-stat-card.patients           /* Patients card (blue accent) */
.admin-stat-card.staff              /* Staff card (purple accent) */
.admin-stat-card.appointments       /* Appointments card (pink accent) */
.admin-stat-card.reports            /* Reports card (amber accent) */
.admin-stat-label                   /* Small label above stat */
.admin-stat-value                   /* Large number display */
.admin-stat-change                  /* Change indicator (positive/negative) */
.admin-stat-change.positive         /* Green positive change */
.admin-stat-change.negative         /* Red negative change */
```

#### Section & Table Classes
```css
.admin-content-grid                 /* Main content grid layout */
.admin-section                      /* Content section card */
.admin-chart-container              /* Chart wrapper */
.admin-data-table                   /* Data table styling */
.admin-list-item                    /* List item row */
.admin-list-avatar                  /* User avatar circle */
.admin-badge                        /* Status badge */
.admin-badge-info                   /* Info badge */
.admin-badge-success                /* Success badge (green) */
.admin-badge-warning                /* Warning badge (orange) */
.admin-btn                          /* Action button */
.admin-btn-primary                  /* Primary action button */
.admin-btn-success                  /* Success action button */
.admin-btn-danger                   /* Danger/delete button */
```

### Example Usage

```jsx
<div className="admin-dashboard">
  <div className="admin-stats-grid">
    <div className="admin-stat-card patients">
      <p className="admin-stat-label">Patients</p>
      <p className="admin-stat-value">284</p>
      <p className="admin-stat-change positive">↑ 12% from last month</p>
    </div>
    <div className="admin-stat-card staff">
      <p className="admin-stat-label">Staff</p>
      <p className="admin-stat-value">45</p>
      <p className="admin-stat-change positive">↑ 2 new hires</p>
    </div>
  </div>

  <div className="admin-content-grid">
    <div className="admin-section">
      <h2>System Status</h2>
      <table className="admin-data-table">
        {/* Table content */}
      </table>
    </div>
  </div>
</div>
```

---

## Responsive Design

All dashboard styling includes responsive breakpoints:

### Breakpoints
- **Mobile**: < 640px (single column)
- **Tablet**: 640px - 768px (2 columns)
- **Desktop**: > 768px (4 columns or full featured layout)

### Responsive Changes
```css
/* Mobile (640px and down) */
- Single column grids
- Reduced padding
- Stacked list items
- Smaller font sizes

/* Tablet (640px - 768px) */
- 2-column grids
- Standard padding

/* Desktop (768px+) */
- Full featured layout
- 4-column grids
- Full-width charts
- Side-by-side content
```

---

## Animations & Effects

### Available Animations

#### Hover Effects
- **Stat Cards**: Lift up animation (translateY -4px to -2px)
- **Appointment Items**: Slide right (translateX 4px)
- **Links**: Color transitions

#### Fade Effects
- **Slide In Up**: `slideInUp` (300ms)
- **Fade In**: `fadeIn` (300ms)

#### Pulse Animation
- **Emergency Banner**: Continuous pulse effect

### Accessibility
- Respects `prefers-reduced-motion` setting
- Animations are disabled for users who prefer reduced motion

---

## Color System Integration

The dashboard styling uses the existing CSS Variables system:

### Primary Variables
```css
--primary: 173 58% 39%;              /* Teal green */
--primary-foreground: 0 0% 100%;     /* White */
--success: 152 60% 40%;              /* Green */
--warning: 38 92% 50%;               /* Orange/Amber */
--destructive: 0 72% 51%;            /* Red */
--emergency: 0 84% 60%;              /* Bright red */
```

### Using Variables in Custom CSS
```css
background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.6));
color: hsl(var(--primary-foreground));
border-color: hsl(var(--border));
```

---

## Implementation Examples

### Full Patient Dashboard
See [src/pages/patient/PatientOverview.js](../pages/patient/PatientOverview.js)

### Full Doctor Dashboard
See [src/pages/doctor/DoctorOverview.js](../pages/doctor/DoctorOverview.js)

### Full Admin Dashboard
See [src/pages/admin/AdminOverview.js](../pages/admin/AdminOverview.js)

### Layout Component
See [src/components/DashboardLayout.js](../components/DashboardLayout.js)

---

## Best Practices

### When Adding New Components

1. **Use Semantic Class Names**
   ```css
   .patient-card          /* Good */
   .p-card                /* Less descriptive */
   ```

2. **Follow Gradient Patterns**
   ```css
   background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
   ```

3. **Maintain Spacing Consistency**
   - Gap: 1rem between major sections
   - Padding: 1.5rem for cards
   - Border radius: var(--radius) for consistency

4. **Use CSS Variables for Colors**
   ```css
   color: hsl(var(--foreground));      /* Good */
   color: #000;                         /* Avoid hardcoding */
   ```

5. **Test Responsive Behavior**
   - Test at 640px, 768px, 1024px breakpoints
   - Check mobile overlay sidebar
   - Verify touch targets (min 44px)

---

## Customization Guide

### To Change Primary Dashboard Color

Edit [src/styles/dashboards.css](./dashboards.css) and update:

```css
.patient-dashboard {
  --dashboard-primary: 173 58% 39%;  /* Change this HSL value */
}
```

### To Modify Card Styling

Update the `.admin-stat-card`, `.doctor-stat-card`, or `.patient-stat-card` classes:

```css
.doctor-stat-card {
  background-color: /* new color */;
  box-shadow: /* new shadow */;
}
```

### To Add New Role Dashboard

1. Create role-specific CSS section:
   ```css
   .nurse-dashboard {
     --dashboard-primary: /* HSL value */;
   }
   ```

2. Define role-specific components
3. Apply to role overview page
4. Update DashboardLayout with role-based classes if needed

---

## Testing Checklist

- [ ] Patient dashboard displays correctly on all screen sizes
- [ ] Doctor dashboard emergency banner pulses
- [ ] Admin stat cards show correct colors
- [ ] Sidebar collapses on mobile devices
- [ ] All hover effects work smoothly
- [ ] Charts render properly in admin dashboard
- [ ] Navigation links highlight correctly
- [ ] Color contrast meets accessibility standards
- [ ] Page loads without CSS errors
- [ ] Responsive breakpoints work as expected

---

## File Statistics

- **Dashboard CSS**: 1,100+ lines
- **Global CSS Import**: Updated to include dashboards.css
- **Components Updated**: 4 (DashboardLayout + 3 Overview pages)
- **Unused Imports Removed**: All cleaned
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

---

## Troubleshooting

### Styles Not Appearing
1. Clear browser cache (Ctrl+Shift+Delete)
2. Verify `src/styles/dashboards.css` exists
3. Check index.css has import: `@import './styles/dashboards.css';`
4. Restart dev server: `npm start`

### Classes Not Working
1. Verify class names match exactly (case-sensitive)
2. Check CSS selector specificity
3. Use browser DevTools to inspect computed styles
4. Ensure parent classes are applied correctly

### Mobile Layout Issues
1. Check viewport meta tag in public/index.html
2. Test with DevTools mobile emulation
3. Verify media query breakpoints
4. Check sidebar z-index values

---

## Future Enhancements

- [ ] Dark mode specific dashboard styling
- [ ] Print-friendly dashboard layouts
- [ ] Custom color themes per role (admin settings)
- [ ] Dashboard widget customization
- [ ] Additional animation presets
- [ ] Accessibility color contrast checker
- [ ] Performance optimization for large datasets
