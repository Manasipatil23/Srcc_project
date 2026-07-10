import React, { useState, useEffect } from 'react';
import { leaveApi, appointmentApi } from '../services/api';
import { socket } from '../services/socket';
import DynamicCalendar from '../components/ui/DynamicCalendar';

const AdminCalendar = () => {
  const [leaves, setLeaves] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const fetchLeaves = () => {
    leaveApi.getAll()
      .then(setLeaves)
      .catch(err => console.error("Error fetching leaves for admin calendar", err));
  };

  const fetchAppointments = () => {
    appointmentApi.getAll()
      .then(setAppointments)
      .catch(err => console.error("Error fetching appointments for admin calendar", err));
  };

  useEffect(() => {
    fetchLeaves();
    fetchAppointments();

    const handleUpdate = () => {
      fetchLeaves();
      fetchAppointments();
    };

    socket.on('leave_updated', handleUpdate);
    socket.on('appointment_updated', handleUpdate);
    return () => {
      socket.off('leave_updated', handleUpdate);
      socket.off('appointment_updated', handleUpdate);
    };
  }, []);

  return (
    <DynamicCalendar 
      title="System Calendar" 
      description="Overview of all therapist schedules, appointments, and leaves."
      appointments={appointments}
      leaves={leaves}
    />
  );
};

export default AdminCalendar;
