// src/context/authContext.js
import React, { createContext, useContext, useState } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log('useAuth context', context);  // Log the context to see if it's available

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to provide the context to children
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Example state for auth

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  // Log to see if the AuthProvider is rendering and what values are being passed
  console.log('AuthProvider rendered', { isLoggedIn, login, logout });

  // Provide value to context
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
