// src/utils/withAuth.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

const withAuth = (Component) => {
  return (props) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
