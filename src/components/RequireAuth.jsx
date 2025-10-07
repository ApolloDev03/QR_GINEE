import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Check for the auth token
  const location = useLocation(); // Get the current route location

  console.log('Auth Check - Is Authenticated:', isAuthenticated, 'Path:', location.pathname); // Debug logs

  // Define paths that should redirect to '/userlogin'
  const userLoginPaths = ['/myqr', '/userprofile','/userdetail'];

  // Define paths that should redirect to '/resellerlogin'
  const resellerLoginPaths = ['/myorder', '/myqrcode', '/neworder', '/paymentlist', '/myaccount'];

  
  // Define paths that should redirect to '/login'
  const LoginPaths = ['/logindetail','/profiledetail'];

  if (!isAuthenticated) {
    // Check if the current path matches the userLoginPaths array
    if (userLoginPaths.includes(location.pathname)) {
      return <Navigate to="/userlogin" />;
    }

    // Check if the current path matches the resellerLoginPaths array
    if (resellerLoginPaths.includes(location.pathname)) {
      return <Navigate to="/resellerlogin" />;
    }

     // Check if the current path matches the LoginPaths array
     if (LoginPaths.includes(location.pathname)) {
      return <Navigate to="/login" />;
    }
  }

  // If authenticated, render the children (protected content)
  return children;
};

export default RequireAuth;
