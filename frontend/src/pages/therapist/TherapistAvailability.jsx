import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Clock, Plus, Trash2, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { therapistApi } from '../../services/api';

const TherapistAvailability = () => {
  const { user } = useAuth();
  const [therapistId, setTherapistId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null); // { text, type: 'success' | 'error' }

  const [schedule, setSchedule] = useState({
    Monday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
    Tuesday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
    Wednesday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }] },
    Thursday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
    Friday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '04:00 PM' }] },
    Saturday: { active: false, slots: [] },
    Sunday: { active: false, slots: [] },
  });

  // Fetch therapist ID on mount
  useEffect(() => {
    if (!user) return;
    therapistApi
      .getAll()
      .then((list) => {
        const found = list.find((item) => item.email === user.email || item.userId === user.id);
        if (found) {
          setTherapistId(found.id);
        }
      })
      .catch((err) => {
        console.error('Failed to load therapist profile', err);
      });
  }, [user]);

  // Fetch availability when therapistId is resolved
  useEffect(() => {
    if (!therapistId) return;
    therapistApi
      .getAvailability(therapistId)
      .then((res) => {
        if (res.data && res.data.schedule) {
          const hasData = Object.values(res.data.schedule).some((d) => d.active);
          if (hasData) {
            setSchedule(res.data.schedule);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to fetch availability schedule', err);
      });
  }, [therapistId]);

  const toggleDay = (day) => {
    setSchedule(prev => {
      const isNowActive = !prev[day].active;
      return {
        ...prev,
        [day]: { 
          ...prev[day], 
          active: isNowActive,
          slots: isNowActive && prev[day].slots.length === 0 ? [{ start: '09:00 AM', end: '05:00 PM' }] : prev[day].slots
        }
      };
    });
  };

  const removeSlot = (day, index) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], slots: prev[day].slots.filter((_, i) => i !== index) }
    }));
  };

  const addSlot = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], slots: [...prev[day].slots, { start: '05:00 PM', end: '06:00 PM' }] }
    }));
  };

  const updateSlotTime = (day, index, field, value) => {
    setSchedule(prev => {
      const newSlots = [...prev[day].slots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return {
        ...prev,
        [day]: { ...prev[day], slots: newSlots }
      };
    });
  };

  const copyToAllDays = (fromDay) => {
    const slotsToCopy = [...schedule[fromDay].slots];
    setSchedule(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(day => {
        if (next[day].active) {
          next[day] = { ...next[day], slots: JSON.parse(JSON.stringify(slotsToCopy)) };
        }
      });
      return next;
    });
    
    setMessage({ text: `Copied slots from ${fromDay} to all other active days!`, type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async () => {
    if (!therapistId) {
      setMessage({ text: 'Therapist profile not found. Unable to save.', type: 'error' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      // Send the schedule directly to the backend
      await therapistApi.updateAvailability(therapistId, {
        availability: 'Available',
        weeklySchedule: schedule,
      });

      setMessage({ text: 'Availability saved successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ text: err.message || 'Failed to save availability. Please try again.', type: 'error' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
      
      {/* Toast message banner */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.925rem',
              fontWeight: 500,
              backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: message.type === 'success' ? '#065f46' : '#991b1b',
              border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            }}
          >
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            Availability Management
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Set your regular working hours and breaks.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Availability'}
        </Button>
      </div>

      <Card className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.entries(schedule).map(([day, data]) => (
            <div key={day} style={{ 
              display: 'flex', 
              gap: '2rem', 
              padding: '1.5rem 2rem', 
              borderBottom: day !== 'Sunday' ? '1px solid var(--border)' : 'none', 
              alignItems: 'flex-start',
              backgroundColor: data.active ? 'transparent' : 'rgba(0,0,0,0.02)',
              transition: 'background-color 0.3s ease'
            }}>
              
              <div style={{ width: '150px', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                  <input 
                    type="checkbox" 
                    checked={data.active} 
                    onChange={() => toggleDay(day)}
                    style={{ opacity: 0, width: 0, height: 0 }} 
                  />
                  <span style={{ 
                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: data.active ? 'var(--primary)' : '#cbd5e1', 
                    borderRadius: '24px', transition: '.3s',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <span style={{ 
                      position: 'absolute', height: '18px', width: '18px', 
                      left: data.active ? '22px' : '3px', bottom: '3px', 
                      backgroundColor: 'white', borderRadius: '50%', transition: '.3s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}></span>
                  </span>
                </label>
                <span style={{ fontWeight: 600, fontSize: '1.1rem', color: data.active ? 'var(--text-primary)' : 'var(--text-light)' }}>
                  {day.slice(0,3)}
                </span>
              </div>

              <div style={{ flex: 1, minHeight: '42px' }}>
                <AnimatePresence mode="popLayout">
                  {data.active ? (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -10 }}
                      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                      {data.slots.map((slot, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className="input-field" style={{ width: '120px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                              <Clock size={14} color="var(--primary)" /> 
                              <input 
                                type="text" 
                                value={slot.start} 
                                onChange={(e) => updateSlotTime(day, i, 'start', e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }} 
                              />
                            </div>
                            <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>-</span>
                            <div className="input-field" style={{ width: '120px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                              <Clock size={14} color="var(--primary)" /> 
                              <input 
                                type="text" 
                                value={slot.end} 
                                onChange={(e) => updateSlotTime(day, i, 'end', e.target.value)}
                                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }} 
                              />
                            </div>
                          </div>
                          
                          <button onClick={() => removeSlot(day, i)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', color: 'var(--error)', background: 'var(--error-bg)', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }} className="hover-scale" title="Remove Slot">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => addSlot(day)} style={{ alignSelf: 'flex-start', color: 'var(--primary)' }}>
                        <Plus size={16} style={{ marginRight: '0.5rem' }}/> Add Slot
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      style={{ display: 'flex', alignItems: 'center', height: '42px', color: 'var(--text-light)', fontStyle: 'italic' }}
                    >
                      Unavailable
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {data.active && (
                <div style={{ marginLeft: 'auto' }}>
                  <Button variant="outline" size="sm" style={{ padding: '0.5rem' }} title="Copy to all days" onClick={() => copyToAllDays(day)}>
                    <Copy size={16} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TherapistAvailability;
