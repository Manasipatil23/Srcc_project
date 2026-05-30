import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-md)',
    fontWeight: '500',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
    border: '1px solid transparent',
  };

  const sizes = {
    sm: { padding: '0.375rem 0.75rem', fontSize: 'var(--text-sm)' },
    md: { padding: '0.5rem 1rem', fontSize: '1rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: 'var(--text-lg)' },
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--secondary)',
      color: 'var(--primary)',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: 'var(--border)',
      color: 'var(--text-primary)',
    },
    danger: {
      backgroundColor: 'var(--error-bg)',
      color: 'var(--error)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
    }
  };

  // Hover states (handled via inline style isn't great, better to add a class, but we can do simple simulation or use standard classes in index.css)
  // Let's use standard classes and define them in index.css instead for better hover states
  
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
