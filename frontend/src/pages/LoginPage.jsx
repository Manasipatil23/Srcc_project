import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Eye, EyeOff, ShieldCheck, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { selectedRole, login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isAdmin = selectedRole === 'admin';

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic Validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      // Mock login
      login(selectedRole, email);
      navigate(isAdmin ? '/admin-dashboard' : '/dashboard');
    }, 1000);
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
          {/* Top colored accent based on role */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', backgroundColor: isAdmin ? 'var(--accent)' : 'var(--primary)' }}></div>

          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', backgroundColor: isAdmin ? 'rgba(20, 184, 166, 0.1)' : 'var(--secondary)', marginBottom: '1rem' }}>
              {isAdmin ? <ShieldCheck size={32} color="var(--accent)" /> : <HeartPulse size={32} color="var(--primary)" />}
            </div>
            <h1 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              {isAdmin ? 'Admin Portal' : 'Patient Portal'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Therapy Appointment Management</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', border: '1px solid var(--error)' }}>
                {error}
              </div>
            )}
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder={isAdmin ? "admin@srcc.org.in" : "Enter your email"} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-field" 
                placeholder="Enter your password" 
                style={{ paddingRight: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '0.75rem', top: '2.1rem', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" style={{ color: 'var(--primary)', fontWeight: 500 }}>Forgot password?</a>
            </div>

            <Button type="submit" variant={isAdmin ? "secondary" : "primary"} size="lg" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign up</Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
