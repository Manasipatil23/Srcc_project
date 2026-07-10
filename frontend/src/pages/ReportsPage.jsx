import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Download, FileBarChart2, CalendarRange } from 'lucide-react';
import { reportApi } from '../services/api';

const REPORTS = [
  { key: 'appointments', title: 'Appointments Report', description: 'All sessions with patient, therapist, service type and status.' },
  { key: 'payments', title: 'Payments / Collections Report', description: 'Receipt-wise register of fees collected, pending, refunded and waived.' },
  { key: 'therapist-utilization', title: 'Therapist Utilization Report', description: 'Sessions handled per therapist with completion and cancellation counts.' },
];

const ReportsPage = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const range = () => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    return params;
  };

  const loadSummary = async () => {
    try {
      setSummary(await reportApi.getSummary(range()));
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load summary');
    }
  };

  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Reports</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Extract data and download reports for accounting and administration.</p>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)', border: '1px solid var(--error)' }}>
          {error}
        </div>
      )}

      <Card className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>From</label>
            <input type="date" className="input-field" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>To</label>
            <input type="date" className="input-field" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <Button onClick={loadSummary} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarRange size={18} /> Apply Range
          </Button>
        </div>
      </Card>

      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <Card style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Appointments</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{summary.appointments.total}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
              {Object.entries(summary.appointments.byStatus).map(([s, n]) => `${s}: ${n}`).join(' • ') || 'No data'}
            </p>
          </Card>
          <Card style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Revenue Collected</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>₹{summary.payments.revenueCollected}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{summary.payments.total} payment records</p>
          </Card>
          <Card style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pending Dues</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--warning)' }}>₹{summary.payments.pendingAmount}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
              {Object.entries(summary.payments.byStatus).map(([s, n]) => `${s}: ${n}`).join(' • ') || 'No data'}
            </p>
          </Card>
          <Card style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Therapists</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{summary.therapists}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Across all specialties</p>
          </Card>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {REPORTS.map((report) => (
          <Card key={report.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary)', color: 'var(--primary)' }}>
                <FileBarChart2 size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 600 }}>{report.title}</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{report.description}</p>
              </div>
            </div>
            <a href={reportApi.csvUrl(report.key, range())} download>
              <Button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={18} /> Download CSV
              </Button>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
