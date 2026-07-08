import React, { useState, useEffect } from 'react';
import { Bell, User, Sun, Moon, FileText, ChevronDown, Download, Upload, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { notificationApi } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const TopNavbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    notificationApi
      .getForUser(user.id)
      .then((list) => setUnreadCount(list.filter((n) => !n.read).length))
      .catch(() => setUnreadCount(0));
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.name || 'Guest';
  const displayRole = user?.role === 'admin' ? 'Hospital Admin' : user?.role === 'therapist' ? 'Therapist' : 'Patient';

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      transition: 'background-color var(--transition-normal), border-color var(--transition-normal)'
    }}>
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
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                minWidth: '18px',
                height: '18px',
                backgroundColor: 'var(--error)',
                borderRadius: '50%',
                color: 'white',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
              {unreadCount}
            </span>
          )}
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
