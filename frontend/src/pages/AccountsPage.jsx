import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { IndianRupee, Clock, RotateCcw, HeartHandshake, Download, Receipt } from 'lucide-react';
import { paymentApi, reportApi } from '../services/api';

const STATUS_COLORS = {
  Paid: 'var(--success)',
  Pending: 'var(--warning)',
  Refunded: 'var(--error)',
  Waived: 'var(--primary)',
  Cancelled: 'var(--text-light)',
};

const AccountsPage = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [collecting, setCollecting] = useState(null); // payment id with mode picker open
  const [mode, setMode] = useState('Cash');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const [list, sum] = await Promise.all([paymentApi.getAll(), paymentApi.getSummary()]);
      setPayments(list);
      setSummary(sum);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load payments');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(
    () => (statusFilter === 'All' ? payments : payments.filter((p) => p.status === statusFilter)),
    [payments, statusFilter]
  );

  const handleCollect = async (id) => {
    try {
      await paymentApi.collect(id, mode);
      setCollecting(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRefund = async (id) => {
    if (!window.confirm('Mark this payment as refunded?')) return;
    try {
      await paymentApi.refund(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleWaive = async (id) => {
    if (!window.confirm('Waive this fee? Per SRCC policy, no child is refused treatment for want of money.')) return;
    try {
      await paymentApi.waive(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const summaryCards = summary
    ? [
        { label: 'Collected This Month', value: `₹${summary.collectedThisMonth.total}`, sub: `${summary.collectedThisMonth.count} payments`, icon: <IndianRupee size={22} />, color: 'var(--success)' },
        { label: 'Pending Dues', value: `₹${summary.pending.total}`, sub: `${summary.pending.count} payments`, icon: <Clock size={22} />, color: 'var(--warning)' },
        { label: 'Refunded', value: `₹${summary.refunded.total}`, sub: `${summary.refunded.count} payments`, icon: <RotateCcw size={22} />, color: 'var(--error)' },
        { label: 'Waived', value: `₹${summary.waived.total}`, sub: `${summary.waived.count} payments`, icon: <HeartHandshake size={22} />, color: 'var(--primary)' },
      ]
    : [];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Accounts</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Collect appointment fees, issue receipts and track dues.</p>
        </div>
        <a href={reportApi.csvUrl('payments')} download>
          <Button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Export CSV
          </Button>
        </a>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)', border: '1px solid var(--error)' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {summaryCards.map((card) => (
          <Card key={card.label} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', color: card.color }}>
              {card.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{card.label}</p>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{card.value}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{card.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Payment Register</h3>
          <select className="input-field" style={{ width: 'auto' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {['All', 'Pending', 'Paid', 'Refunded', 'Waived', 'Cancelled'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem' }}>Receipt No.</th>
                <th style={{ padding: '0.75rem' }}>Patient</th>
                <th style={{ padding: '0.75rem' }}>Therapist</th>
                <th style={{ padding: '0.75rem' }}>Date</th>
                <th style={{ padding: '0.75rem' }}>Amount</th>
                <th style={{ padding: '0.75rem' }}>Mode</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Receipt size={14} color="var(--text-light)" /> {p.receiptNumber || '—'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 500 }}>{p.patientName}</td>
                  <td style={{ padding: '0.75rem' }}>{p.therapistName}</td>
                  <td style={{ padding: '0.75rem' }}>{p.appointmentDate}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>₹{p.amount}</td>
                  <td style={{ padding: '0.75rem' }}>{p.mode || '—'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ color: STATUS_COLORS[p.status] || 'var(--text-primary)', fontWeight: 600 }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {p.status === 'Pending' && collecting !== p.id && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button onClick={() => setCollecting(p.id)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Collect</Button>
                        <Button variant="ghost" onClick={() => handleWaive(p.id)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Waive</Button>
                      </div>
                    )}
                    {p.status === 'Pending' && collecting === p.id && (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select className="input-field" style={{ width: 'auto', padding: '0.35rem' }} value={mode} onChange={(e) => setMode(e.target.value)}>
                          {['Cash', 'Card', 'UPI', 'Cheque'].map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        <Button onClick={() => handleCollect(p.id)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Confirm</Button>
                        <Button variant="ghost" onClick={() => setCollecting(null)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>Cancel</Button>
                      </div>
                    )}
                    {p.status === 'Paid' && (
                      <Button variant="ghost" onClick={() => handleRefund(p.id)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: 'var(--error)' }}>Refund</Button>
                    )}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                    No payments found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AccountsPage;
