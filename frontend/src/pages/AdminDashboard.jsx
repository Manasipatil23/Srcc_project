import React from 'react';
import Card from '../components/ui/Card';
import { Users, Calendar, Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    { title: "Total Therapists", value: "42", icon: <Users size={24} />, color: "var(--primary)", bgColor: "var(--secondary)" },
    { title: "Appointments Today", value: "156", icon: <Calendar size={24} />, color: "var(--accent)", bgColor: "rgba(20, 184, 166, 0.15)" },
    { title: "Active Patients", value: "892", icon: <Activity size={24} />, color: "var(--success)", bgColor: "var(--success-bg)" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name || 'Administrator'}. Here is your hospital overview.</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: stat.bgColor, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{stat.title}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <Card style={{ minHeight: '300px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Hospital Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Activity Feed Placeholder
            </div>
          </div>
        </Card>

        <Card style={{ minHeight: '300px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            <button
              onClick={() => navigate('/therapists')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontWeight: 500
              }}
              className="hover-scale"
            >
              Manage Therapists
              <ArrowRight size={16} color="var(--text-light)" />
            </button>

            <button
              onClick={() => navigate('/appointments')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontWeight: 500
              }}
              className="hover-scale"
            >
              View All Appointments
              <ArrowRight size={16} color="var(--text-light)" />
            </button>

            <button
              onClick={() => navigate('/settings')}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontWeight: 500
              }}
              className="hover-scale"
            >
              System Settings
              <ArrowRight size={16} color="var(--text-light)" />
            </button>

          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
