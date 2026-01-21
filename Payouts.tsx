import React, { useState } from 'react';
import { User, PayoutRequest, PayoutStatus } from '../types';

interface PayoutsProps {
  user: User;
  requests: PayoutRequest[];
  onRequestPayout: (data: { amount: number, method: string, accountDetails: string }) => void;
}

const Payouts: React.FC<PayoutsProps> = ({ user, requests, onRequestPayout }) => {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState(user.balance);
  const [method, setMethod] = useState('Bkash');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 100) {
      alert("Minimum withdrawal is ৳100.");
      return;
    }
    onRequestPayout({ amount, method, accountDetails: details });
    setShowForm(false);
    setDetails('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Earnings Withdrawal</h2>
          <p className="text-slate-500">Cash out your Taka balance to your local accounts.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-money-bill-transfer"></i>
          Withdraw Balance
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-500 mb-2">Current Balance</p>
            <h3 className="text-5xl font-black text-slate-900 mb-2">৳{user.balance.toFixed(2)}</h3>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Available for payout</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Min Limit</span>
                <span className="font-bold">৳100.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Processing Time</span>
                <span className="font-bold">24 Hours</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <h3 className="font-bold">Withdrawal History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map(req => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 text-sm font-medium">{new Date(req.requestDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{req.method}</td>
                    <td className="px-6 py-4 text-sm font-black">৳{req.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        req.status === PayoutStatus.PROCESSED ? 'bg-emerald-100 text-emerald-700' :
                        req.status === PayoutStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No withdrawal records.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8">
            <h3 className="text-xl font-bold mb-6">Redeem Taka</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (৳)</label>
                <input 
                  type="number" 
                  value={amount}
                  max={user.balance}
                  min={100}
                  step="0.01"
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gateway</label>
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Bkash</option>
                  <option>Nagad</option>
                  <option>Rocket</option>
                  <option>Upay</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                <input 
                  required
                  placeholder="01XXXXXXXXX"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 font-bold bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200">Request ৳{amount.toFixed(2)}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payouts;