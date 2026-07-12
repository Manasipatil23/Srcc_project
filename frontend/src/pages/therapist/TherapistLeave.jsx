import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, FileText, CheckCircle, Clock, AlertCircle, XCircle, Edit2, X } from 'lucide-react';
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

  const [editingLeave, setEditingLeave] = useState(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editJustification, setEditJustification] = useState('');
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

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

  const isEditable = (req) => {
    const baseDate = req.approvedAt || req.createdAt;
    if (!baseDate) return false;
    const hoursSince = (new Date() - new Date(baseDate)) / (1000 * 60 * 60);
    return hoursSince <= 48 && (req.status === 'Approved' || req.status === 'Pending');
  };

  const handleEditClick = (req) => {
    setEditingLeave(req);
    setEditStartDate(req.startDate);
    setEditEndDate(req.endDate);
    setEditReason(req.reason || '');
    setEditJustification('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editStartDate || !editEndDate || !editJustification || !editingLeave) return;

    setIsEditSubmitting(true);
    setMessage(null);

    try {
      const res = await leaveApi.edit(editingLeave.id, {
        startDate: editStartDate,
        endDate: editEndDate,
        reason: editReason,
        editReason: editJustification
      });

      setLeaveRequests(prev => prev.map(r => r.id === editingLeave.id ? res : r));
      setEditingLeave(null);
      setMessage({ text: 'Edit request submitted for re-approval!', type: 'success' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ text: err.message || 'Failed to submit edit.', type: 'error' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsEditSubmitting(false);
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
              <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${req.status === 'Approved' ? 'var(--success)' : req.status === 'Rejected' ? 'var(--error)' : 'var(--warning)'}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                    {req.startDate} to {req.endDate}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {req.reason || 'No reason provided'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: req.status === 'Approved' ? 'var(--success)' : req.status === 'Rejected' ? 'var(--error)' : 'var(--warning)' }}>
                    {req.status === 'Approved' ? <CheckCircle size={16} /> : req.status === 'Rejected' ? <XCircle size={16} /> : <Clock size={16} />}
                    {req.status}
                  </div>
                  
                  {isEditable(req) ? (
                     <button onClick={() => handleEditClick(req)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }} className="hover-scale">
                       <Edit2 size={14} /> Edit
                     </button>
                  ) : (req.status === 'Approved' || req.status === 'Pending') && (
                     <span title="This leave request can no longer be edited. Please contact the administrator if further changes are required." style={{ fontSize: '0.75rem', color: 'var(--text-light)', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                       <Edit2 size={14} style={{ opacity: 0.5 }} /> Edit Expired
                     </span>
                  )}
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

      {/* Edit Modal */}
      <AnimatePresence>
        {editingLeave && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <Card className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Edit Leave Request</h3>
                  <button onClick={() => setEditingLeave(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Start Date</label>
                      <input type="date" className="input-field" value={editStartDate} onChange={e => setEditStartDate(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>End Date</label>
                      <input type="date" className="input-field" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} required />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Reason for Leave</label>
                    <textarea className="input-field" style={{ minHeight: '60px', resize: 'vertical' }} value={editReason} onChange={e => setEditReason(e.target.value)}></textarea>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Reason for Editing <span style={{ color: 'var(--error)' }}>*</span></label>
                    <textarea className="input-field" style={{ minHeight: '80px', resize: 'vertical', borderColor: 'var(--primary)' }} value={editJustification} onChange={e => setEditJustification(e.target.value)} placeholder="Why are you changing this request?" required></textarea>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>A valid reason must be provided for admin re-approval.</p>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <Button type="button" variant="outline" onClick={() => setEditingLeave(null)} style={{ flex: 1 }}>Cancel</Button>
                    <Button type="submit" disabled={isEditSubmitting} style={{ flex: 1 }}>
                      {isEditSubmitting ? 'Submitting...' : 'Submit Edit'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TherapistLeave;
