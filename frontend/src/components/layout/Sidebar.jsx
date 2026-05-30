import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, LayoutDashboard, Users, Clock, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const patientLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Book Appointment', path: '/book', icon: <Calendar size={20} /> },
    { name: 'My Appointments', path: '/appointments', icon: <Clock size={20} /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Therapists', path: '/therapists', icon: <Users size={20} /> },
    { name: 'All Appointments', path: '/appointments', icon: <Calendar size={20} /> },
  ];

  const navItems = isAdmin ? adminLinks : patientLinks;

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
               <Calendar size={20} />
            </span>
            <span>SRCC</span>
          </div>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Children's Hospital</span>
        </h1>
      </div>
      
      <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              backgroundColor: isActive ? 'var(--secondary)' : 'transparent',
              fontWeight: isActive ? 600 : 500,
              transition: 'all var(--transition-fast)'
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border)' }}>
        <NavLink to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          color: 'var(--error)',
          fontWeight: 500,
          transition: 'all var(--transition-fast)'
        }}>
          <LogOut size={20} />
          Logout
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
