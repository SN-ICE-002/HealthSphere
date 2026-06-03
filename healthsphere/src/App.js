import React from "react";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "./components/ui/sonner";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { DataProvider, useData } from "./context/DataContext";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

// Patient pages
import PatientOverview from "./pages/patient/PatientOverview";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientRecord from "./pages/patient/PatientRecord";
import PatientAppointement from "./pages/patient/PatientAppointement";
import PatientNotifications from "./pages/patient/PatientNotifications";

// Doctor pages
import DoctorOverview from "./pages/doctor/DoctorOverview";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorAppointements from "./pages/doctor/DoctorAppointements";
import DoctorEmergency from "./pages/doctor/DoctorEmergency";

// Admin pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminStaffs from "./pages/admin/AdminStaffs";
import AdminAppointement from "./pages/admin/AdminAppointement";
import AdminReports from "./pages/admin/AdminReports";
import AdminEmergency from "./pages/admin/AdminEmergency";
import AdminHelpDesk from "./pages/admin/AdminHelpDesk";

/**
 * ProtectedRoute handles authentication and role-based access control.
 * Removed TypeScript interface for props.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useData();

  // No user authenticated
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // User doesn't have required role
  if (!currentUser.role || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role
  return <DashboardLayout>{children ? children : <Outlet />}</DashboardLayout>;
}

/**
 * RootRedirect determines which dashboard to show based on user role.
 * Shows login if no user is authenticated.
 */
function RootRedirect() {
  const { currentUser } = useData();

  // No user logged in - show login page
  if (!currentUser) {
    return <Login />;
  }

  // User is authenticated - redirect based on role
  if (currentUser && currentUser.role) {
    switch (currentUser.role) {
      case 'patient': 
        return <Navigate to="/patient" replace />;
      case 'doctor': 
      case 'nurse': 
        return <Navigate to="/doctor" replace />;
      case 'admin': 
        return <Navigate to="/admin" replace />;
      default: 
        return <Login />;
    }
  }

  // Fallback - show login
  return <Login />;
}

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <DataProvider>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Patient routes */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route path="/patient" element={<PatientOverview />} />
              <Route path="/patient/profile" element={<PatientProfile />} />
              <Route path="/patient/records" element={<PatientRecord />} />
              <Route path="/patient/appointments" element={<PatientAppointement />} />
              <Route path="/patient/notifications" element={<PatientNotifications />} />
            </Route>

            {/* Doctor/Nurse routes */}
            <Route element={<ProtectedRoute allowedRoles={['doctor', 'nurse']} />}>
              <Route path="/doctor" element={<DoctorOverview />} />
              <Route path="/doctor/schedule" element={<DoctorSchedule />} />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/doctor/appointments" element={<DoctorAppointements />} />
              <Route path="/doctor/emergency" element={<DoctorEmergency />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/patients" element={<AdminPatients />} />
              <Route path="/admin/staff" element={<AdminStaffs />} />
              <Route path="/admin/appointments" element={<AdminAppointement />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/emergency" element={<AdminEmergency />} />
              <Route path="/admin/help-desk" element={<AdminHelpDesk />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
);

export default App;