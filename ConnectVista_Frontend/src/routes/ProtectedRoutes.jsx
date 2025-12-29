"use client";
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], checkVerification = false }) => {
  const { isAuthenticated, user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check provider verification status - BUT only for service provider routes
  // Don't check verification for the verification page itself
  if (checkVerification && user.role === 'provider' && location.pathname !== '/service-provider/verify') {
    if (!profile?.isVerified) {
      // Redirect to verification page if not verified
      return <Navigate to="/service-provider/verify" replace />;
    }
  }

  // Special verification page access logic
  if (location.pathname === '/service-provider/verify') {
    if (profile?.isVerified) {
      // Redirect to dashboard if already verified
      return <Navigate to="/service-provider/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;