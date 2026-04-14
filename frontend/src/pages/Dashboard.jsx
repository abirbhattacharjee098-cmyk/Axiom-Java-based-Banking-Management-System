import { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import PdfDownloader from '../components/PdfDownloader';
import RecurringPayments from '../components/RecurringPayments';

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

  const selectedAccount = useMemo(() => accounts.find(a => a.id === selectedAccountId), [accounts, selectedAccountId]);

  // Generate chart data: running balance backwards from current balance
  const chartData = useMemo(() => {
    if (!selectedAccount || transactions.length === 0) return [];
    
    let currentBalance = selectedAccount.balance;
    const data = [{
      name: 'Now',
      balance: currentBalance
    }];

    [...transactions].forEach((tx, index) => {
      let change = tx.amount;
      const isDeposit = tx.type === 'DEPOSIT' || tx.destinationAccountId === selectedAccount.id;
      if (isDeposit) {
        currentBalance -= change;
      } else {
        currentBalance += change;
      }
      data.unshift({
        name: new Date(tx.timestamp).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}),
        balance: currentBalance
      });
    });
    
    return data;
  }, [transactions, selectedAccount]);

  if(loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2><span className="text-gradient">Financial</span> Overview</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" onClick={() => createAccount('SAVINGS')}>+ New Savings</button>
          <button className="btn btn-success" onClick={() => createAccount('CURRENT')}>+ New Current</button>
          {selectedAccount && <PdfDownloader transactions={transactions} account={selectedAccount} />}
        </div>
      </div>
      
      <div className="grid-cols-2">
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3>Your Accounts</h3>
            {accounts.length === 0 ? <p>No accounts found.</p> : (
              <div>
                {accounts.map(acc => (
                  <div key={acc.id} 
                       style={{ padding: '16px', border: '1px solid var(--card-border)', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer', background: selectedAccountId === acc.id ? 'rgba(99, 102, 241, 0.1)' : 'var(--input-bg)' }}
                       onClick={() => { setSelectedAccountId(acc.id); fetchTransactions(acc.id); }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{acc.accountType} A/C</strong>
                      <span className="status-badge status-completed">{acc.status}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>{acc.accountNumber}</div>
                    <h2 style={{ marginTop: '12px', marginBottom: '0', color: 'var(--text-main)' }}>${acc.balance.toFixed(2)}</h2>
                  </div>
                ))}
              </div>
            )}
          </div>

          <RecurringPayments accountId={selectedAccountId} />

          <div style={{ flex: 1, minHeight: '250px' }}>
            {chartData.length > 1 && (
              <>
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Balance History</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                    <XAxis dataKey="name" tick={{fill: 'var(--text-muted)', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: 'var(--text-muted)', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                    <Tooltip contentStyle={{ background: 'var(--card-bg)', border: 'none', borderRadius: '8px', color: 'var(--text-main)' }} />
                    <Line type="monotone" dataKey="balance" stroke="var(--primary)" strokeWidth={3} dot={{r: 4, fill: 'var(--primary)', strokeWidth: 0}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ maxHeight: '700px', overflowY: 'auto' }}>
          <div style={{ display: 'flex',justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
                    <td style={{ fontSize: '12px', color: 'var(--text-main)' }}>{tx.referenceNumber.substring(0,8)}</td>
                    <td><span className={`status-badge status-${tx.type === 'DEPOSIT' ? 'completed' : 'pending'}`}>{tx.type}</span></td>
                    <td style={{ fontWeight: '500', color: tx.type === 'DEPOSIT' || tx.destinationAccountId === selectedAccountId ? 'var(--secondary)' : 'var(--text-main)' }}>
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
