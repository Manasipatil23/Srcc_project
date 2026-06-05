import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { mockAppointments, mockFeedbacks } from '../data/mockData';
import { Calendar, Clock, User, AlertCircle, MapPin } from 'lucide-react';

const MyAppointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState(mockAppointments);
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const [feedbacks] = useState(() => {
    const savedFeedbacks = localStorage.getItem('patientFeedbacks');
    return savedFeedbacks ? JSON.parse(savedFeedbacks) : mockFeedbacks;
  });

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'Upcoming') return apt.status === 'Upcoming';
    if (activeTab === 'Past') return apt.status === 'Completed';
    if (activeTab === 'Cancelled') return apt.status === 'Cancelled';
    return true;
  });

  const handleCancelClick = (apt) => {
  setSelectedAppointment(apt);
  setCancelReason('');
  setIsCancelModalOpen(true);
};

  const confirmCancel = () => {
  setAppointments(appointments.map(apt =>
    apt.id === selectedAppointment.id
      ? { ...apt, status: 'Cancelled', cancellationReason: cancelReason }
      : apt
  ));

  setIsCancelModalOpen(false);
  setSelectedAppointment(null);
  setCancelReason('');
};

  const handleReschedule = (apt) => {
    navigate('/reschedule', { state: { appointment: apt } });
  };

  const handleFeedbackClick = (apt) => {
    navigate('/feedback-form', {
      state: {
        appointment: apt
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>My Appointments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>View and manage your upcoming and past sessions in timeline view.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        {['Upcoming', 'Past', 'Cancelled'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              fontWeight: 600,
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
              transition: 'all var(--transition-fast)'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '6px', width: '2px', backgroundColor: 'var(--border)' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {filteredAppointments.length > 0 ? filteredAppointments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{ position: 'relative' }}
            >
              <div style={{
                position: 'absolute',
                top: '24px',
                left: '-1.5rem',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                border: `2px solid ${apt.status === 'Upcoming' ? 'var(--primary)' : apt.status === 'Completed' ? 'var(--success)' : 'var(--error)'}`,
                zIndex: 1
              }}></div>

              <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginLeft: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <User size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{apt.therapistName}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{apt.type}</p>
                    </div>
                  </div>

                  <span style={{
                    backgroundColor: apt.status === 'Upcoming' ? 'var(--secondary)' : apt.status === 'Completed' ? 'var(--success-bg)' : 'var(--error-bg)',
                    color: apt.status === 'Upcoming' ? 'var(--primary)' : apt.status === 'Completed' ? 'var(--success)' : 'var(--error)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {apt.status}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <Calendar size={16} />
                    <span>{apt.date}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <Clock size={16} />
                    <span>{apt.time}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <MapPin size={16} />
                    <span>Telehealth Session</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  {apt.status === 'Upcoming' && (
                    <>
                      <Button variant="danger" size="sm" onClick={() => handleCancelClick(apt)}>Cancel</Button>
                      <Button variant="primary" size="sm" onClick={() => handleReschedule(apt)}>Reschedule</Button>
                    </>
                  )}

                  {apt.status !== 'Upcoming' && (
                    <>
                      <Button variant="outline" size="sm">View Notes</Button>

                      {apt.status === 'Completed' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleFeedbackClick(apt)}
                        >
                          {feedbacks.some(fb => fb.appointmentId === apt.id)
                            ? 'View/Edit Feedback'
                            : 'Give Feedback'}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          )) : (
            <div style={{ marginLeft: '1.5rem', padding: '3rem', textAlign: 'center', color: 'var(--text-light)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
              <p>No appointments found in this category.</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} title="Cancel Appointment">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', backgroundColor: 'var(--error-bg)', borderRadius: 'var(--radius-md)', color: 'var(--error)' }}>
            <AlertCircle size={24} style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.875rem' }}>Are you sure you want to cancel this appointment? This action cannot be undone and you may be charged a cancellation fee if within 24 hours.</p>
          </div>

          <div>
  <label style={{
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'var(--text-primary)'
  }}>
    Reason for cancellation
  </label>

  <textarea
    rows={4}
    className="input-field"
    placeholder="Please mention why you want to cancel this appointment"
    value={cancelReason}
    onChange={(e) => setCancelReason(e.target.value)}
  />
</div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>Keep Appointment</Button>
            <Button
             variant="danger"
             onClick={confirmCancel}
             disabled={!cancelReason.trim()}
            >
  Yes, Cancel
</Button>
          </div>
        </div>
        
      </Modal>
    </div>
  );
};

export default MyAppointments;