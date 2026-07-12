import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Star, Sparkles, MessageSquare, Heart, Send } from 'lucide-react';

const FeedbackCard = ({ appointment, onSubmit, onSkip }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comments, setComments] = useState('');

  const availableTags = [
    { label: 'Very helpful', icon: <Sparkles size={14} /> },
    { label: 'Good communication', icon: <MessageSquare size={14} /> },
    { label: 'Felt comfortable', icon: <Heart size={14} /> },
  ];

  const toggleTag = (tagLabel) => {
    if (selectedTags.includes(tagLabel)) {
      setSelectedTags(selectedTags.filter(t => t !== tagLabel));
    } else {
      setSelectedTags([...selectedTags, tagLabel]);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'DR';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '1.125rem'
          }}>
            {getInitials(appointment.therapistName)}
          </div>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{appointment.therapistName}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {appointment.type || 'Clinical Psychologist'} • {appointment.date} • {appointment.time}
            </p>
          </div>
        </div>
        <div style={{
          backgroundColor: 'var(--success-bg)', color: 'var(--success)',
          padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem', fontWeight: 600
        }}>
          Completed
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '1rem' }}>How was your session?</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              size={24}
              strokeWidth={1.5}
              fill={star <= (hoverRating || rating) ? '#f59e0b' : 'transparent'}
              color={star <= (hoverRating || rating) ? '#f59e0b' : 'var(--text-light)'}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h4 style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '1rem' }}>Quick feedback</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {availableTags.map(tag => (
            <button
              key={tag.label}
              type="button"
              onClick={() => toggleTag(tag.label)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem', fontWeight: 500,
                border: '1px solid',
                backgroundColor: selectedTags.includes(tag.label) ? '#fef3c7' : 'transparent',
                borderColor: selectedTags.includes(tag.label) ? '#d97706' : 'var(--border)',
                color: selectedTags.includes(tag.label) ? '#b45309' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tag.icon}
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div>
        <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1rem' }}>Share your experience (optional)</h4>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="The therapist was patient and explained everything clearly."
          rows={3}
          style={{
            width: '100%', padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Your feedback helps improve future sessions.
        </span>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={onSkip}
            style={{
              backgroundColor: 'transparent', border: 'none',
              fontWeight: 600, fontSize: '0.875rem',
              color: 'var(--text-primary)', cursor: 'pointer'
            }}
          >
            Skip
          </button>
          <Button
            variant="primary"
            onClick={() => onSubmit({ rating, tags: selectedTags, comments })}
            disabled={rating === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: '#111827', color: '#fff', padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <Send size={16} />
            Submit Feedback
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FeedbackCard;
