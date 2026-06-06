import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Clock, Plus, Trash2, Copy } from 'lucide-react';

const TherapistAvailability = () => {
  const [schedule, setSchedule] = useState({
    Monday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
    Tuesday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
    Wednesday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }] },
    Thursday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
    Friday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '04:00 PM' }] },
    Saturday: { active: false, slots: [] },
    Sunday: { active: false, slots: [] },
  });

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

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            Availability Management
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Set your regular working hours and breaks.</p>
        </div>
        <Button>Save Availability</Button>
      </div>

      <Card className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.entries(schedule).map(([day, data], index) => (
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
                              <input type="text" defaultValue={slot.start} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }} />
                            </div>
                            <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>-</span>
                            <div className="input-field" style={{ width: '120px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                              <Clock size={14} color="var(--primary)" /> 
                              <input type="text" defaultValue={slot.end} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }} />
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
                  <Button variant="outline" size="sm" style={{ padding: '0.5rem' }} title="Copy to all days">
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
