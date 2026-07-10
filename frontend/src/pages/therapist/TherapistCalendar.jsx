import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { leaveApi, appointmentApi } from '../../services/api';
import { socket } from '../../services/socket';
import DynamicCalendar from '../../components/ui/DynamicCalendar';

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

  return (
    <DynamicCalendar 
      title="Therapist Schedule" 
      description="Manage your monthly and weekly schedules."
      appointments={appointments}
      leaves={leaves}
    />
  );
};

export default TherapistCalendar;
