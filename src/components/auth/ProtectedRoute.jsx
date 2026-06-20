import React from 'react';
import { useSelector } from 'react-redux';
import AccessDenied from './AccessDenied';

export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.auth.profile);
  const isAuthenticated = user && profile;

  if (!isAuthenticated) {
    return <AccessDenied />;
  }

  return children;
}
