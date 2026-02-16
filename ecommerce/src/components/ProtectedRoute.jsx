import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/UseAuth';

/**
 * ProtectedRoute - Wrapper component for routes that require authentication
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} props.requiredRole - Required role (optional)
 * @param {string} props.redirectTo - Path to redirect if unauthorized (default: '/login')
 */
export const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * AdminRoute - Convenience wrapper for admin-only routes
 * Checks if user has ROLE_ADMIN in their roles array
 */
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has ROLE_ADMIN in their roles array
  const isAdmin = user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ROLE_admin');
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * PublicRoute - Route that redirects to home if user is already authenticated
 * Useful for login/signup pages
 */
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;