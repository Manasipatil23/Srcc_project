import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Sun, Moon, FileText, ChevronDown, Download, Upload, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { mockPatientProfile } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TopNavbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.name || mockPatientProfile.name;
  const displayRole = user?.role === 'admin' ? 'Hospital Admin' : 'Patient';

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      transition: 'background-color var(--transition-normal), border-color var(--transition-normal)'
    }}>
      <div style={{ position: 'relative', width: '300px' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
        <input 
          type="text" 
          placeholder="Search..." 
          className="input-field"
          style={{ paddingLeft: '2.5rem', backgroundColor: 'var(--bg-main)', border: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          style={{ 
            color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--bg-main)', transition: 'all var(--transition-fast)' 
          }}
          className="btn-ghost"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div onClick={() => navigate('/notifications')} style={{ position: 'relative', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '50%' }} className="btn-ghost">
          <Bell size={24} />
          <span style={{
            position: 'absolute', top: '0', right: '0',
            width: '10px', height: '10px', backgroundColor: 'var(--error)',
            borderRadius: '50%', border: '2px solid var(--bg-surface)',
            transition: 'border-color var(--transition-normal)'
          }}></span>
        </div>
        
        {/* Profile Link & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            onClick={() => navigate('/profile')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
              padding: '0.5rem', borderRadius: 'var(--radius-md)', transition: 'background-color var(--transition-fast)'
            }}
            className="hover-bg-main"
          >
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{displayName}</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>{displayRole}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <User size={20} />
            </div>
          </div>
          
          <button onClick={handleLogout} style={{ color: 'var(--text-light)', padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }} className="hover-opacity" title="Sign Out">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
