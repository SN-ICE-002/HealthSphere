import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useData } from './context/DataContext';

/**
 * ProtectedRoute Component
 * @param {ReactNode} children - The component to render if authorized
 * @param {string[]} allowedRoles - Optional array of roles allowed to access this route
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useData();
  const location = useLocation();

  // 1. If not logged in, redirect to login page
  // We save the current location so we can redirect them back after they log in
  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. If roles are specified, check if the user has the required permission
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // If they don't have the right role, send them to their own dashboard
    const defaultPath = currentUser.role === 'patient' ? '/patient' : 
                        (currentUser.role === 'admin' ? '/admin' : '/doctor');
    
    return <Navigate to={defaultPath} replace />;
  }

  // 3. If all checks pass, render the protected content
  return children;
};

export default ProtectedRoute;