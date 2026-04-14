import { useState, useEffect } from 'react';
import api from '../services/api';

export default function RecurringPayments({ accountId }) {
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({ destinationAccountNumber: '', amount: '', frequency: 'MONTHLY', startDate: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (accountId) {
      loadPayments();
    }
  }, [accountId]);

  const loadPayments = async () => {
    try {
      const res = await api.get(`/recurring/account/${accountId}`);
      setPayments(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/recurring', { ...formData, sourceAccountId: accountId });
      setMessage('Recurring payment scheduled!');
      setFormData({ destinationAccountNumber: '', amount: '', frequency: 'MONTHLY', startDate: '' });
      loadPayments();
    } catch (err) {
      setMessage(err.response?.data || 'Failed to schedule');
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.delete(`/recurring/${id}`);
      loadPayments();
    } catch (e) {
      alert('Failed to cancel');
    }
  };

  if (!accountId) return null;

  return (
    <div className="glass-panel" style={{ marginTop: '20px' }}>
      <h3>Standing Instructions</h3>
      {message && <div style={{ marginBottom: '10px', color: 'var(--secondary)' }}>{message}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'end', marginBottom: '20px' }}>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Destination</label>
          <input className="input-field" type="text" value={formData.destinationAccountNumber} onChange={e => setFormData({...formData, destinationAccountNumber: e.target.value})} required style={{ padding: '8px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Amount</label>
          <input className="input-field" type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required style={{ padding: '8px', width: '100px' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Frequency</label>
          <select className="input-field" value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} style={{ padding: '8px' }}>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Start Date</label>
          <input className="input-field" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required style={{ padding: '8px' }} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Schedule</button>
      </form>

      {payments.length === 0 ? <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No standing instructions.</p> : (
        <table style={{ fontSize: '14px' }}>
          <thead>
            <tr>
              <th>To Account</th>
              <th>Amount</th>
              <th>Freq</th>
              <th>Next Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>{p.destinationAccountNumber}</td>
                <td>${p.amount}</td>
                <td>{p.frequency}</td>
                <td>{p.nextExecutionDate}</td>
                <td><span className={`status-badge ${p.status === 'ACTIVE' ? 'status-completed' : 'status-suspicious'}`}>{p.status}</span></td>
                <td>
                  {p.status === 'ACTIVE' && <button onClick={() => handleCancel(p.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
