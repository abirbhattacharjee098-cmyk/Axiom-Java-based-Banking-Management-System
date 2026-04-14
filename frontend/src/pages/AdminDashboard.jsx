import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [uRes, aRes, tRes, lRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/accounts'),
        api.get('/admin/transactions'),
        api.get('/loans/all')
      ]);
      setUsers(uRes.data);
      setAccounts(aRes.data);
      setTransactions(tRes.data);
      setLoans(lRes.data);
    } catch(err) {
      console.error(err);
    }
  };

  const pieData = useMemo(() => {
    const counts = {};
    transactions.forEach(t => { counts[t.type] = (counts[t.type] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const totalBalance = useMemo(() => accounts.reduce((sum, a) => sum + a.balance, 0), [accounts]);

  const handleLoanAction = async (loanId, action) => {
    try {
      if (action === 'approve') {
        // Find user's first account for dispersal - simplified
        const loan = loans.find(l => l.id === loanId);
        // We need an accountId - for simplicity let's just pass 1 for the prompt
        const accId = prompt('Enter account ID to disburse the loan to:');
        if (!accId) return;
        await api.post(`/loans/${loanId}/approve?accountId=${accId}`);
      } else {
        await api.post(`/loans/${loanId}/reject`);
      }
      fetchData();
    } catch (err) {
      alert(err.response?.data || 'Action failed');
    }
  };

  return (
    <div className="container">
      <h2><span className="text-gradient">Admin</span> Dashboard</h2>
      
      {/* Row 1: Stats + Fraud Alerts */}
      <div className="grid-cols-2" style={{ marginBottom: '24px' }}>
        <div className="glass-panel">
          <h3>System Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)' }}>{users.length}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Users</div>
            </div>
            <div style={{ padding: '16px', background: 'rgba(16,185,129,0.1)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--secondary)' }}>{accounts.length}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Accounts</div>
            </div>
            <div style={{ padding: '16px', background: 'rgba(245,158,11,0.1)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--warning)' }}>{transactions.length}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Transactions</div>
            </div>
            <div style={{ padding: '16px', background: 'rgba(139,92,246,0.1)', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#8b5cf6' }}>${totalBalance.toFixed(2)}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Deposits</div>
            </div>
          </div>
        </div>
        
        <div className="glass-panel" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <h3 style={{ color: '#f87171' }}>Fraud Alerts</h3>
          <ul style={{ listStyleType: 'none', padding: 0, marginTop: '12px' }}>
            {transactions.filter(t => t.suspicious).map(t => (
              <li key={t.id} style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', marginBottom: '8px', borderRadius: '8px', fontSize: '14px' }}>
                ⚠️ Tx <strong>{t.referenceNumber.substring(0,8)}</strong> — ${t.amount} <span className="status-badge status-suspicious" style={{ marginLeft: '8px' }}>FLAGGED</span>
              </li>
            ))}
            {transactions.filter(t => t.suspicious).length === 0 && <li style={{ color: 'var(--text-muted)' }}>✅ No suspicious activities detected.</li>}
          </ul>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid-cols-2" style={{ marginBottom: '24px' }}>
        <div className="glass-panel">
          <h3>Transaction Breakdown</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--card-bg)', border: 'none', borderRadius: '8px', color: 'var(--text-main)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p>No data yet.</p>}
        </div>

        {/* Loan Management */}
        <div className="glass-panel">
          <h3>Loan Applications</h3>
          {loans.filter(l => l.status === 'PENDING').length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No pending loan applications.</p>
          ) : (
            <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {loans.filter(l => l.status === 'PENDING').map(loan => (
                <div key={loan.id} style={{ padding: '14px', background: 'var(--input-bg)', borderRadius: '10px', marginBottom: '10px', border: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>${loan.principal} @ {loan.interestRate}%</div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{loan.durationMonths} months</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-success" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => handleLoanAction(loan.id, 'approve')}>Approve</button>
                      <button className="btn btn-danger" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => handleLoanAction(loan.id, 'reject')}>Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Transaction table */}
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
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 50).map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td style={{ fontSize: '12px' }}>{t.referenceNumber.substring(0,8)}</td>
                <td><span className={`status-badge ${t.type === 'DEPOSIT' ? 'status-completed' : 'status-pending'}`}>{t.type}</span></td>
                <td>${t.amount}</td>
                <td><span className="status-badge status-completed">{t.status}</span></td>
                <td>
                  {t.suspicious ? <span className="status-badge status-suspicious">FLAGGED</span> : <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Safe</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
