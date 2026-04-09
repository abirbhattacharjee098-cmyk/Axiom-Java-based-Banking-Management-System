import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/accounts');
      setAccounts(res.data);
      if (res.data.length > 0) {
        setSelectedAccountId(res.data[0].id);
        fetchTransactions(res.data[0].id);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchTransactions = async (accId) => {
    try {
      const res = await api.get(`/transactions/history/${accId}`);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createAccount = async (type) => {
    try {
      await api.post(`/accounts?type=${type}`);
      fetchData();
    } catch (err) {
      alert("Failed to create account");
    }
  };

  if(loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2><span className="text-gradient">Financial</span> Overview</h2>
        <div>
          <button className="btn btn-primary" onClick={() => createAccount('SAVINGS')} style={{ marginRight: '10px' }}>+ New Savings</button>
          <button className="btn btn-success" onClick={() => createAccount('CURRENT')}>+ New Current</button>
        </div>
      </div>
      
      <div className="grid-cols-2">
        <div className="glass-panel">
          <h3>Your Accounts</h3>
          {accounts.length === 0 ? <p>No accounts found.</p> : (
            <div>
              {accounts.map(acc => (
                <div key={acc.id} 
                     style={{ padding: '16px', border: '1px solid var(--card-border)', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer', background: selectedAccountId === acc.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent' }}
                     onClick={() => { setSelectedAccountId(acc.id); fetchTransactions(acc.id); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{acc.accountType} A/C</strong>
                    <span className="status-badge status-completed">{acc.status}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>{acc.accountNumber}</div>
                  <h2 style={{ marginTop: '12px', marginBottom: '0' }}>${acc.balance.toFixed(2)}</h2>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <div style={{ display: 'flex',justifyContent: 'space-between' }}>
            <h3>Recent Transactions</h3>
            <button className="btn btn-primary" onClick={() => navigate('/transfer')}>Make Transfer</button>
          </div>
          {transactions.length === 0 ? <p>No transactions yet.</p> : (
            <table>
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ fontSize: '12px' }}>{tx.referenceNumber.substring(0,8)}</td>
                    <td><span className={`status-badge status-${tx.type === 'DEPOSIT' ? 'completed' : 'pending'}`}>{tx.type}</span></td>
                    <td style={{ color: tx.type === 'DEPOSIT' || tx.destinationAccountId === selectedAccountId ? '#10b981' : 'white' }}>
                      {tx.type === 'DEPOSIT' || tx.destinationAccountId === selectedAccountId ? '+' : '-'}${tx.amount}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(tx.timestamp).toLocaleDateString()}</td>
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
