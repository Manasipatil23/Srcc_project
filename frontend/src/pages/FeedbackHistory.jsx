import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Star, Calendar, Clock, User, MessageSquare } from 'lucide-react';

const FeedbackHistory = () => {
  const navigate = useNavigate();

  const feedbacks = JSON.parse(localStorage.getItem('patientFeedbacks')) || [];

  const renderStars = (rating) => (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={18}
          fill={star <= rating ? '#facc15' : 'transparent'}
          color={star <= rating ? '#facc15' : '#cbd5e1'}
        />
      ))}
    </div>
  );

  const handleEdit = (feedback) => {
    navigate('/feedback-form', {
      state: {
        appointment: {
          id: feedback.appointmentId,
          therapistId: feedback.therapistId,
          therapistName: feedback.therapistName,
          date: feedback.date,
          time: feedback.time,
          type: feedback.type
        }
      }
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      maxWidth: '900px'
    }}>
      <div>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>
          Feedback History
        </h1>

        <p style={{ color: 'var(--text-secondary)' }}>
          View and update feedback submitted for your completed sessions.
        </p>
      </div>

      {feedbacks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {feedbacks.map(feedback => (
            <Card
              key={feedback.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}>
                    <User size={24} />
                  </div>

                  <div>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      marginBottom: '0.25rem'
                    }}>
                      {feedback.therapistName}
                    </h3>

                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem'
                    }}>
                      {feedback.type}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {renderStars(feedback.overallRating)}
                  <p style={{
                    color: 'var(--text-light)',
                    fontSize: '0.75rem',
                    marginTop: '0.25rem'
                  }}>
                    Overall Rating
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1.5rem',
                padding: '1rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}>
                  <Calendar size={16} />
                  <span>{feedback.date}</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}>
                  <Clock size={16} />
                  <span>{feedback.time}</span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>
                    Felt heard and respected
                  </p>
                  <p style={{ fontWeight: 500 }}>{feedback.feltHeard}</p>
                </div>

                <div>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>
                    Goals covered
                  </p>
                  <p style={{ fontWeight: 500 }}>{feedback.goalsCovered}</p>
                </div>

                <div>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>
                    Session experience
                  </p>
                  <p style={{ fontWeight: 500 }}>{feedback.sessionFeel}</p>
                </div>
              </div>

              {(feedback.helpfulPart || feedback.additionalComments) && (
                <div style={{
                  padding: '1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                    color: 'var(--primary)',
                    fontWeight: 600
                  }}>
                    <MessageSquare size={18} />
                    Feedback Notes
                  </div>

                  {feedback.helpfulPart && (
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem'
                    }}>
                      <strong>Most helpful:</strong> {feedback.helpfulPart}
                    </p>
                  )}

                  {feedback.additionalComments && (
                    <p style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem'
                    }}>
                      <strong>Additional comments:</strong> {feedback.additionalComments}
                    </p>
                  )}
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEdit(feedback)}
                >
                  Edit Feedback
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--text-secondary)'
        }}>
          <MessageSquare
            size={40}
            color="var(--text-light)"
            style={{ marginBottom: '1rem' }}
          />
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            No feedback submitted yet
          </h3>
          <p>
            Feedback given after completed appointments will appear here.
          </p>
        </Card>
      )}
    </div>
  );
};

export default FeedbackHistory;