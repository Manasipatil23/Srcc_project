import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { authApi } from '../services/api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setSuccess('An email has been sent with instructions to reset your password.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
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
      padding: '1rem',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <Button variant="ghost" onClick={() => navigate('/login')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={20} /> Back to Login
        </Button>
      </div>

      <motion.div
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.3 }}
       style={{ width: '100%', maxWidth: '500px' }}
      >
        <Card style={{ width: '100%', padding: '2.75rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              Forgot Password
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', border: '1px solid var(--error)' }}>
                {error}
              </div>
            )}
            
            {success && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', border: '1px solid var(--success)' }}>
                {success}
              </div>
            )}
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-4" disabled={isLoading || success}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Remembered your password? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign in</Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
