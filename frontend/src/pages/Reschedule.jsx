import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { appointmentApi, scheduleApi } from '../services/api';
import { Calendar, Clock, ArrowRight, CheckCircle } from 'lucide-react';

const Reschedule = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [rescheduleError, setRescheduleError] = useState('');

  useEffect(() => {
    if (!appointment) return;
    scheduleApi
      .getTherapistSlots()
      .then((byName) => setAvailableSlots(byName[appointment.therapistName] || []))
      .catch(() => setAvailableSlots([]));
  }, [appointment]);

  if (!appointment) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>No appointment selected for rescheduling.</p>
        <Button onClick={() => navigate('/appointments')} className="mt-4">Back to Appointments</Button>
      </div>
    );
  }

  const handleConfirm = async () => {
    setRescheduleError('');
    try {
      await appointmentApi.reschedule(appointment.id, {
        date: selectedDate,
        time: selectedSlot,
      });
      setIsModalOpen(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (err) {
      setRescheduleError(err.message || 'Reschedule failed. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Reschedule Appointment</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Select a new date and time for your session with {appointment.therapistName}.</p>
      </div>

      {/* Current Details */}
      <Card style={{ backgroundColor: 'var(--bg-main)' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)' }}>Current Appointment</h2>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={18} color="var(--primary)" />
            <span style={{ fontWeight: 500 }}>{appointment.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={18} color="var(--primary)" />
            <span style={{ fontWeight: 500 }}>{appointment.time}</span>
          </div>
        </div>
      </Card>

      {/* New Selection */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>1. Select New Date</h2>
          <input 
            type="date" 
            className="input-field" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            style={{ maxWidth: '300px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>2. Select New Time</h2>
          {selectedDate ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
              {availableSlots.map(slotObj => {
                const slot = slotObj.time;
                const disabled = !slotObj.available;
                return (
                  <button
                    key={slot}
                    onClick={() => !disabled && setSelectedSlot(slot)}
                    disabled={disabled}
                    style={{
                      padding: '0.5rem', border: `1px solid ${selectedSlot === slot ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)', backgroundColor: selectedSlot === slot ? 'var(--primary)' : 'transparent',
                      color: selectedSlot === slot ? 'white' : 'var(--text-primary)', cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.4 : 1, transition: 'all var(--transition-fast)'
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--text-light)' }}>Please select a new date first.</p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <Button variant="ghost" onClick={() => navigate('/appointments')}>Cancel</Button>
          <Button 
            variant="primary" 
            disabled={!selectedDate || !selectedSlot}
            onClick={() => setIsModalOpen(true)}
          >
            Review Changes
          </Button>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Reschedule">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to reschedule this appointment?</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.5rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Current</p>
              <p style={{ fontWeight: 600 }}>{appointment.date}</p>
              <p style={{ fontSize: '0.875rem' }}>{appointment.time}</p>
            </div>
            
            <ArrowRight color="var(--primary)" />
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>New</p>
              <p style={{ fontWeight: 600 }}>{selectedDate}</p>
              <p style={{ fontSize: '0.875rem' }}>{selectedSlot}</p>
            </div>
          </div>

          {rescheduleError && (
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', border: '1px solid var(--error)' }}>
              {rescheduleError}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Back</Button>
            <Button variant="primary" onClick={handleConfirm}>Confirm Reschedule</Button>
          </div>
        </div>
      </Modal>

      {/* Success Toast */}
      {isSuccess && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          backgroundColor: 'var(--bg-surface)', padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
          display: 'flex', alignItems: 'center', gap: '1rem',
          borderLeft: '4px solid var(--success)', zIndex: 100,
          animation: 'slideIn 0.3s ease-out forwards'
        }}>
          <CheckCircle size={24} color="var(--success)" />
          <div>
            <h4 style={{ fontWeight: 600 }}>Reschedule Confirmed</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Your appointment has been successfully rescheduled.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reschedule;
