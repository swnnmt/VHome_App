//AuthContext.js

import React, { createContext, useContext, useState } from 'react';

// Tạo context
const AuthContext = createContext();

// Provider để bọc toàn bộ app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (userData, token) => {
    setUser(userData);
    setToken (token);
  };

  const logout = () => {
    setUser(null);
  };
  
const signUp = (userData) => {
  setUser(userData);
};


  return (
    <AuthContext.Provider value={{ user, token, login, logout, signUp, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
