import React from 'react';
import { Inbox, CalendarX2, Stethoscope, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ type = 'default', title, description }) => {
  const illustrations = {
    inbox: <Inbox size={64} strokeWidth={1} color="var(--primary)" />,
    calendar: <CalendarX2 size={64} strokeWidth={1} color="var(--accent)" />,
    medical: <Stethoscope size={64} strokeWidth={1} color="var(--primary)" />,
    search: <SearchX size={64} strokeWidth={1} color="var(--text-light)" />,
    default: <Inbox size={64} strokeWidth={1} color="var(--text-light)" />
  };

  const icon = illustrations[type] || illustrations.default;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center',
        backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border)'
      }}
    >
      <div style={{
        width: '120px', height: '120px', borderRadius: '50%',
        backgroundColor: 'var(--bg-surface)', display: 'flex', 
        alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6 }}>{description}</p>
    </motion.div>
  );
};

export default EmptyState;
