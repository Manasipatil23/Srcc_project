import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Clock, User, Calendar as CalendarIcon, Filter } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const DynamicCalendar = ({ title, description, appointments = [], leaves = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // getDay() is 0 for Sunday, 1 for Monday.
  const firstDay = new Date(year, month, 1).getDay(); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const getDayInfo = (day) => {
    const pad = (n) => n.toString().padStart(2, '0');
    const dateString = `${year}-${pad(month + 1)}-${pad(day)}`;

    const dayLeaves = leaves.filter(l => dateString >= l.startDate && dateString <= l.endDate);
    const dayAppointments = appointments.filter(a => a.date === dateString && a.status !== 'Cancelled');
    
    const isApprovedLeave = dayLeaves.some(l => l.status === 'Approved');
    const isPendingLeave = dayLeaves.some(l => l.status === 'Pending');

    return {
      dateString,
      appointments: dayAppointments,
      leaves: dayLeaves,
      isApprovedLeave,
      isPendingLeave,
      apptsCount: dayAppointments.length
    };
  };

  const renderSelectedDetails = () => {
    if (!selectedDate) return null;

    const [y, m, d] = selectedDate.split('-');
    const dayInfo = getDayInfo(parseInt(d, 10)); // Requires accurate month/year which it relies on state for now.
    // Wait, selectedDate might be from a different month if we navigate, but we can just use the dateString exactly.
    // Actually, safer to filter directly by selectedDate.
    
    const dayAppointments = appointments.filter(a => a.date === selectedDate);
    const dayLeaves = leaves.filter(l => selectedDate >= l.startDate && selectedDate <= l.endDate);

    const dateDisplay = new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return (
      <Card style={{ width: '350px', display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid var(--border)' }} className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{dateDisplay}</h3>
          <button onClick={() => setSelectedDate(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }} className="no-scrollbar">
          {/* Leaves Section */}
          {dayLeaves.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Leaves</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dayLeaves.map(leave => (
                  <div key={leave.id} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: leave.status === 'Approved' ? 'var(--primary-light)' : 'var(--warning-light)', borderLeft: `4px solid ${leave.status === 'Approved' ? 'var(--primary)' : 'var(--warning)'}` }}>
                    <p style={{ fontWeight: 600 }}>{leave.therapistName}</p>
                    <p style={{ fontSize: '0.875rem' }}>{leave.reason}</p>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: leave.status === 'Approved' ? 'var(--primary)' : 'var(--warning)', marginTop: '0.25rem', display: 'inline-block' }}>{leave.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appointments Section */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Appointments ({dayAppointments.length})</h4>
            {dayAppointments.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontSize: '0.875rem', fontStyle: 'italic' }}>No appointments scheduled.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dayAppointments.map(apt => (
                  <div key={apt.id} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{apt.time}</p>
                      <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: apt.status === 'Cancelled' ? 'var(--error-bg)' : 'var(--success-bg)', color: apt.status === 'Cancelled' ? 'var(--error)' : 'var(--success)', fontWeight: 600 }}>
                        {apt.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <User size={14} color="var(--primary)" /> {apt.patientName}
                    </p>
                    <p style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <CalendarIcon size={14} /> Therapist: {apt.therapistName}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="outline"><Filter size={18} style={{ marginRight: '0.5rem' }}/> Filter</Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <Card className="glass-panel" style={{ flex: 1, padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {currentDate.toLocaleString('default', { month: 'long' })} {year}
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="outline" onClick={prevMonth}><ChevronLeft size={20} /></Button>
              <Button variant="outline" onClick={goToday}>Today</Button>
              <Button variant="outline" onClick={nextMonth}><ChevronRight size={20} /></Button>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--error)' }}></span> Booked
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span> Approved Leave
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--warning)' }}></span> Pending Leave
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, backgroundColor: 'var(--bg-main)' }}>{day}</div>
            ))}
            
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} style={{ backgroundColor: 'var(--bg-surface)', minHeight: '100px', opacity: 0.3 }}></div>
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const { dateString, apptsCount, isApprovedLeave, isPendingLeave } = getDayInfo(day);
              const isSelected = selectedDate === dateString;
              const isToday = new Date().toISOString().split('T')[0] === dateString;
              
              return (
                <div 
                  key={day} 
                  onClick={() => setSelectedDate(dateString)}
                  className="hover-bg-main" 
                  style={{ 
                    backgroundColor: isSelected ? 'var(--secondary)' : 'var(--bg-surface)', 
                    minHeight: '100px', 
                    padding: '0.75rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? 'inset 0 0 0 2px var(--primary)' : 'none'
                  }}
                >
                  <span style={{ 
                    fontWeight: 600, 
                    color: isToday ? 'white' : 'var(--text-primary)', 
                    marginBottom: '0.5rem', 
                    display: 'inline-block', 
                    width: '28px', 
                    height: '28px', 
                    lineHeight: '28px', 
                    textAlign: 'center', 
                    borderRadius: '50%', 
                    backgroundColor: isToday ? 'var(--primary)' : 'transparent' 
                  }}>
                    {day}
                  </span>
                  
                  {/* Clean Dot Indicators */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: 'auto' }}>
                    {isApprovedLeave && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} title="Approved Leave"></span>}
                    {isPendingLeave && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--warning)' }} title="Pending Leave"></span>}
                    {apptsCount > 0 && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--error)' }} title={`${apptsCount} Appointments`}></span>}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {renderSelectedDetails()}
      </div>
    </div>
  );
};

export default DynamicCalendar;
