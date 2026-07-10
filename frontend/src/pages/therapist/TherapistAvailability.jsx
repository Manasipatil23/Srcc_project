import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { CheckCircle, AlertCircle, Copy, Plus, X, ChevronLeft, ChevronRight, Info, Calendar as CalendarIcon, Clock, ChevronDown, MoreVertical, LayoutList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { therapistApi, appointmentApi, scheduleApi } from '../../services/api';

const timeOptions = [];
for (let i = 0; i < 24 * 2; i++) {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  const ampm = h < 12 ? 'AM' : 'PM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const pad = (n) => String(n).padStart(2, '0');
  timeOptions.push(`${pad(displayH)}:${m} ${ampm}`);
}

const TherapistAvailability = () => {
  const { user } = useAuth();
  const [therapistId, setTherapistId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  const todayDateObj = new Date();
  const todayDateString = todayDateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
  const today = todayDateObj.toISOString().split('T')[0];
  const dayOfWeek = todayDateObj.toLocaleDateString('en-US', { weekday: 'long' });

  const defaultSchedule = {
    Monday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
    Tuesday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
    Wednesday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
    Thursday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
    Friday: { active: true, slots: [{ start: '09:00 AM', end: '01:00 PM' }, { start: '02:00 PM', end: '05:00 PM' }] },
    Saturday: { active: false, slots: [] },
    Sunday: { active: false, slots: [] },
  };

  const [schedule, setSchedule] = useState(defaultSchedule);

  const [settings, setSettings] = useState({
    buffer: '15 mins',
    maxAppts: '8',
    minNotice: '2 hours',
    interval: '30 mins'
  });

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
      .catch((err) => console.error(err));
  }, [user]);

  useEffect(() => {
    if (!therapistId) return;
    
    appointmentApi.getAll({ therapistId })
      .then(res => setAppointments(res.data || res || []))
      .catch(err => console.error(err));
      
    scheduleApi.getAvailableSlots(therapistId, today)
      .then(res => setAvailableSlots(res.data || []))
      .catch(err => console.error(err));

    therapistApi
      .getAvailability(therapistId)
      .then((res) => {
        if (res.data && res.data.schedule) {
          const hasData = Object.values(res.data.schedule).some((d) => d.active);
          if (hasData) setSchedule(res.data.schedule);
        }
      })
      .catch((err) => console.error(err));
  }, [therapistId, today]);

  const todayAppointments = (Array.isArray(appointments) ? appointments : []).filter(a => a.date === today && a.status !== 'Cancelled');

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

  const updateSlotTime = (day, index, field, value) => {
    setSchedule(prev => {
      const newSlots = [...prev[day].slots];
      newSlots[index] = { ...newSlots[index], [field]: value };
      return { ...prev, [day]: { ...prev[day], slots: newSlots } };
    });
  };

  const getBreaks = (slots) => {
    const breaks = [];
    for (let i = 0; i < slots.length - 1; i++) {
      if (slots[i].end !== slots[i+1].start) {
        breaks.push({ index: i, start: slots[i].end, end: slots[i+1].start });
      }
    }
    return breaks;
  };

  const removeBreak = (day, breakIndex) => {
    setSchedule(prev => {
      const slots = [...prev[day].slots];
      const mergedSlot = { start: slots[breakIndex].start, end: slots[breakIndex + 1].end };
      slots.splice(breakIndex, 2, mergedSlot);
      return { ...prev, [day]: { ...prev[day], slots } };
    });
  };

  const addBreak = (day) => {
    setSchedule(prev => {
      const slots = [...prev[day].slots];
      if (slots.length === 0) return prev;
      const lastSlot = slots[slots.length - 1];
      const newSlots = [...slots];
      newSlots.pop();
      newSlots.push({ start: lastSlot.start, end: '01:00 PM' });
      newSlots.push({ start: '02:00 PM', end: lastSlot.end === '01:00 PM' ? '05:00 PM' : lastSlot.end });
      return { ...prev, [day]: { ...prev[day], slots: newSlots } };
    });
  };

  const copyToAllDays = (fromDay) => {
    const slotsToCopy = [...schedule[fromDay].slots];
    setSchedule(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(day => {
        if (day !== 'Saturday' && day !== 'Sunday') {
          next[day] = { active: true, slots: JSON.parse(JSON.stringify(slotsToCopy)) };
        }
      });
      return next;
    });
    setMessage({ text: `Schedule copied to Mon-Fri!`, type: 'success' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async () => {
    if (!therapistId) return setMessage({ text: 'Therapist profile not found.', type: 'error' });
    setIsSaving(true);
    try {
      await therapistApi.updateAvailability(therapistId, { availability: 'Available', weeklySchedule: schedule });
      setMessage({ text: 'Availability saved successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2', color: message.type === 'success' ? '#065f46' : '#991b1b', border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`, fontWeight: 500 }}
          >
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#f0f4ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarIcon size={24} color="#5b5fcf" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem', color: '#1f2937' }}>
              Availability Management
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>Manage your working hours, breaks and availability for appointments.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="outline" onClick={() => setSchedule(defaultSchedule)} style={{ padding: '0.6rem 1rem', fontSize: '0.9rem' }}>↻ Reset</Button>
          <Button onClick={handleSave} disabled={isSaving} style={{ backgroundColor: '#5b5fcf', color: 'white', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
            {isSaving ? 'Saving...' : '💾 Save Availability'}
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Weekly Schedule & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ padding: 0, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: 'none', borderRadius: '12px' }}>
            
            {/* Header */}
            <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} color="#5b5fcf" />
                <div>
                  <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#5b5fcf', marginBottom: '0.1rem' }}>Weekly Schedule</h2>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Set your regular working hours, breaks and availability for each day.</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToAllDays('Monday')} style={{ color: '#5b5fcf', borderColor: '#e0e7ff', fontSize: '0.8rem' }}>
                <Copy size={14} style={{ marginRight: '0.25rem' }} /> Copy Monday to all
              </Button>
            </div>

            {/* Days List */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {Object.entries(schedule).map(([day, data]) => {
                const breaks = getBreaks(data.slots);
                
                return (
                <div key={day} style={{ display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: '1.5rem', padding: '1.5rem 2rem', borderBottom: '1px solid #f3f4f6', backgroundColor: data.active ? 'white' : '#fcfcfc', transition: 'all 0.3s' }}>
                  
                  {/* Day Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', alignSelf: 'flex-start', marginTop: '0.25rem' }}>
                    <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                      <input type="checkbox" checked={data.active} onChange={() => toggleDay(day)} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: data.active ? '#5b5fcf' : '#d1d5db', borderRadius: '24px', transition: '.3s' }}>
                        <span style={{ position: 'absolute', height: '14px', width: '14px', left: data.active ? '18px' : '3px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '.3s', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}></span>
                      </span>
                    </label>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: data.active ? '#1f2937' : '#9ca3af' }}>{day.slice(0,3)}</span>
                  </div>

                  {/* Hours & Breaks */}
                  {data.active ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                      {/* Working Hours */}
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.75rem', display: 'block' }}>Working Hours</span>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'wrap' }}>
                          {data.slots.map((slot, i) => (
                            <div key={`w-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ position: 'relative' }}>
                                <Clock size={14} color="#9ca3af" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                                <select 
                                  value={slot.start} onChange={(e) => updateSlotTime(day, i, 'start', e.target.value)}
                                  style={{ padding: '0.4rem 0.5rem 0.4rem 1.75rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#374151', outline: 'none', backgroundColor: 'white', minWidth: '100px' }}
                                >
                                  {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                              </div>
                              <span style={{ color: '#d1d5db' }}>-</span>
                              <div style={{ position: 'relative' }}>
                                <Clock size={14} color="#9ca3af" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)' }} />
                                <select 
                                  value={slot.end} onChange={(e) => updateSlotTime(day, i, 'end', e.target.value)}
                                  style={{ padding: '0.4rem 0.5rem 0.4rem 1.75rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#374151', outline: 'none', backgroundColor: 'white', minWidth: '100px' }}
                                >
                                  {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Breaks */}
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.75rem', display: 'block' }}>Breaks</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                          {breaks.map((b, i) => (
                            <div key={`b-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.5rem', backgroundColor: '#fef3c7', border: 'none', borderRadius: '6px', fontSize: '0.85rem', color: '#92400e', fontWeight: 500 }}>
                              {b.start} - {b.end}
                              <button onClick={() => removeBreak(day, b.index)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', padding: '0 2px' }}>
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                          {breaks.length === 0 && (
                            <button onClick={() => addBreak(day)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.75rem', backgroundColor: 'white', border: '1px dashed #e5e7eb', borderRadius: '6px', fontSize: '0.85rem', color: '#6b7280', fontWeight: 500, cursor: 'pointer' }}>
                              <Plus size={14} /> Add Break
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{ color: '#9ca3af', fontWeight: 500, fontSize: '0.85rem' }}>Unavailable</span>
                      <span style={{ color: '#d1d5db', fontSize: '0.75rem' }}>Not available for appointments</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ alignSelf: 'flex-start', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af' }}>
                    <ChevronDown size={18} style={{ cursor: 'pointer' }} />
                    <MoreVertical size={18} style={{ cursor: 'pointer' }} />
                  </div>

                </div>
              )})}
            </div>

            {/* Add Custom Date */}
            <div style={{ padding: '1.5rem 2rem', backgroundColor: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', border: '2px dashed #e0e7ff', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#f8fafc' }} className="hover-scale">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#5b5fcf', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Plus size={16}/> Add Custom Date</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Block specific dates when you won't be available (holidays, events, etc.)</span>
                </div>
                <ChevronRight size={20} color="#9ca3af" />
              </div>
            </div>
          </Card>

          {/* Settings Row (4 cards) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <Card style={{ padding: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1f2937', marginBottom: '0.25rem' }}>
                <Clock size={16} color="#5b5fcf" /> <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Buffer Time</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.75rem' }}>Time between appointments</p>
              <select value={settings.buffer} onChange={e => setSettings({...settings, buffer: e.target.value})} style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#374151', outline: 'none' }}>
                <option>0 mins</option><option>15 mins</option><option>30 mins</option>
              </select>
            </Card>

            <Card style={{ padding: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1f2937', marginBottom: '0.25rem' }}>
                <CalendarIcon size={16} color="#5b5fcf" /> <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Max Appointments</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.75rem' }}>Maximum patients per day</p>
              <select value={settings.maxAppts} onChange={e => setSettings({...settings, maxAppts: e.target.value})} style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#374151', outline: 'none' }}>
                <option>5</option><option>8</option><option>10</option><option>12</option>
              </select>
            </Card>

            <Card style={{ padding: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1f2937', marginBottom: '0.25rem' }}>
                <Info size={16} color="#5b5fcf" /> <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Minimum Notice</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.75rem' }}>Minimum notice for booking</p>
              <select value={settings.minNotice} onChange={e => setSettings({...settings, minNotice: e.target.value})} style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#374151', outline: 'none' }}>
                <option>1 hour</option><option>2 hours</option><option>12 hours</option><option>24 hours</option>
              </select>
            </Card>

            <Card style={{ padding: '1rem', border: '1px solid #f3f4f6', boxShadow: '0 4px 10px rgba(0,0,0,0.02)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1f2937', marginBottom: '0.25rem' }}>
                <LayoutList size={16} color="#5b5fcf" /> <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Slot Interval</span>
              </div>
              <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.75rem' }}>Time slot interval</p>
              <select value={settings.interval} onChange={e => setSettings({...settings, interval: e.target.value})} style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '0.85rem', color: '#374151', outline: 'none' }}>
                <option>15 mins</option><option>30 mins</option><option>60 mins</option>
              </select>
            </Card>
          </div>
        </div>

        {/* Right Column: Today's Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Today's Availability Timeline */}
          <Card style={{ padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: 'none', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <CalendarIcon size={18} color="#5b5fcf" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#5b5fcf' }}>Today's Availability Timeline</h3>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <button style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '2px', cursor: 'pointer', color: '#6b7280' }}><ChevronLeft size={16} /></button>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1f2937' }}>{todayDateString}</span>
              <button style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '2px', cursor: 'pointer', color: '#6b7280' }}><ChevronRight size={16} /></button>
            </div>

            {/* Timeline UI */}
            <div style={{ width: '100%', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5563', fontSize: '0.65rem', fontWeight: 600, marginBottom: '0.5rem', padding: '0 2px' }}>
                <span>09 AM</span><span>11 AM</span><span>01 PM</span><span>03 PM</span><span>05 PM</span>
              </div>
              <div style={{ width: '100%', height: '16px', display: 'flex', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#e5e7eb' }}>
                {(() => {
                   if (!schedule[dayOfWeek]?.active) return <div style={{ flex: 1, backgroundColor: '#d1d5db' }}></div>;
                   const hours = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
                   return hours.map((time, idx) => {
                     const isAppt = todayAppointments.some(a => a.time === time || a.time.startsWith(time.split(':')[0]));
                     const isAvail = availableSlots.some(s => s.time === time && s.available);
                     let bgColor = '#fde047'; 
                     if (isAppt) bgColor = '#fecaca';
                     else if (isAvail) bgColor = '#bbf7d0';
                     return <div key={idx} style={{ flex: 1, backgroundColor: bgColor, borderRight: '1px solid white' }}></div>;
                   });
                })()}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', fontSize: '0.7rem', color: '#6b7280', fontWeight: 500, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span> Available</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span> Appointment</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d1d5db' }}></span> Unavailable</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#fde047' }}></span> Other</span>
            </div>
          </Card>

          {/* Today's Summary & Appointments */}
          <Card style={{ padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: 'none', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <LayoutList size={18} color="#6b7280" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937' }}>Today's Summary</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.4rem', backgroundColor: '#ecfdf5', borderRadius: '6px' }}><Clock size={14} color="#059669" /></div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Working Hours</span>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>
                  {schedule[dayOfWeek]?.active && schedule[dayOfWeek].slots.length > 0
                    ? `${schedule[dayOfWeek].slots[0].start} - ${schedule[dayOfWeek].slots[schedule[dayOfWeek].slots.length - 1].end}`
                    : 'Unavailable'}
                </span>
              </div>

              {schedule[dayOfWeek]?.active && getBreaks(schedule[dayOfWeek].slots).map((b, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ padding: '0.4rem', backgroundColor: '#fef3c7', borderRadius: '6px' }}><span style={{fontSize: '0.8rem'}}>🍴</span></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Break</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 500 }}>{b.start} - {b.end}</span>
                </div>
              ))}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ padding: '0.4rem', backgroundColor: '#fee2e2', borderRadius: '6px' }}><CalendarIcon size={14} color="#dc2626" /></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Appointments</span>
                    <span style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>{todayAppointments.length}</span>
                  </div>
                  <a href="/therapist/appointments" style={{ fontSize: '0.75rem', color: '#5b5fcf', textDecoration: 'none', fontWeight: 500 }}>View all</a>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {todayAppointments.length > 0 ? todayAppointments.map((appt, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                          {appt.patientName ? appt.patientName.substring(0, 2).toUpperCase() : 'PT'}
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1f2937' }}>{appt.patientName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{appt.time}</span>
                        <span style={{ padding: '0.2rem 0.5rem', backgroundColor: '#fecaca', color: '#b91c1c', fontSize: '0.65rem', borderRadius: '4px', fontWeight: 600 }}>{appt.status}</span>
                      </div>
                    </div>
                  )) : (
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', textAlign: 'center', padding: '1rem 0' }}>No appointments today.</div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Available Slots */}
          <Card style={{ padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: 'none', borderRadius: '12px', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1f2937' }}>Available Slots</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {availableSlots.filter(s => s.available).length > 0 ? (
                availableSlots.filter(s => s.available).map((slot, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>{slot.time}</span>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', fontSize: '0.85rem', color: '#6b7280', textAlign: 'center' }}>No available slots today.</div>
              )}
            </div>
          </Card>

          {/* Info Box */}
          <div style={{ padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
              <span style={{ fontSize: '0.8rem' }}>💡</span>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#5b5fcf', marginBottom: '0.25rem' }}>Tip</h4>
              <p style={{ fontSize: '0.8rem', color: '#5b5fcf', lineHeight: 1.5 }}>Your availability slots will be shown to patients based on your working hours and settings.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TherapistAvailability;
