import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Eye, EyeOff, UserCog, HeartPulse, Stethoscope, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const { selectedRole, login, completeLoginOtp } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isOtpStep, setIsOtpStep] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [expiryTimer, setExpiryTimer] = useState(0);

  const isAdmin = selectedRole === 'admin';
  const isTherapist = selectedRole === 'therapist';

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(selectedRole, email, password);
      if (res.requiresOtp) {
        setIsOtpStep(true);
        setResendTimer(30);
        setExpiryTimer(600);
      } else {
        navigate(isAdmin ? '/admin-dashboard' : isTherapist ? '/therapist/dashboard' : '/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!enteredOtp.trim()) {
      setError('Please enter the OTP.');
      return;
    }
    
    setIsLoading(true);
    try {
      await completeLoginOtp(selectedRole, email, enteredOtp);
      navigate(isAdmin ? '/admin-dashboard' : isTherapist ? '/therapist/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);
    try {
      await authApi.login({ email, password });
      setResendTimer(30);
      setExpiryTimer(600);
      alert('OTP resent successfully!');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
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
        <Button variant="ghost" onClick={() => navigate('/role-selection')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={20} /> Back to Roles
        </Button>
      </div>

      <motion.div
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.3 }}
       style={{ width: '100%', maxWidth: '500px' }}
      >
      <Card style={{
       width: '100%',
        padding: '2.75rem',
       position: 'relative',
       overflow: 'hidden'
      }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundColor: isAdmin ? 'var(--accent)' : isTherapist ? '#8b5cf6' : 'var(--primary)' }}></div>

          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', backgroundColor: isAdmin ? 'rgba(20, 184, 166, 0.1)' : isTherapist ? 'rgba(139, 92, 246, 0.1)' : 'var(--secondary)', marginBottom: '1rem' }}>
              {isAdmin ? <UserCog size={32} color="var(--accent)" /> : isTherapist ? <Stethoscope size={32} color="#8b5cf6" /> : <HeartPulse size={32} color="var(--primary)" />}
            </div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              {isAdmin ? 'Admin Portal' : isTherapist ? 'Therapist Portal' : 'Patient Portal'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{isOtpStep ? 'Two-Factor Authentication' : 'Therapy Appointment Management'}</p>
          </div>

          {!isOtpStep ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {error && (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', border: '1px solid var(--error)' }}>
                  {error}
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', pointerEvents: 'none' }} />
                  <input 
                    type="email" 
                    className="input-field" 
                    placeholder={isAdmin ? "admin@srcc.org.in" : isTherapist ? "therapist@srcc.org.in" : "Enter your email"} 
                    style={{ paddingLeft: '2.75rem', height: '3rem', transition: 'all 0.2s ease', backgroundColor: 'var(--bg-main)' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${isAdmin ? 'var(--accent)' : isTherapist ? '#8b5cf6' : 'var(--primary)'}40`}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', pointerEvents: 'none' }} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="input-field" 
                    placeholder="Enter your password" 
                    style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem', height: '3rem', transition: 'all 0.2s ease', backgroundColor: 'var(--bg-main)' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={(e) => e.target.style.boxShadow = `0 0 0 2px ${isAdmin ? 'var(--accent)' : isTherapist ? '#8b5cf6' : 'var(--primary)'}40`}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: 500 }}>Forgot password?</Link>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-4" disabled={isLoading} style={{ backgroundColor: isAdmin ? 'var(--accent)' : isTherapist ? '#8b5cf6' : 'var(--primary)', borderColor: 'transparent' }}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {error && (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', border: '1px solid var(--error)' }}>
                  {error}
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Enter 6-digit OTP sent to your email</label>
                <input 
                  type="text" 
                  maxLength={6}
                  className="input-field" 
                  placeholder="000000" 
                  style={{ height: '3rem', fontSize: '1.25rem', letterSpacing: '0.25rem', textAlign: 'center' }}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOtp}
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

              <Button type="submit" variant="primary" size="lg" className="w-full mt-4" disabled={isLoading} style={{ backgroundColor: isAdmin ? 'var(--accent)' : isTherapist ? '#8b5cf6' : 'var(--primary)', borderColor: 'transparent' }}>
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </Button>
              
              <Button type="button" variant="ghost" className="w-full mt-2" onClick={() => setIsOtpStep(false)} disabled={isLoading}>
                Back to Login
              </Button>
            </form>
          )}

          {!isOtpStep && (
            <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign up</Link>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
