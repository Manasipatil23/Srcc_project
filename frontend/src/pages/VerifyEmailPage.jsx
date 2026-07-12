import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CheckCircle, XCircle } from 'lucide-react';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Verifying your email address...');
  const { updateUser } = useAuth(); // Actually we should probably just force login if it returns a token?
  // Our backend returns token and user upon verification, we could auto-login, but to keep it simple we'll just redirect to login.

  useEffect(() => {
    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now sign in.');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Failed to verify email. The link may be invalid or expired.');
      }
    };
    verify();
  }, [token]);

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
        <Card style={{ width: '100%', padding: '2.75rem', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', backgroundColor: status === 'success' ? 'rgba(20, 184, 166, 0.1)' : status === 'error' ? 'var(--error-bg)' : 'var(--bg-main)', marginBottom: '1rem' }}>
            {status === 'success' ? (
              <CheckCircle size={48} color="var(--success)" />
            ) : status === 'error' ? (
              <XCircle size={48} color="var(--error)" />
            ) : (
              <div className="spinner"></div> // Can style this later or use a loading icon
            )}
          </div>

          <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Email Verification
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem' }}>
            {message}
          </p>

          {(status === 'success' || status === 'error') && (
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          )}

        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
