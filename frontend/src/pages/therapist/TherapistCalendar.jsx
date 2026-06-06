import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const TherapistCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // June 2026
  
  const daysInMonth = 30; // June has 30 days
  const firstDay = 1; // June 1st is Monday (Mocked for simplicity: Mon=1, Sun=0)
  
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  // Mock data for calendar dots
  const getDayStatus = (day) => {
    if (day === 6) return 'leave';
    if (day % 4 === 0) return 'busy';
    if (day % 3 === 0) return 'available';
    return 'mixed';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            Schedule Calendar
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your monthly and weekly schedules.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select className="input-field" style={{ width: 'auto' }}>
             <option>Month View</option>
             <option>Week View</option>
             <option>Day View</option>
          </select>
          <Button variant="outline"><Filter size={18} style={{ marginRight: '0.5rem' }}/> Filter</Button>
        </div>
      </div>

      <Card className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
             {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
           </h2>
           <div style={{ display: 'flex', gap: '0.5rem' }}>
             <Button variant="outline" onClick={prevMonth}><ChevronLeft size={20} /></Button>
             <Button variant="outline">Today</Button>
             <Button variant="outline" onClick={nextMonth}><ChevronRight size={20} /></Button>
           </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
             <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span> Confirmed
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
             <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span> Available
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
             <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></span> Leave
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, backgroundColor: 'var(--bg-main)' }}>
              {day}
            </div>
          ))}
          
          {/* Empty cells for first day offset */}
          {Array.from({ length: firstDay - 1 }).map((_, i) => (
             <div key={`empty-${i}`} style={{ backgroundColor: 'var(--bg-surface)', minHeight: '100px', opacity: 0.5 }}></div>
          ))}
          
          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
             const day = i + 1;
             const status = getDayStatus(day);
             
             return (
               <div key={day} className="hover-bg-main" style={{ backgroundColor: 'var(--bg-surface)', minHeight: '120px', padding: '0.75rem', display: 'flex', flexDirection: 'column', transition: 'background-color 0.2s', cursor: 'pointer' }}>
                 <span style={{ fontWeight: 500, color: day === 6 ? 'var(--primary)' : 'var(--text-primary)', marginBottom: '0.5rem', display: 'inline-block', width: '28px', height: '28px', lineHeight: '28px', textAlign: 'center', borderRadius: '50%', backgroundColor: day === 6 ? 'var(--secondary)' : 'transparent' }}>
                   {day}
                 </span>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: 'auto' }}>
                   {status === 'leave' && <span className="slot-leave" style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>Day Off</span>}
                   {status === 'busy' && <span className="slot-confirmed" style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>4 Appts</span>}
                   {status === 'available' && <span className="slot-available" style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>2 Slots</span>}
                   {status === 'mixed' && (
                     <>
                       <span className="slot-confirmed" style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>2 Appts</span>
                       <span className="slot-available" style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>1 Slot</span>
                     </>
                   )}
                 </div>
               </div>
             )
          })}
        </div>
      </Card>
    </div>
  );
};

export default TherapistCalendar;
