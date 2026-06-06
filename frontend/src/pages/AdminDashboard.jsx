import React, { useState } from 'react';
import Card from '../components/ui/Card';
import { Users, Calendar, Activity, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, therapist: 'Dr. Sarah Jenkins', startDate: '2026-07-01', endDate: '2026-07-05', reason: 'Conference', status: 'Pending' },
    { id: 2, therapist: 'Dr. Anil Kumar', startDate: '2026-06-15', endDate: '2026-06-16', reason: 'Personal Leave', status: 'Pending' },
    { id: 3, therapist: 'Dr. Emily Chen', startDate: '2026-05-10', endDate: '2026-05-12', reason: 'Sick Leave', status: 'Approved' },
    { id: 4, therapist: 'Dr. Sarah Jenkins', startDate: '2026-04-01', endDate: '2026-04-02', reason: 'Personal Leave', status: 'Rejected' }
  ]);

  const handleLeaveAction = (id, action) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: action } : req));
  };

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
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Pending Leave Requests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {leaveRequests.filter(req => req.status === 'Pending').length > 0 ? (
              leaveRequests.filter(req => req.status === 'Pending').map(req => (
                <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderLeft: '4px solid var(--warning)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{req.therapist}</h4>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {req.startDate} to {req.endDate} • {req.reason}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleLeaveAction(req.id, 'Approved')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--success-bg)', color: 'var(--success)', cursor: 'pointer', transition: 'transform 0.2s' }} className="hover-scale" title="Approve">
                      <CheckCircle size={18} />
                    </button>
                    <button onClick={() => handleLeaveAction(req.id, 'Rejected')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--error-bg)', color: 'var(--error)', cursor: 'pointer', transition: 'transform 0.2s' }} className="hover-scale" title="Reject">
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                No pending leave requests.
              </div>
            )}
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

      <Card>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Leave Request History</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {leaveRequests.filter(req => req.status !== 'Pending').length > 0 ? (
            leaveRequests.filter(req => req.status !== 'Pending').map(req => (
              <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderLeft: `4px solid ${req.status === 'Approved' ? 'var(--success)' : 'var(--error)'}`, borderRadius: 'var(--radius-md)' }}>
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{req.therapist}</h4>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {req.startDate} to {req.endDate} • {req.reason}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: req.status === 'Approved' ? 'var(--success)' : 'var(--error)' }}>
                  {req.status === 'Approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {req.status}
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
              No history found.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
