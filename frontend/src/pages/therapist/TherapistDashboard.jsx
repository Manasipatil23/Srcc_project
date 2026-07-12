import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, AlertCircle, TrendingUp, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { appointmentApi } from '../../services/api';
import { socket } from '../../services/socket';

const TherapistDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = () => {
    appointmentApi
      .getAll()
      .then((data) =>
        setAppointments(data.filter((a) => a.therapistName === user?.name))
      )
      .catch(() => setAppointments([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAppointments();

    const handleUpdate = (data) => {
      if (user && data.therapistId === user.id) {
        fetchAppointments();
      }
    };

    socket.on('appointment_updated', handleUpdate);
    return () => {
      socket.off('appointment_updated', handleUpdate);
    };
  }, [user?.name, user?.id]);

  const todayAppointments = appointments.filter(a => a.date === today);
  const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');
  const cancelledAppointments = appointments.filter(a => a.status === 'Cancelled');

  const handleMarkDone = async (id) => {
    try {
      const updated = await appointmentApi.updateStatus(id, 'Completed');
      setAppointments(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      alert(err.message || 'Failed to update appointment.');
    }
  };
  
  const stats = [
    { label: "Today's Appointments", value: todayAppointments.length, icon: <Calendar size={24} />, color: 'var(--primary)' },
    { label: "Upcoming Appointments", value: upcomingAppointments.length, icon: <TrendingUp size={24} />, color: 'var(--success)' },
    { label: "Available Slots", value: 4, icon: <Clock size={24} />, color: 'var(--accent)' },
    { label: "Cancelled", value: cancelledAppointments.length, icon: <AlertCircle size={24} />, color: 'var(--error)' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            Therapist Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}! Here's your schedule overview for today.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -5 }}>
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: `${stat.color}15`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{stat.label}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card className="glass-panel" style={{ padding: '1.5rem', gridColumn: '1 / -2' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Today's Timeline</h2>
             <Button variant="ghost" size="sm" onClick={() => navigate('/therapist/calendar')}>View Calendar</Button>
           </div>
           
           {isLoading ? (
             <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
               <p>Loading appointments...</p>
             </div>
           ) : todayAppointments.length > 0 ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {todayAppointments.map((apt, i) => (
                 <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${apt.status === 'Upcoming' ? 'var(--primary)' : 'var(--success)'}` }}>
                   <div style={{ fontWeight: 600, color: 'var(--text-secondary)', width: '80px' }}>{apt.time}</div>
                   <div style={{ flex: 1 }}>
                     <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{apt.patientName}</h4>
                     <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{apt.type}</p>
                   </div>
                   <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                     <Button variant="outline" size="sm" onClick={() => navigate('/therapist/appointments')}>Details</Button>
                     {apt.status === 'Upcoming' && <Button size="sm" onClick={() => handleMarkDone(apt.id)} style={{ backgroundColor: 'var(--success)', color: 'white', border: 'none' }}><CheckCircle size={16} style={{ marginRight: '0.25rem' }}/> Done</Button>}
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
               <Calendar size={48} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.5 }} />
               <p>No appointments scheduled for today.</p>
             </div>
           )}
        </Card>

        <Card className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button variant="outline" className="w-full" onClick={() => navigate('/therapist/appointments')} style={{ justifyContent: 'flex-start', padding: '1rem' }}>
              <Users size={18} style={{ marginRight: '1rem' }} /> Search Patient
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/therapist/leave')} style={{ justifyContent: 'flex-start', padding: '1rem' }}>
              <AlertCircle size={18} style={{ marginRight: '1rem' }} /> Request Day Off
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TherapistDashboard;
