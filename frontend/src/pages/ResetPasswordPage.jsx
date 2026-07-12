import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { authApi } from '../services/api';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setError('Password must be at least 8 characters long, include an uppercase letter, lowercase letter, number, and a special character.');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword(token, { password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-main)',
      padding: '1rem'
    }}>
      <motion.div
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.3 }}
       style={{ width: '100%', maxWidth: '500px' }}
      >
        <Card style={{ width: '100%', padding: '2.75rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              Reset Password
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Enter your new password below.
            </p>
          </div>

          {success ? (
            <div style={{ textAlign: 'center' }}>
               <div style={{ padding: '0.75rem', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', border: '1px solid var(--success)', marginBottom: '1rem' }}>
                Password has been reset successfully! Redirecting to login...
              </div>
              <Button onClick={() => navigate('/login')} className="w-full">Go to Login Now</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {error && (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', border: '1px solid var(--error)' }}>
                  {error}
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>New Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Minimum 8 characters" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Confirm Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Confirm new password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
