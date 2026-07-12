import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../services/api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);
  const [expiryTimer, setExpiryTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    let interval;
    if (expiryTimer > 0 && isOtpStep) {
      interval = setInterval(() => setExpiryTimer(prev => prev - 1), 1000);
    } else if (expiryTimer === 0 && isOtpStep) {
      setError('OTP has expired. Please resend.');
    }
    return () => clearInterval(interval);
  }, [expiryTimer, isOtpStep]);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await authApi.forgotPassword({ email });
      setIsOtpStep(true);
      setResendTimer(30);
      setExpiryTimer(600);
      setSuccess('An OTP has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to send reset OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp.trim() || !newPassword) {
      setError('Please enter the OTP and a new password.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPasswordWithOtp({ email, otp, newPassword });
      setSuccess('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
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
              {isOtpStep ? 'Enter the OTP and your new password' : 'Enter your email address and we\'ll send you a 6-digit OTP.'}
            </p>
          </div>

          {!isOtpStep ? (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

              <Button type="submit" variant="primary" size="lg" className="w-full mt-4" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Enter 6-digit OTP</label>
                <input 
                  type="text" 
                  maxLength={6}
                  className="input-field" 
                  placeholder="000000" 
                  style={{ height: '3rem', fontSize: '1.25rem', letterSpacing: '0.25rem', textAlign: 'center' }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleSendOtp()}
                  style={{ color: 'var(--primary)', padding: 0 }}
                  disabled={isLoading || resendTimer > 0}
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                </Button>
                {expiryTimer > 0 && (
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Expires in {Math.floor(expiryTimer / 60)}:{(expiryTimer % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    className="input-field" 
                    placeholder="Enter new password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ paddingRight: '2.75rem' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-4" disabled={isLoading || success}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
              
              <Button type="button" variant="ghost" className="w-full mt-2" onClick={() => setIsOtpStep(false)} disabled={isLoading || success}>
                Back
              </Button>
            </form>
          )}

          {!isOtpStep && (
            <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Remembered your password? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign in</Link>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
