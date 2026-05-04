import React from 'react';

// Bypass authentication for guest access
export default function ProtectedRoute({ children }) {
  return children;
}
