import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { feedbackApi } from '../services/api';
import { Star, Calendar, Clock, Sparkles, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const feedbackTags = [
  { id: 'helpful', label: 'Very helpful', icon: Sparkles },
  { id: 'communication', label: 'Good communication', icon: Clock },
  { id: 'comfortable', label: 'Felt comfortable', icon: Calendar },
];

const FeedbackForm = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;

  const [formData, setFormData] = useState({
    appointmentId: appointment?.id,
    therapistId: appointment?.therapistId,
    therapistName: appointment?.therapistName,
    overallRating: 0,
    tags: [],
    comments: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!appointment) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>No Appointment Selected</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Please select an appointment from your dashboard to provide feedback.</p>
        <button onClick={() => navigate('/appointments')} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>Back to Appointments</button>
      </div>
    );
  }

  const handleTagToggle = (tagLabel) => {
    setFormData(prev => {
      if (prev.tags.includes(tagLabel)) {
        return { ...prev, tags: prev.tags.filter(t => t !== tagLabel) };
      }
      return { ...prev, tags: [...prev.tags, tagLabel] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.overallRating === 0) {
      setError('Please provide an overall rating.');
      return;
    }

    setIsLoading(true);

    try {
      await feedbackApi.submit({
        appointmentId: formData.appointmentId,
        therapistId: formData.therapistId,
        patientId: user?.id,
        overallRating: formData.overallRating,
        tags: formData.tags,
        comments: formData.comments,
        responses: {}
      });
      setSuccess(true);
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback.');
      setIsLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'DR';
    // If name starts with "Dr. " remove it to get the initials of the actual name
    const cleanName = name.replace(/^Dr\.\s*/i, '');
    const parts = cleanName.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', fontFamily: 'Inter, sans-serif' }}>
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0', width: '100%', maxWidth: '650px' }}>
            <div className="pulse-success" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle size={40} color="var(--success)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Thank You!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Your feedback has been submitted successfully.</p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: '650px' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '20px', 
              border: '1px solid #e5e7eb', 
              padding: '32px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
            }}>
              
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ 
                    width: '64px', height: '64px', 
                    backgroundColor: '#e6f0ff',
                    color: '#3b82f6',
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '600', fontSize: '16px',
                    letterSpacing: '0.5px'
                  }}>
                    {getInitials(appointment.therapistName)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.3px' }}>
                      {appointment.therapistName}
                    </h2>
                    <p style={{ color: '#6b7280', fontSize: '14.5px', margin: 0 }}>
                      Clinical Psychologist • {appointment.date} • {appointment.time}
                    </p>
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: '#d1fae5', color: '#059669', 
                  padding: '6px 14px', borderRadius: '20px', 
                  fontSize: '13px', fontWeight: '500' 
                }}>
                  Completed
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '0 0 28px 0' }} />

              <form onSubmit={handleSubmit}>
                {/* Rating */}
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>How was your session?</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, overallRating: star})}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', transition: 'transform 0.1s' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Star 
                          size={28} 
                          fill={star <= formData.overallRating ? '#f59e0b' : 'transparent'} 
                          color={star <= formData.overallRating ? '#f59e0b' : '#d1d5db'} 
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Feedback Tags */}
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>Quick feedback</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {feedbackTags.map(({ id, label, icon: Icon }) => {
                      const isSelected = formData.tags.includes(label);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleTagToggle(label)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 20px',
                            borderRadius: '30px',
                            border: `1px solid ${isSelected ? '#f59e0b' : '#fcd34d'}`,
                            backgroundColor: isSelected ? '#fffbeb' : '#fffbeb',
                            color: '#b45309',
                            cursor: 'pointer',
                            fontSize: '14.5px',
                            fontWeight: '400',
                            transition: 'all 0.2s',
                            boxShadow: isSelected ? '0 0 0 1px #f59e0b' : 'none'
                          }}
                        >
                          <Icon size={16} strokeWidth={1.5} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience Textarea */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '500', color: '#111827', marginBottom: '16px' }}>Share your experience (optional)</h3>
                  <textarea
                    rows="4"
                    value={formData.comments}
                    onChange={(e) => setFormData({...formData, comments: e.target.value})}
                    placeholder="The therapist was patient and explained everything clearly."
                    style={{ 
                      width: '100%', 
                      padding: '16px', 
                      borderRadius: '12px', 
                      border: '1px solid #e5e7eb', 
                      fontSize: '15px',
                      color: '#4b5563',
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.01)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#9ca3af'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                {error && (
                  <div style={{ padding: '12px', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '8px', fontSize: '14px', marginBottom: '24px' }}>
                    {error}
                  </div>
                )}

                <div style={{ height: '1px', backgroundColor: '#f3f4f6', margin: '0 0 24px 0' }} />

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: '#6b7280', fontSize: '14.5px', margin: 0 }}>Your feedback helps improve future sessions.</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <button 
                      type="button"
                      onClick={() => navigate('/appointments')}
                      style={{ 
                        background: 'none', border: 'none', color: '#111827', 
                        fontWeight: '500', fontSize: '15px', cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Skip
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={isLoading}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: '#111827', color: 'white',
                        padding: '12px 24px', borderRadius: '30px',
                        fontWeight: '500', fontSize: '15px',
                        border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.8 : 1,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      <Send size={16} strokeWidth={2} style={{ transform: 'rotate(45deg)', marginTop: '-2px' }} />
                      {isLoading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackForm;