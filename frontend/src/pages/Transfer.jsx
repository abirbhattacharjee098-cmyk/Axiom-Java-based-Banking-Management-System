import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [formData, setFormData] = useState({ sourceAccountId: '', destinationAccountId: '', amount: '', type: 'TRANSFER' });
  const [message, setMessage] = useState('');
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [beneName, setBeneName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/accounts').then(res => {
      setAccounts(res.data);
      if(res.data.length > 0) setFormData(f => ({...f, sourceAccountId: res.data[0].id}));
    });
    api.get('/beneficiaries').then(res => setBeneficiaries(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (formData.type === 'DEPOSIT') {
        await api.post('/transactions/deposit', { destinationAccountId: formData.sourceAccountId, amount: formData.amount });
      } else if (formData.type === 'WITHDRAWAL') {
        await api.post('/transactions/withdraw', { sourceAccountId: formData.sourceAccountId, amount: formData.amount });
      } else {
        await api.post('/transactions/transfer', formData);
        if (saveBeneficiary && beneName) {
           await api.post('/beneficiaries', { name: beneName, accountNumber: formData.destinationAccountId });
        }
      }
      setMessage('Transaction successful!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch(err) {
      setMessage(err.response?.data || 'Transaction failed');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <div className="glass-panel">
        <h2>Initiate Transaction</h2>
        {message && <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', marginBottom: '10px', borderRadius: '4px' }}>{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Transaction Type</label>
            <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="TRANSFER">Transfer Money</option>
              <option value="DEPOSIT">Self Deposit</option>
              <option value="WITHDRAWAL">Withdraw</option>
            </select>
          </div>

          <div className="input-group">
            <label>Source Account</label>
            <select className="input-field" value={formData.sourceAccountId} onChange={e => setFormData({...formData, sourceAccountId: e.target.value})} required>
              <option value="">Select Account</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.accountType} - {a.accountNumber} (Bal: ${a.balance})</option>)}
            </select>
          </div>

          {formData.type === 'TRANSFER' && (
            <>
              {beneficiaries.length > 0 && (
                <div className="input-group">
                  <label>Quick Select Beneficiary</label>
                  <select className="input-field" onChange={e => setFormData({...formData, destinationAccountId: e.target.value})}>
                    <option value="">-- Choose saved beneficiary --</option>
                    {beneficiaries.map(b => <option key={b.id} value={b.accountNumber}>{b.name} ({b.accountNumber})</option>)}
                  </select>
                </div>
              )}
              
              <div className="input-group">
                <label>Destination Account ID</label>
                <input className="input-field" type="text" placeholder="Enter target account ID" value={formData.destinationAccountId} onChange={e => setFormData({...formData, destinationAccountId: e.target.value})} required />
              </div>

              {!beneficiaries.find(b => b.accountNumber === formData.destinationAccountId) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <input type="checkbox" id="saveBene" checked={saveBeneficiary} onChange={e => setSaveBeneficiary(e.target.checked)} />
                  <label htmlFor="saveBene" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', cursor: 'pointer' }}><Star size={14} /> Save as Beneficiary</label>
                </div>
              )}
              
              {saveBeneficiary && (
                <div className="input-group">
                  <label>Beneficiary Name</label>
                  <input className="input-field" type="text" placeholder="E.g. John Doe" value={beneName} onChange={e => setBeneName(e.target.value)} required={saveBeneficiary} />
                </div>
              )}
            </>
          )}

          <div className="input-group">
            <label>Amount ($)</label>
            <input className="input-field" type="number" step="0.01" min="1" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>Submit Transaction</button>
        </form>
      </div>
    </div>
  );
}
