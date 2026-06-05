import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Star, ArrowLeft, Calendar, Clock, User } from 'lucide-react';

const QuestionBlock = ({ label, children }) => (
  <div>
    <label style={{
      display: 'block',
      marginBottom: '0.75rem',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }}>
      {label}
    </label>
    {children}
  </div>
);

const FeedbackForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;

  const savedFeedbacks = JSON.parse(localStorage.getItem('patientFeedbacks')) || [];
  const existingFeedback = savedFeedbacks.find(
    fb => fb.appointmentId === appointment?.id
  );

  const [formData, setFormData] = useState(existingFeedback || {
    appointmentId: appointment?.id,
    therapistId: appointment?.therapistId,
    therapistName: appointment?.therapistName,
    date: appointment?.date,
    time: appointment?.time,
    type: appointment?.type,
    overallRating: 0,
    feltHeard: '',
    goalsCovered: '',
    therapistStyle: '',
    sessionFeel: '',
    helpfulPart: '',
    uncomfortablePart: '',
    nextFocus: '',
    additionalComments: ''
  });

  if (!appointment) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card>
          <p style={{ color: 'var(--text-secondary)' }}>
            No appointment selected for feedback.
          </p>
          <Button
            variant="primary"
            style={{ marginTop: '1rem' }}
            onClick={() => navigate('/appointments')}
          >
            Back to Appointments
          </Button>
        </Card>
      </div>
    );
  }

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedFeedback = {
      ...formData,
      id: existingFeedback?.id || `f${Date.now()}`,
      submittedAt: new Date().toISOString()
    };

    const updatedFeedbacks = existingFeedback
      ? savedFeedbacks.map(fb =>
          fb.appointmentId === appointment.id ? updatedFeedback : fb
        )
      : [...savedFeedbacks, updatedFeedback];

    localStorage.setItem('patientFeedbacks', JSON.stringify(updatedFeedbacks));
    navigate('/appointments');
  };

  const optionButtonStyle = (active) => ({
    padding: '0.65rem 1rem',
    borderRadius: 'var(--radius-md)',
    border: active ? '2px solid var(--primary)' : '1px solid var(--border)',
    backgroundColor: active ? 'var(--secondary)' : 'var(--bg-surface)',
    color: active ? 'var(--primary)' : 'var(--text-primary)',
    cursor: 'pointer',
    fontWeight: active ? 600 : 500,
    transition: 'all var(--transition-fast)'
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      maxWidth: '850px',
      margin: '0 auto'
    }}>
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate('/appointments')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
            color: 'var(--text-secondary)'
          }}
        >
          <ArrowLeft size={18} /> Back to Appointments
        </Button>

        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>
          Session Feedback
        </h1>

        <p style={{ color: 'var(--text-secondary)' }}>
          Share your experience so we can understand what helped and improve future sessions.
        </p>
      </div>

      <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--bg-main)',
          borderRadius: 'var(--radius-md)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--primary)" />
            <span style={{ fontWeight: 600 }}>{appointment.therapistName}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Calendar size={18} />
            <span>{appointment.date}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Clock size={18} />
            <span>{appointment.time}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <QuestionBlock label="Overall, how would you rate today’s session?">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => updateField('overallRating', star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <Star
                    size={32}
                    fill={star <= formData.overallRating ? '#facc15' : 'transparent'}
                    color={star <= formData.overallRating ? '#facc15' : '#cbd5e1'}
                  />
                </button>
              ))}
            </div>
          </QuestionBlock>

          <QuestionBlock label="Did you feel heard, understood, and respected by your therapist today?">
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['Yes', 'Somewhat', 'No'].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateField('feltHeard', option)}
                  style={optionButtonStyle(formData.feltHeard === option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </QuestionBlock>

          <QuestionBlock label="Did we talk about and work on what you wanted to work on today?">
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['Yes', 'Somewhat', 'No'].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateField('goalsCovered', option)}
                  style={optionButtonStyle(formData.goalsCovered === option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </QuestionBlock>

          <QuestionBlock label="Does the therapist’s style and the way we work make sense and feel right to you?">
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['Yes', 'Somewhat', 'No'].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateField('therapistStyle', option)}
                  style={optionButtonStyle(formData.therapistStyle === option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </QuestionBlock>

          <QuestionBlock label="Overall, how did today’s session feel for you?">
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['Very helpful', 'Good', 'Okay', 'Difficult', 'Not helpful'].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => updateField('sessionFeel', option)}
                  style={optionButtonStyle(formData.sessionFeel === option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </QuestionBlock>

          <QuestionBlock label="What was the most helpful part of today’s session?">
            <textarea
              rows={3}
              className="input-field"
              value={formData.helpfulPart}
              onChange={(e) => updateField('helpfulPart', e.target.value)}
              placeholder="Write what helped you the most..."
            />
          </QuestionBlock>

          <QuestionBlock label="Was there anything said or done today that felt uncomfortable, confusing, or unhelpful?">
            <textarea
              rows={3}
              className="input-field"
              value={formData.uncomfortablePart}
              onChange={(e) => updateField('uncomfortablePart', e.target.value)}
              placeholder="Share anything that did not feel right, if any..."
            />
          </QuestionBlock>

          <QuestionBlock label="Is there anything specific you would like to focus on or change for our next session?">
            <textarea
              rows={3}
              className="input-field"
              value={formData.nextFocus}
              onChange={(e) => updateField('nextFocus', e.target.value)}
              placeholder="Mention topics, goals, or changes for the next session..."
            />
          </QuestionBlock>

          <QuestionBlock label="Any additional comments or improvement suggestions?">
            <textarea
              rows={4}
              className="input-field"
              value={formData.additionalComments}
              onChange={(e) => updateField('additionalComments', e.target.value)}
              placeholder="Add any other feedback or suggestions..."
            />
          </QuestionBlock>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border)'
          }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/appointments')}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={
                !formData.overallRating ||
                !formData.feltHeard ||
                !formData.goalsCovered ||
                !formData.therapistStyle ||
                !formData.sessionFeel
              }
            >
              {existingFeedback ? 'Update Feedback' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default FeedbackForm;