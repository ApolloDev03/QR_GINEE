// src/utils/auth.js
export const isAuthenticated = () => {
  // Check if UserLoginID is stored in localStorage
  return localStorage.getItem('UserLoginID') !== null;
};
