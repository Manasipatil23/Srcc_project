import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit, XCircle, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { appointmentApi } from '../../services/api';
import Modal from '../../components/ui/Modal';

const TherapistAppointments = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedApt, setSelectedApt] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    appointmentApi
      .getAll()
      .then((data) =>
        setAppointments(data.filter((a) => a.therapistName === user?.name))
      )
      .catch(() => setAppointments([]))
      .finally(() => setIsLoading(false));
  }, [user?.name]);

  const filtered = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || apt.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAction = (apt, action) => {
    setSelectedApt(apt);
    if (action === 'details') setIsDetailsModalOpen(true);
    if (action === 'notes') setIsNotesModalOpen(true);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            Appointments
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your patient sessions and notes.</p>
        </div>
      </div>

      <Card className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="input-field" 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="input-field" style={{ width: '200px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Patient Name</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                    Loading appointments...
                  </td>
                </tr>
              ) : filtered.length > 0 ? filtered.map((apt) => (
                <tr key={apt.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-bg-main">
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>{apt.patientName}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div style={{ fontSize: '0.875rem' }}>{apt.date}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{apt.time}</div>
                  </td>
                  <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{apt.type}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      backgroundColor: apt.status === 'Upcoming' ? 'var(--primary)' : apt.status === 'Completed' ? 'var(--success)' : 'var(--error)',
                      color: 'white'
                    }}>
                      {apt.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="ghost" size="sm" onClick={() => handleAction(apt, 'details')}>Details</Button>
                      <Button variant="outline" size="sm" onClick={() => handleAction(apt, 'notes')}><FileText size={16} /></Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title="Appointment Details">
        {selectedApt && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Patient:</span>
              <span style={{ fontWeight: 500 }}>{selectedApt.patientName}</span>
              
              <span style={{ color: 'var(--text-secondary)' }}>Date:</span>
              <span>{selectedApt.date}</span>
              
              <span style={{ color: 'var(--text-secondary)' }}>Time:</span>
              <span>{selectedApt.time}</span>
              
              <span style={{ color: 'var(--text-secondary)' }}>Type:</span>
              <span>{selectedApt.type}</span>
              
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <span style={{ fontWeight: 600, color: selectedApt.status === 'Upcoming' ? 'var(--primary)' : 'var(--text-primary)' }}>{selectedApt.status}</span>
            </div>
            
            {selectedApt.status === 'Upcoming' && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <Button variant="outline" style={{ flex: 1 }}><Edit size={16} style={{ marginRight: '0.5rem' }}/> Reschedule</Button>
                <Button style={{ flex: 1, backgroundColor: 'var(--error-bg)', color: 'var(--error)', border: 'none' }}><XCircle size={16} style={{ marginRight: '0.5rem' }}/> Cancel</Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={isNotesModalOpen} onClose={() => setIsNotesModalOpen(false)} title="Session Notes">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Notes for {selectedApt?.patientName} - {selectedApt?.date}</p>
          <textarea 
            className="input-field" 
            style={{ minHeight: '150px', resize: 'vertical' }} 
            placeholder="Add clinical notes, observations, and next steps..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Button variant="outline" onClick={() => setIsNotesModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsNotesModalOpen(false)}>Save Notes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TherapistAppointments;
