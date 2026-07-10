import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { Users, Calendar, Clock, XCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { appointmentApi, therapistApi, scheduleApi } from '../services/api';
import { socket } from '../services/socket';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [therapistCount, setTherapistCount] = useState(0);
  const [slotStats, setSlotStats] = useState({ available: 0, total: 0 });

  const fetchAppointments = () => {
    if (!user) return;
    appointmentApi
      .getAll({ userId: user.id })
      .then(setAppointments)
      .catch(() => setAppointments([]));
  };

  useEffect(() => {
    if (!user) return;
    fetchAppointments();

    const handleAppointmentUpdate = () => {
      fetchAppointments();
    };

    socket.on('appointment_updated', handleAppointmentUpdate);
    
    therapistApi
      .getAll()
      .then((list) => setTherapistCount(list.length))
      .catch(() => setTherapistCount(0));
    scheduleApi
      .getTherapistSlots()
      .then((byName) => {
        const all = Object.values(byName).flat();
        setSlotStats({ available: all.filter((s) => s.available).length, total: all.length });
      })
      .catch(() => setSlotStats({ available: 0, total: 0 }));

    return () => {
      socket.off('appointment_updated', handleAppointmentUpdate);
    };
  }, [user]);

  const today = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter(a => a.date === today && a.status === 'Upcoming').length;
  const cancelledCount = appointments.filter(a => a.status === 'Cancelled').length;

  const stats = [
    { label: 'Total Therapists', value: `${therapistCount}`, total: Math.max(therapistCount, 1), icon: <Users size={24} />, color: 'var(--primary)', bg: 'var(--secondary)' },
    { label: "Today's Appointments", value: `${todayCount}`, total: Math.max(appointments.length, 1), icon: <Calendar size={24} />, color: 'var(--accent)', bg: 'rgba(20, 184, 166, 0.15)' },
    { label: 'Available Slots', value: `${slotStats.available}`, total: Math.max(slotStats.total, 1), icon: <Clock size={24} />, color: 'var(--success)', bg: 'var(--success-bg)' },
    { label: 'Cancelled', value: `${cancelledCount}`, total: Math.max(appointments.length, 1), icon: <XCircle size={24} />, color: 'var(--error)', bg: 'var(--error-bg)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Patient Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name?.split(' ')[0] || 'there'}! Here is your overview for today.</p>
        </div>

      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, index) => (
          <Card key={index} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="hover-scale">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: stat.bg, color: stat.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{stat.label}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</h3>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ 
                width: `${(parseInt(stat.value) / stat.total) * 100}%`, 
                height: '100%', backgroundColor: stat.color,
                borderRadius: 'var(--radius-full)',
                transition: 'width 1s ease-out'
              }}></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Upcoming Appointments</h2>
          <a href="/appointments" style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.875rem' }}>View All</a>
        </div>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Therapist</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Date & Time</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Type</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 500, color: 'var(--text-secondary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.filter(a => a.status === 'Upcoming').map(apt => (
                  <tr key={apt.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color var(--transition-fast)' }} className="hover-bg-main">
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{apt.therapistName}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{apt.date} at {apt.time}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{apt.type}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        backgroundColor: 'var(--secondary)', color: 'var(--primary)',
                        padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600,
                        display: 'inline-flex', alignItems: 'center', gap: '0.25rem'
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {appointments.filter(a => a.status === 'Upcoming').length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                      No upcoming appointments.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
