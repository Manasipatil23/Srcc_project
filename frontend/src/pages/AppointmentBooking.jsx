import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { mockTherapists, timeSlots } from '../data/mockData';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const AppointmentBooking = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleBook = () => {
    nextStep(); // Move to success step
    setTimeout(() => {
      setStep(1);
      setSelectedDate('');
      setSelectedTherapist(null);
      setSelectedSlot(null);
    }, 4000);
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
                {mockTherapists.map(therapist => (
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
                      <img src={therapist.image} alt={therapist.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <h3 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{therapist.name}</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{therapist.specialty}</p>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            padding: '0.75rem 0.5rem', border: `1px solid ${selectedSlot === slot ? 'var(--primary)' : 'var(--border)'}`,
                            borderRadius: 'var(--radius-md)', backgroundColor: selectedSlot === slot ? 'var(--primary)' : 'var(--bg-main)',
                            color: selectedSlot === slot ? 'white' : 'var(--text-primary)', cursor: 'pointer', transition: 'all var(--transition-fast)',
                            fontWeight: selectedSlot === slot ? 600 : 400
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
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
                  <img src={selectedTherapist?.image} alt={selectedTherapist?.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
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
