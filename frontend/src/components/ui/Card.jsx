import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        padding: '1.5rem',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
