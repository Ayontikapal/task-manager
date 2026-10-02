import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tm_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Set default auth header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('tm_token', token);
      fetchCurrentUser();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('tm_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // Fetch logged in user details
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/auth/me`);
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error('Fetch me error:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      setAuthError(null);
      const res = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
      if (res.data.success) {
        setToken(res.data.data.token);
        setUser({ _id: res.data.data._id, name: res.data.data.name, email: res.data.data.email });
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      setAuthError(null);
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      if (res.data.success) {
        setToken(res.data.data.token);
        setUser({ _id: res.data.data._id, name: res.data.data.name, email: res.data.data.email });
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tm_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        setAuthError,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
