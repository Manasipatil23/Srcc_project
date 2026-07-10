import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { therapistApi, scheduleApi, appointmentApi } from '../services/api';
import { socket } from '../services/socket';
import Avatar from '../components/ui/Avatar';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, ChevronRight, ChevronLeft, Star } from 'lucide-react';

const AppointmentBooking = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    therapistApi.getAll().then(setTherapists).catch(() => setTherapists([]));
  }, []);

  useEffect(() => {
    const handleUpdate = (data) => {
      if (selectedTherapist && data.therapistId === selectedTherapist.id) {
        setRefreshTrigger(prev => prev + 1);
      }
    };
    
    socket.on('appointment_updated', handleUpdate);
    socket.on('leave_updated', handleUpdate);
    
    return () => {
      socket.off('appointment_updated', handleUpdate);
      socket.off('leave_updated', handleUpdate);
    };
  }, [selectedTherapist]);

  useEffect(() => {
    if (!selectedTherapist || !selectedDate) {
      setAvailableSlots([]);
      return;
    }
    setIsLoadingSlots(true);
    scheduleApi
      .getAvailableSlots(selectedTherapist.id, selectedDate)
      .then((slots) => {
        setAvailableSlots(slots);
      })
      .catch((err) => {
        console.error('Failed to fetch available slots', err);
        setAvailableSlots([]);
      })
      .finally(() => {
        setIsLoadingSlots(false);
      });
  }, [selectedTherapist, selectedDate, refreshTrigger]);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleBook = async () => {
    setBookingError('');
    try {
      await appointmentApi.book({
        therapistId: selectedTherapist.id,
        patientId: user?.id,
        patientName: user?.name || 'Guest Patient',
        date: selectedDate,
        time: selectedSlot,
        type: 'Consultation',
      });
      // Refresh slot availability so the booked slot shows as taken immediately
      setRefreshTrigger((prev) => prev + 1);
      nextStep(); // Move to success step
      setTimeout(() => {
        setStep(1);
        setSelectedDate('');
        setSelectedTherapist(null);
        setSelectedSlot(null);
      }, 4000);
    } catch (err) {
      setBookingError(err.message || 'Booking failed. Please try again.');
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Book an Appointment</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Follow the simple steps to schedule your session.</p>
      </div>

      {/* Progress Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', backgroundColor: 'var(--border)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: '50%', left: 0, width: `${((step - 1) / 3) * 100}%`, height: '2px', backgroundColor: 'var(--primary)', zIndex: 1, transition: 'width 0.4s ease' }}></div>
        {[1, 2, 3, 4].map(num => (
          <div key={num} style={{ 
            width: '32px', height: '32px', borderRadius: '50%', zIndex: 2,
            backgroundColor: step >= num ? 'var(--primary)' : 'var(--bg-surface)', 
            border: `2px solid ${step >= num ? 'var(--primary)' : 'var(--border)'}`,
            color: step >= num ? 'white' : 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, transition: 'all 0.4s ease'
          }}>
            {step > num ? <CheckCircle size={16} /> : num}
          </div>
        ))}
      </div>

      <Card style={{ overflow: 'hidden', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Select Therapist</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }} className="no-scrollbar">
                {therapists.map(therapist => (
                  <div 
                    key={therapist.id} 
                    onClick={() => setSelectedTherapist(therapist)}
                    style={{
                      padding: '1rem', border: `2px solid ${selectedTherapist?.id === therapist.id ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all var(--transition-fast)',
                      backgroundColor: selectedTherapist?.id === therapist.id ? 'var(--secondary)' : 'var(--bg-surface)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Avatar name={therapist.name} src={therapist.image} size={48} />
                      <div>
                        <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{therapist.name}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{therapist.specialty}</p>
                        <div style={{
                          display: 'flex',
                         alignItems: 'center',
                         gap: '0.35rem',
                         marginTop: '0.25rem',
                         color: 'var(--text-secondary)',
                         fontSize: '0.8rem'
                       }}>
                         <Star size={14} fill="#facc15" color="#facc15" />
                         <span>{therapist.rating} / 5</span>
                       </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Select Date & Time</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    style={{ maxWidth: '300px' }}
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500 }}>Available Slots</label>
                    {isLoadingSlots ? (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        Loading available slots...
                      </p>
                    ) : availableSlots.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
                        {availableSlots.map(slotObj => {
                          const slot = slotObj.time;
                          const isAvailable = slotObj.available;
                          return (
                            <button
                              key={slot}
                              onClick={() => isAvailable && setSelectedSlot(slot)}
                              disabled={!isAvailable}
                              style={{
                                padding: '0.75rem 0.5rem',
                                border: `1px solid ${
                                  selectedSlot === slot
                                    ? 'var(--primary)'
                                    : isAvailable
                                    ? '#22c55e'
                                    : '#ef4444'
                                }`,
                                borderRadius: 'var(--radius-md)',
                                backgroundColor:
                                  selectedSlot === slot
                                    ? 'var(--primary)'
                                    : isAvailable
                                    ? '#ecfdf5'
                                    : '#fef2f2',
                                color:
                                  selectedSlot === slot
                                    ? 'white'
                                    : isAvailable
                                    ? '#15803d'
                                    : '#b91c1c',
                                cursor: isAvailable ? 'pointer' : 'not-allowed',
                                transition: 'all var(--transition-fast)',
                                fontWeight: selectedSlot === slot ? 600 : 500,
                                opacity: isAvailable ? 1 : 0.85
                              }}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        No available slots for this date. (Therapist is off or fully booked)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Confirm Details</h2>
              <div style={{ padding: '2rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                  <Avatar name={selectedTherapist?.name || ''} src={selectedTherapist?.image} size={64} />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{selectedTherapist?.name}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>{selectedTherapist?.specialty}</p>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Date</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><CalendarIcon size={18} color="var(--primary)" /> {selectedDate}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Time</p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}><Clock size={18} color="var(--primary)" /> {selectedSlot}</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Consultation Fee</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>₹{selectedTherapist?.fee ?? 500}</p>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '260px', textAlign: 'right' }}>
                    Payable at the SRCC accounts desk before your session.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
              <div className="pulse-success" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <CheckCircle size={40} color="var(--success)" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Booking Confirmed!</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Your appointment with {selectedTherapist?.name} is set for {selectedDate} at {selectedSlot}.</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', marginTop: '1rem' }}>Redirecting to booking screen...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Booking error */}
        {step === 3 && bookingError && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', border: '1px solid var(--error)' }}>
            {bookingError}
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <Button variant="outline" onClick={prevStep} disabled={step === 1}>
              <ChevronLeft size={18} /> Back
            </Button>
            
            {step < 3 ? (
              <Button variant="primary" onClick={nextStep} disabled={(step === 1 && !selectedTherapist) || (step === 2 && (!selectedDate || !selectedSlot))}>
                Continue <ChevronRight size={18} />
              </Button>
            ) : (
              <Button variant="primary" onClick={handleBook}>
                Confirm Booking <CheckCircle size={18} style={{ marginLeft: '0.5rem' }} />
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AppointmentBooking;
