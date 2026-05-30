import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in
  const [selectedRole, setSelectedRole] = useState('patient'); // default

  // Fake login function
  const login = (role, email) => {
    setUser({ role, email, name: role === 'admin' ? 'Hospital Admin' : 'John Doe' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, selectedRole, setSelectedRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
