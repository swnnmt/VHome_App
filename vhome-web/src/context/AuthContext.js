import React, { createContext, useContext, useState, useEffect } from 'react';

// Tạo context
const AuthContext = createContext();

// Provider để bọc toàn bộ app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Phục hồi user & token từ localStorage khi load app
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const signUp = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, signUp, setUser, setToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
