import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, ShieldCheck, HeartPulse, Stethoscope, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

const PasswordStrength = ({ password }) => {
  let score = 0;
  if (!password) return null;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let strength = 'Weak';
  let color = 'var(--error)';
  
  if (score >= 4) {
    strength = 'Strong';
    color = 'var(--success)';
  } else if (score >= 2) {
    strength = 'Medium';
    color = 'var(--warning)';
  }

  return (
    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
        {[1, 2, 3, 4, 5].map(level => (
          <div key={level} style={{
            height: '6px',
            flex: 1,
            borderRadius: '3px',
            backgroundColor: level <= score ? color : 'var(--border)'
          }}></div>
        ))}
      </div>
      <span style={{ color, fontWeight: 500, minWidth: '50px', textAlign: 'right' }}>{strength}</span>
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { selectedRole, register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    facilityName: '',
    specialty: '',
    qualification: '',
    experience: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [enteredOtp, setEnteredOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);

  const isAdmin = selectedRole === 'admin';
  const isTherapist = selectedRole === 'therapist';

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      setIsOtpSent(false);
      setIsEmailVerified(false);
      setEnteredOtp('');
    }
  };

  const handleSendOtp = async () => {
    setError('');

    if (!formData.email.trim()) {
      setError('Please enter your email address first.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsOtpLoading(true);
    try {
      await authApi.sendOtp({ email: formData.email });
      setIsOtpSent(true);
      setIsEmailVerified(false);
      alert('OTP sent successfully to your email address!');
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');

    if (!enteredOtp.trim()) {
      setError('Please enter the OTP.');
      return;
    }

    setIsOtpLoading(true);
    try {
      await authApi.verifyOtp({ email: formData.email, otp: enteredOtp });
      setIsEmailVerified(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEmailVerified) {
      setError('Please verify your email address before creating an account.');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      setError('Name should only contain letters and spaces.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const pass = formData.password;
    if (pass.length < 8 || !/[A-Z]/.test(pass) || !/[a-z]/.test(pass) || !/[0-9]/.test(pass) || !/[^A-Za-z0-9]/.test(pass)) {
      setError('Password must be at least 8 characters long, include an uppercase letter, lowercase letter, number, and a special character.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        phone: formData.phone,
        dob: formData.dob,
        ...(isTherapist && {
          specialty: formData.specialty,
          qualification: formData.qualification,
          experience: formData.experience,
        }),
      });
      alert(res.message || 'Registration successful!');
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
            backgroundColor: isAdmin ? 'var(--accent)' : isTherapist ? '#8b5cf6' : 'var(--primary)'
          }}></div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              padding: '0.75rem',
              borderRadius: '50%',
              backgroundColor: isAdmin
                ? 'rgba(20, 184, 166, 0.1)'
                : isTherapist
                  ? 'rgba(139, 92, 246, 0.15)'
                  : 'var(--secondary)',
              marginBottom: '1rem'
            }}>
              {isAdmin
                ? <ShieldCheck size={32} color="var(--accent)" />
                : isTherapist
                  ? <Stethoscope size={32} color="#8b5cf6" />
                  : <HeartPulse size={32} color="var(--primary)" />}
            </div>

            <h1 style={{
              color: 'var(--text-primary)',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '0.25rem'
            }}>
              {isAdmin ? 'Admin Registration' : isTherapist ? 'Therapist Registration' : 'Patient Registration'}
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
                  Facility Name
                </label>
                <input
                  type="text"
                  name="facilityName"
                  required
                  className="input-field"
                  placeholder="E.g. The Society for the Rehabilitation of Crippled Children (SRCC)"
                  onChange={handleChange}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                {isAdmin ? 'Admin Full Name' : isTherapist ? 'Therapist Full Name' : 'Full Name'}
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
                  disabled={isEmailVerified}
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
                />
              </div>
            </div>

            {!isAdmin && !isTherapist && (
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

            {isTherapist && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                      Specialty
                    </label>
                    <input
                      type="text"
                      name="specialty"
                      required
                      className="input-field"
                      placeholder="E.g. Child Psychologist"
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="experience"
                      required
                      min="0"
                      className="input-field"
                      placeholder="E.g. 5"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    required
                    className="input-field"
                    placeholder="E.g. PhD Child Psychology"
                    onChange={handleChange}
                  />
                </div>
              </>
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
                  placeholder="Minimum 8 characters"
                  onChange={handleChange}
                />
                <PasswordStrength password={formData.password} />
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
                  Email Verification
                </h3>

                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}>
                  Verify your email address before creating your account.
                </p>
              </div>

              {!isOtpSent && !isEmailVerified && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendOtp}
                  disabled={isOtpLoading}
                >
                  {isOtpLoading ? 'Sending...' : 'Send OTP'}
                </Button>
              )}

              {isOtpSent && !isEmailVerified && (
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
                        disabled={isOtpLoading}
                      >
                        {isOtpLoading ? 'Verifying...' : 'Verify OTP'}
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
                    disabled={isOtpLoading}
                  >
                    Resend OTP
                  </Button>
                </>
              )}

              {isEmailVerified && (
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
                  Email verified successfully
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant={isAdmin ? 'secondary' : 'primary'}
              size="lg"
              className="w-full mt-4"
              disabled={isLoading || !isEmailVerified}
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