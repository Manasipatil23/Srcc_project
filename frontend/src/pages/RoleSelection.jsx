import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import { User, Stethoscope, ArrowRight, HeartPulse, UserCog } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { setSelectedRole } = useAuth();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-main)',
      padding: '2rem'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <HeartPulse size={36} color="var(--primary)" />
          <h1 style={{ color: 'var(--primary)', fontSize: '2rem', fontWeight: 'bold' }}>
            The Society for the Rehabilitation of Crippled Children (SRCC)
          </h1>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Therapy Appointment Management System
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.125rem' }}>
          Please select your role to continue
        </p>
      </motion.div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Card 
            onClick={() => handleRoleSelect('patient')}
            style={{ 
              width: '300px', height: '300px', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '1.5rem',
              border: '2px solid transparent', transition: 'all 0.2s ease'
            }}
            className="hover-bg-main"
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={40} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Patient</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Book appointments and view your records.</p>
            </div>
            <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginTop: 'auto' }}>
              Continue <ArrowRight size={18} />
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Card 
            onClick={() => handleRoleSelect('therapist')}
            style={{ 
              width: '300px', height: '300px', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '1.5rem',
              border: '2px solid transparent', transition: 'all 0.2s ease'
            }}
            className="hover-bg-main"
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={40} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Therapist</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage your schedule and appointments.</p>
            </div>
            <div style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginTop: 'auto' }}>
              Continue <ArrowRight size={18} />
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Card 
            onClick={() => handleRoleSelect('admin')}
            style={{ 
              width: '300px', height: '300px', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '1.5rem',
              border: '2px solid transparent', transition: 'all 0.2s ease'
            }}
            className="hover-bg-main"
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(20, 184, 166, 0.15)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCog size={40} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>SRCC Admin</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage therapists and schedule overviews.</p>
            </div>
            <div style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginTop: 'auto' }}>
              Continue <ArrowRight size={18} />
            </div>
          </Card>
        </motion.div>
      </div>
      
      <button 
        onClick={() => navigate('/')} 
        style={{ marginTop: '3rem', color: 'var(--text-secondary)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        Return to Home Page
      </button>
    </div>
  );
};

export default RoleSelection;
