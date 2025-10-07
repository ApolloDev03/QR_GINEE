// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = Boolean(localStorage.getItem('authToken')); // Adjust this based on your authentication logic
  const location = useLocation();

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
