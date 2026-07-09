import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { leaveApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLeaves = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null); // { text, type: 'success' | 'error' }

  // Load all leave requests
  useEffect(() => {
    leaveApi
      .getAll()
      .then((res) => {
        setLeaveRequests(res);
      })
      .catch((err) => {
        console.error('Failed to fetch leaves', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLeaveAction = async (id, action) => {
    setMessage(null);
    try {
      const updated = await leaveApi.updateStatus(id, action);
      setLeaveRequests((prev) => prev.map((req) => (req.id === id ? updated : req)));
      
      setMessage({
        text: `Leave request for ${updated.therapistName} has been ${action.toLowerCase()}!`,
        type: action === 'Approved' ? 'success' : 'error'
      });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ text: err.message || 'Failed to update leave status.', type: 'error' });
      setTimeout(() => setMessage(null), 5000);
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Leave Requests Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review and approve time off for therapists.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Card className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Pending Leave Requests</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Loading leave requests...
              </div>
            ) : leaveRequests.filter(req => req.status === 'Pending').length > 0 ? (
              leaveRequests.filter(req => req.status === 'Pending').map(req => (
                <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderLeft: '4px solid var(--warning)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{req.therapistName}</h4>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {req.startDate} to {req.endDate} • {req.reason || 'No reason provided'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleLeaveAction(req.id, 'Approved')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--success-bg)', color: 'var(--success)', cursor: 'pointer', transition: 'transform 0.2s' }} className="hover-scale" title="Approve">
                      <CheckCircle size={20} />
                    </button>
                    <button onClick={() => handleLeaveAction(req.id, 'Rejected')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--error-bg)', color: 'var(--error)', cursor: 'pointer', transition: 'transform 0.2s' }} className="hover-scale" title="Reject">
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                No pending leave requests.
              </div>
            )}
          </div>
        </Card>

        <Card className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Leave Request History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Loading leave requests...
              </div>
            ) : leaveRequests.filter(req => req.status !== 'Pending').length > 0 ? (
              leaveRequests.filter(req => req.status !== 'Pending').map(req => (
                <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderLeft: `4px solid ${req.status === 'Approved' ? 'var(--success)' : 'var(--error)'}`, borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{req.therapistName}</h4>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      {req.startDate} to {req.endDate} • {req.reason || 'No reason provided'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: req.status === 'Approved' ? 'var(--success)' : 'var(--error)' }}>
                    {req.status === 'Approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {req.status}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                No history found.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLeaves;
