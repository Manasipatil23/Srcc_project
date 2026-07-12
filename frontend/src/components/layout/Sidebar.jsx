import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, LayoutDashboard, Users, Clock, Bell, LogOut, AlarmClock, MessageSquare, CalendarCheck, CalendarOff, Settings, IndianRupee, FileBarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isTherapist = user?.role === 'therapist';

  const patientLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Book Appointment', path: '/book', icon: <Calendar size={20} /> },
    { name: 'My Appointments', path: '/appointments', icon: <Clock size={20} /> },
    { name: 'Feedback', path: '/feedback-form', icon: <MessageSquare size={20} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'System Calendar', path: '/admin-calendar', icon: <Calendar size={20} /> },
    { name: 'Therapists', path: '/therapists', icon: <Users size={20} /> },
    { name: 'Schedule Patient', path: '/schedule-patient', icon: <Calendar size={20} /> },
    { name: 'All Appointments', path: '/appointments', icon: <Calendar size={20} /> },
    { name: 'Leave Requests', path: '/admin-leaves', icon: <CalendarOff size={20} /> },
    { name: 'Accounts', path: '/accounts', icon: <IndianRupee size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileBarChart2 size={20} /> },
    { name: 'Notifications', path: '/notifications', icon: <Bell size={20} /> },
    { name: 'Reminders', path: '/admin-reminders', icon: <AlarmClock size={20} /> }
  ];
  const therapistLinks = [
    { name: 'Dashboard', path: '/therapist/dashboard', icon: <Home size={20} /> },
    { name: 'My Schedule', path: '/therapist/calendar', icon: <Calendar size={20} /> },
    { name: 'Appointments', path: '/therapist/appointments', icon: <Clock size={20} /> },
    { name: 'Leave Requests', path: '/therapist/leave', icon: <CalendarOff size={20} /> },
    { name: 'Notifications', path: '/therapist/notifications', icon: <Bell size={20} /> },
  ];

  const navItems = isAdmin ? adminLinks : isTherapist ? therapistLinks : patientLinks;

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
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Society for the Rehabilitation of Crippled Children</span>
        </h1>
      </div>

      <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }} className="no-scrollbar">
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
        <button onClick={logout} style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          color: 'var(--error)',
          fontWeight: 500,
          transition: 'all var(--transition-fast)',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
        className="hover-bg-main">
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
