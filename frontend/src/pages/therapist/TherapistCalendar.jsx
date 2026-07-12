import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { leaveApi, appointmentApi } from '../../services/api';
import { socket } from '../../services/socket';
import DynamicCalendar from '../../components/ui/DynamicCalendar';
import Card from '../../components/ui/Card';

const TherapistCalendar = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const fetchLeaves = () => {
    if (user?.id) {
      leaveApi.getForTherapist(user.id)
        .then(setLeaves)
        .catch(err => console.error("Error fetching leaves for calendar", err));
    }
  };

  const fetchAppointments = () => {
    if (user?.name) {
      appointmentApi.getAll()
        .then(data => setAppointments(data.filter(a => a.therapistName === user.name)))
        .catch(err => console.error("Error fetching appointments for calendar", err));
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchAppointments();

    const handleLeaveUpdate = (data) => {
      if (user && data.therapistId === user.id) {
        fetchLeaves();
      }
    };
    
    const handleAppointmentUpdate = (data) => {
      if (user && data.therapistId === user.id) {
        fetchAppointments();
      }
    };

    socket.on('leave_updated', handleLeaveUpdate);
    socket.on('appointment_updated', handleAppointmentUpdate);
    return () => {
      socket.off('leave_updated', handleLeaveUpdate);
      socket.off('appointment_updated', handleAppointmentUpdate);
    };
  }, [user?.id]);

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);
  const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming' && a.date !== today);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Today's Appointments */}
        <Card className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Today's Appointments</h2>
          {todayAppointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }} className="no-scrollbar">
              {todayAppointments.map((apt, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${apt.status === 'Upcoming' ? 'var(--primary)' : 'var(--success)'}` }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-secondary)', width: '70px' }}>{apt.time}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{apt.patientName}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{apt.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No appointments today.</p>
          )}
        </Card>

        {/* Upcoming Appointments */}
        <Card className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }} className="no-scrollbar">
              {upcomingAppointments.map((apt, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-secondary)', width: '90px' }}>
                    <div style={{ fontSize: '0.875rem' }}>{apt.date}</div>
                    <div style={{ fontSize: '0.75rem' }}>{apt.time}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{apt.patientName}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{apt.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No upcoming appointments.</p>
          )}
        </Card>
      </div>

      <DynamicCalendar 
        title="Therapist Schedule" 
        description="Manage your monthly and weekly schedules."
        appointments={appointments}
        leaves={leaves}
      />
    </div>
  );
};

export default TherapistCalendar;
