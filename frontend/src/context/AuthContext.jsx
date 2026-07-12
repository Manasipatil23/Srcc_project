import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

const AuthContext = createContext();

const STORED_USER_KEY = 'srcc_user';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORED_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [selectedRole, setSelectedRole] = useState('patient'); // default
  const navigate = useNavigate();

  // Real login against the backend. Throws on bad credentials or role mismatch.
  const login = async (role, email, password) => {
    const res = await authApi.login({ email, password });
    if (res.requiresOtp) {
      return res;
    }
    if (res.user.role !== role) {
      throw new Error(`This account is registered as '${res.user.role}', not '${role}'. Please pick the correct role.`);
    }
    authApi.saveToken(res.token);
    localStorage.setItem(STORED_USER_KEY, JSON.stringify(res.user));
    setUser(res.user);
    return res;
  };

  const completeLoginOtp = async (role, email, otp) => {
    const res = await authApi.verifyLoginOtp({ email, otp });
    if (res.user.role !== role) {
      throw new Error(`This account is registered as '${res.user.role}', not '${role}'. Please pick the correct role.`);
    }
    authApi.saveToken(res.token);
    localStorage.setItem(STORED_USER_KEY, JSON.stringify(res.user));
    setUser(res.user);
    return res;
  };

  const register = async (payload) => {
    const res = await authApi.register(payload);
    return res;
  };

  const logout = () => {
    authApi.clearToken();
    localStorage.removeItem(STORED_USER_KEY);
    setUser(null);
    navigate('/role-selection');
  };

  // Merge fresh fields (e.g. a new profile photo) into the signed-in user
  // so every component reading `user` updates immediately.
  const updateUser = (partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORED_USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, selectedRole, setSelectedRole, login, completeLoginOtp, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
