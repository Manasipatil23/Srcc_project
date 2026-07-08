import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, ShieldCheck, HeartPulse, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { selectedRole, register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    hospitalName: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const isAdmin = selectedRole === 'admin';

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === 'phone') {
      setIsOtpSent(false);
      setIsPhoneVerified(false);
      setGeneratedOtp('');
      setEnteredOtp('');
    }
  };

  const handleSendOtp = () => {
    setError('');

    if (!formData.phone.trim()) {
      setError('Please enter your phone number first.');
      return;
    }

    if (formData.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    setGeneratedOtp(otp);
    setIsOtpSent(true);
    setIsPhoneVerified(false);

    alert(`OTP sent successfully!\n\nTesting OTP: ${otp}`);
  };

  const handleVerifyOtp = () => {
    setError('');

    if (!enteredOtp.trim()) {
      setError('Please enter the OTP.');
      return;
    }

    if (enteredOtp === generatedOtp) {
      setIsPhoneVerified(true);
      setError('');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPhoneVerified) {
      setError('Please verify your phone number before creating an account.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole === 'admin' ? 'admin' : 'patient',
        phone: formData.phone,
        dob: formData.dob,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)'
          }}
        >
          <ArrowLeft size={20} /> Back to Login
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <Card style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            backgroundColor: isAdmin ? 'var(--accent)' : 'var(--primary)'
          }}></div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              padding: '0.75rem',
              borderRadius: '50%',
              backgroundColor: isAdmin ? 'rgba(20, 184, 166, 0.1)' : 'var(--secondary)',
              marginBottom: '1rem'
            }}>
              {isAdmin
                ? <ShieldCheck size={32} color="var(--accent)" />
                : <HeartPulse size={32} color="var(--primary)" />}
            </div>

            <h1 style={{
              color: 'var(--text-primary)',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '0.25rem'
            }}>
              {isAdmin ? 'Admin Registration' : 'Patient Registration'}
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Create a new account
            </p>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'var(--error-bg)',
                color: 'var(--error)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                border: '1px solid var(--error)'
              }}>
                {error}
              </div>
            )}

            {isAdmin && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  Hospital Name
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  required
                  className="input-field"
                  placeholder="E.g. SRCC Children's Hospital"
                  onChange={handleChange}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                {isAdmin ? 'Admin Full Name' : 'Full Name'}
              </label>
              <input
                type="text"
                name="name"
                required
                className="input-field"
                placeholder="John Doe"
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="input-field"
                  placeholder="john@example.com"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="input-field"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isPhoneVerified}
                />
              </div>
            </div>

            {!isAdmin && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  required
                  className="input-field"
                  onChange={handleChange}
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  className="input-field"
                  placeholder="Minimum 6 characters"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="input-field"
                  placeholder="Confirm password"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{
              padding: '1.25rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-main)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '0.25rem'
                }}>
                  Phone Verification
                </h3>

                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}>
                  Verify your phone number before creating your account.
                </p>
              </div>

              {!isOtpSent && !isPhoneVerified && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </Button>
              )}

              {isOtpSent && !isPhoneVerified && (
                <>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: 500,
                      fontSize: '0.875rem'
                    }}>
                      Enter OTP
                    </label>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Enter 6-digit OTP"
                        value={enteredOtp}
                        maxLength={6}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                      />

                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleVerifyOtp}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Verify OTP
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSendOtp}
                    style={{
                      alignSelf: 'flex-start',
                      color: 'var(--primary)'
                    }}
                  >
                    Resend OTP
                  </Button>
                </>
              )}

              {isPhoneVerified && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  <CheckCircle size={18} />
                  Phone number verified successfully
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant={isAdmin ? 'secondary' : 'primary'}
              size="lg"
              className="w-full mt-4"
              disabled={isLoading || !isPhoneVerified}
            >
              {isLoading ? 'Registering...' : 'Create Account'}
            </Button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>
              Sign in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;