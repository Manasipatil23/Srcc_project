import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, FileText, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { therapistApi, leaveApi } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const TherapistLeave = () => {
  const { user } = useAuth();
  const [therapistId, setTherapistId] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { text, type: 'success' | 'error' }

  // Resolve therapistId from logged in user
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

  // Load leave requests once therapistId is resolved
  useEffect(() => {
    if (!therapistId) return;
    setIsLoading(true);
    leaveApi
      .getForTherapist(therapistId)
      .then((res) => {
        setLeaveRequests(res);
      })
      .catch((err) => {
        console.error('Failed to load leave history', err);
      })
      .finally(() => setIsLoading(false));
  }, [therapistId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !therapistId) return;

    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const res = await leaveApi.create({
        therapistId,
        startDate,
        endDate,
        reason,
      });
      
      setLeaveRequests((prev) => [res, ...prev]);
      setStartDate('');
      setEndDate('');
      setReason('');
      setMessage({ text: 'Leave request submitted successfully!', type: 'success' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ text: err.message || 'Failed to submit leave request.', type: 'error' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
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
            <Button type="submit" disabled={isSubmitting || !therapistId} className="w-full mt-2">
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </Card>

        <Card className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Request History</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>Loading requests...</div>
            ) : leaveRequests.length > 0 ? leaveRequests.map((req) => (
              <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${req.status === 'Approved' ? 'var(--success)' : req.status === 'Pending' ? 'var(--warning)' : 'var(--error)'}` }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                    {req.startDate} to {req.endDate}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {req.reason || 'No reason provided'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: req.status === 'Approved' ? 'var(--success)' : req.status === 'Pending' ? 'var(--warning)' : 'var(--error)' }}>
                  {req.status === 'Approved' ? <CheckCircle size={16} /> : req.status === 'Pending' ? <Clock size={16} /> : <AlertCircle size={16} />}
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
