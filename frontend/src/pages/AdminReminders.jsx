import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { patientApi, notificationApi } from '../services/api';
import { Search, Bell, Mail, Send, CheckSquare, Square, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminReminders = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendInApp, setSendInApp] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    patientApi.getAll()
      .then(res => setPatients(res || []))
      .catch(err => console.error('Failed to load patients', err));
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.email && p.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectAll = () => {
    if (selectedIds.length === filteredPatients.length && filteredPatients.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPatients.map(p => p.id || p._id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const sendReminder = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one patient.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter a reminder message.');
      return;
    }
    if (!sendEmail && !sendInApp) {
      setError('Please select at least one delivery method (Email or In-App).');
      return;
    }

    setError('');
    setIsLoading(true);
    setResults(null);

    try {
      const res = await notificationApi.sendReminders({
        patientIds: selectedIds,
        message,
        sendEmail,
        sendInApp
      });
      setResults(res.data);
      setSelectedIds([]);
      setMessage('');
    } catch (err) {
      setError(err.message || 'Failed to send reminders.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Send Reminders</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Broadcast appointment reminders and updates to patients via Email or In-App notifications.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Patient Selection */}
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Select Patients</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-main)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
              {selectedIds.length} Selected
            </span>
          </div>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search patients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem', backgroundColor: 'var(--bg-main)', border: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <button 
              onClick={handleSelectAll}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}
            >
              {selectedIds.length === filteredPatients.length && filteredPatients.length > 0 ? (
                <CheckSquare size={18} color="var(--primary)" />
              ) : (
                <Square size={18} color="var(--text-light)" />
              )}
              Select All Filtered
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', marginTop: '0.5rem' }} className="custom-scrollbar">
            {filteredPatients.length > 0 ? filteredPatients.map(patient => {
              const id = patient.id || patient._id;
              const isSelected = selectedIds.includes(id);
              return (
                <div 
                  key={id}
                  onClick={() => toggleSelect(id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: isSelected ? 'var(--secondary)' : 'transparent', transition: 'all 0.2s' }}
                  className="hover-bg-surface"
                >
                  {isSelected ? <CheckSquare size={18} color="var(--primary)" /> : <Square size={18} color="var(--text-light)" />}
                  <div>
                    <p style={{ fontWeight: 500, fontSize: '0.9rem', color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>{patient.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{patient.email}</p>
                  </div>
                </div>
              );
            }) : (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem', fontSize: '0.9rem' }}>No patients found.</p>
            )}
          </div>
        </Card>

        {/* Right Column: Message & Delivery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <Card style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Compose Message</h2>
            <textarea
              className="input-field"
              rows="6"
              placeholder="E.g. This is a reminder for your upcoming session..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ backgroundColor: 'var(--bg-main)', border: 'none', resize: 'none' }}
            />
          </Card>

          <Card style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Delivery Methods</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.4rem', backgroundColor: '#e0e7ff', borderRadius: '6px' }}><Mail size={16} color="#4f46e5" /></div>
                  <span style={{ fontWeight: 500 }}>Email Notification</span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={sendInApp} onChange={(e) => setSendInApp(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ padding: '0.4rem', backgroundColor: '#fce7f3', borderRadius: '6px' }}><Bell size={16} color="#db2777" /></div>
                  <span style={{ fontWeight: 500 }}>In-App Notification</span>
                </div>
              </label>
            </div>

            {error && (
              <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <Button onClick={sendReminder} disabled={isLoading} style={{ width: '100%', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} size="lg">
              {isLoading ? 'Sending...' : 'Send Reminders'} <Send size={18} />
            </Button>
          </Card>

        </div>
      </div>

      {/* Results Modal/Section */}
      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <CheckCircle size={24} color="var(--success)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Delivery Report</h2>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {results.map((res, i) => (
                  <div key={i} style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{res.name}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Email:</span> 
                        {res.emailSuccess ? <span style={{ color: 'var(--success)', fontWeight: 500 }}>Sent</span> : <span style={{ color: 'var(--error)', fontWeight: 500 }}>Failed</span>}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>In-App:</span> 
                        {res.inAppSuccess ? <span style={{ color: 'var(--success)', fontWeight: 500 }}>Delivered</span> : <span style={{ color: 'var(--error)', fontWeight: 500 }}>Failed</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminReminders;