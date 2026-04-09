import { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uRes, aRes, tRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/accounts'),
        api.get('/admin/transactions')
      ]);
      setUsers(uRes.data);
      setAccounts(aRes.data);
      setTransactions(tRes.data);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2><span className="text-gradient">Admin</span> Dashboard</h2>
      
      <div className="grid-cols-2" style={{ marginBottom: '24px' }}>
        <div className="glass-panel">
          <h3>System Overview</h3>
          <p>Total Users: <strong>{users.length}</strong></p>
          <p>Total Accounts: <strong>{accounts.length}</strong></p>
          <p>Total Transactions: <strong>{transactions.length}</strong></p>
        </div>
        
        <div className="glass-panel" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <h3 style={{ color: '#f87171' }}>Fraud Alerts</h3>
          <p>Suspicious Activity detected in the system.</p>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {transactions.filter(t => t.suspicious).map(t => (
              <li key={t.id} style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', marginBottom: '8px', borderRadius: '4px' }}>
                Alert: Tx <strong>{t.referenceNumber.substring(0,8)}</strong> amount ${t.amount} exceeds limits.
              </li>
            ))}
            {transactions.filter(t => t.suspicious).length === 0 && <li>No suspicious activities found.</li>}
          </ul>
        </div>
      </div>

      <div className="glass-panel">
        <h3>All Recent Transactions</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ref</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Suspicious Flag</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 50).map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.referenceNumber.substring(0,8)}</td>
                <td>{t.type}</td>
                <td>${t.amount}</td>
                <td><span className="status-badge status-completed">{t.status}</span></td>
                <td>
                  {t.suspicious ? <span className="status-badge status-suspicious">FLAGGED</span> : <span style={{ color: 'var(--text-muted)' }}>Safe</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
