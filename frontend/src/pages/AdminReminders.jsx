import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AdminReminders = () => {
  const [patient, setPatient] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const sendReminder = () => {
    if (!patient || !message) return;

    setSuccess(true);

    setPatient('');
    setMessage('');

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div
      style={{
        maxWidth: '700px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}
    >
      <div>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 'bold'
          }}
        >
          Send Reminder
        </h1>

        <p style={{ color: 'var(--text-secondary)' }}>
          Send appointment reminders to patients.
        </p>
      </div>

      <Card style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <input
            className="input-field"
            placeholder="Patient Name"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
          />

          <textarea
            className="input-field"
            rows="5"
            placeholder="Reminder Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button onClick={sendReminder}>
            Send Reminder
          </Button>

          {success && (
            <p
              style={{
                color: 'var(--success)',
                fontWeight: 600
              }}
            >
              Reminder sent successfully!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminReminders;