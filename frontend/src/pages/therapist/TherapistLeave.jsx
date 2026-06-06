import React, { useState } from 'react';
import { Calendar as CalendarIcon, FileText, CheckCircle, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const TherapistLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, startDate: '2026-06-10', endDate: '2026-06-12', reason: 'Personal Leave', status: 'Approved' },
    { id: 2, startDate: '2026-07-01', endDate: '2026-07-05', reason: 'Conference', status: 'Pending' }
  ]);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    
    const newReq = {
      id: Date.now(),
      startDate,
      endDate,
      reason,
      status: 'Pending'
    };
    
    setLeaveRequests([newReq, ...leaveRequests]);
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
          Leave Requests
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your days off and track approvals.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <Card className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Request Time Off</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Start Date</label>
              <input type="date" className="input-field" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>End Date</label>
              <input type="date" className="input-field" value={endDate} onChange={e => setEndDate(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Reason (Optional)</label>
              <textarea className="input-field" style={{ minHeight: '80px', resize: 'vertical' }} value={reason} onChange={e => setReason(e.target.value)} placeholder="E.g., Personal, Sick leave, Conference..."></textarea>
            </div>
            <Button type="submit" className="w-full mt-2">Submit Request</Button>
          </form>
        </Card>

        <Card className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Request History</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {leaveRequests.length > 0 ? leaveRequests.map((req) => (
              <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${req.status === 'Approved' ? 'var(--success)' : req.status === 'Pending' ? 'var(--warning)' : 'var(--error)'}` }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                    {req.startDate} to {req.endDate}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {req.reason || 'No reason provided'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: req.status === 'Approved' ? 'var(--success)' : 'var(--warning)' }}>
                  {req.status === 'Approved' ? <CheckCircle size={16} /> : <Clock size={16} />}
                  {req.status}
                </div>
              </div>
            )) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                No leave requests found.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TherapistLeave;
