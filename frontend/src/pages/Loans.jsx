import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [formData, setFormData] = useState({ principal: '', durationMonths: '12' });
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      const res = await api.get('/loans');
      setLoans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post('/loans/apply', formData);
      setMessage('Loan application submitted successfully!');
      setFormData({ principal: '', durationMonths: '12' });
      loadLoans();
    } catch (err) {
      setMessage('Failed to submit application.');
    }
  };

  return (
    <div className="container">
      <h2><span className="text-gradient">Loan</span> Center</h2>
      
      <div className="grid-cols-2" style={{ marginTop: '24px' }}>
        <div className="glass-panel">
          <h3>Apply for a Loan</h3>
          {message && <div style={{ marginBottom: '16px', color: 'var(--secondary)' }}>{message}</div>}
          <form onSubmit={handleApply}>
            <div className="input-group">
              <label>Principal Amount ($)</label>
              <input className="input-field" type="number" min="100" step="100" value={formData.principal} onChange={e => setFormData({...formData, principal: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Duration (Months)</label>
              <select className="input-field" value={formData.durationMonths} onChange={e => setFormData({...formData, durationMonths: e.target.value})}>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="48">48 Months</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
              Interest Rate: <strong>12.5% fixed</strong>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Application</button>
          </form>
        </div>

        <div className="glass-panel">
          <h3>Your Loans</h3>
          {loans.length === 0 ? <p>No loan records found.</p> : (
            <table>
              <thead>
                <tr>
                  <th>Principal</th>
                  <th>Duration</th>
                  <th>Interest</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(loan => (
                  <tr key={loan.id}>
                    <td>${loan.principal}</td>
                    <td>{loan.durationMonths} mo</td>
                    <td>{loan.interestRate}%</td>
                    <td><span className={`status-badge ${loan.status === 'APPROVED' ? 'status-completed' : (loan.status === 'PENDING' ? 'status-pending' : 'status-suspicious')}`}>{loan.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
