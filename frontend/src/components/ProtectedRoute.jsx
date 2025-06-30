
/*
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
*/

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();


  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
