import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Wallet, ArrowDownRight, ArrowUpRight, Send, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getCommissionWalletBalance, walletTransactions, withdrawals } from '../data/mockData';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function WalletPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  if (!user) return null;

  const balance = getCommissionWalletBalance(user.id);
  const myTransactions = walletTransactions.filter(t => t.userId === user.id);
  const myWithdrawals = withdrawals.filter(w => w.userId === user.id);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) > balance) {
      showToast('error', 'Insufficient balance', 'Error');
      return;
    }
    showToast('success', 'Withdrawal request submitted!', 'Success');
    setShowWithdraw(false);
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Wallet & Withdraw</h1>
        <p className="text-white/50 mt-1">Manage your commission wallet</p>
      </div>

      {/* Balance Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Wallet className="w-8 h-8" />
          <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Withdrawable</span>
        </div>
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="text-4xl font-bold mt-2">₹{balance.toLocaleString()}</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowWithdraw(!showWithdraw)} className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur">
          Withdraw Now
        </motion.button>
      </motion.div>

      {/* Withdraw Form */}
      {showWithdraw && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Withdrawal Request</h3>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Amount (₹)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} max={balance} placeholder={`Max: ₹${balance.toLocaleString()}`} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50" required />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Method</label>
              <select value={method} onChange={e => setMethod(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50">
                <option value="bank">Bank Transfer (NEFT/IMPS)</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-medium">Submit Request</button>
              <button type="button" onClick={() => setShowWithdraw(false)} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Withdrawal History */}
      {myWithdrawals.length > 0 && (
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Withdrawal History</h3>
          <div className="space-y-3">
            {myWithdrawals.map(w => (
              <div key={w.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium">₹{w.amount.toLocaleString()}</p>
                  <p className="text-xs text-white/50">{w.createdAt}</p>
                </div>
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  w.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                  w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {w.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                   w.status === 'pending' ? <Clock className="w-3 h-3" /> :
                   <XCircle className="w-3 h-3" />}
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction Ledger */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Transaction Ledger</h3>
        <div className="space-y-2">
          {myTransactions.slice(0, 10).map(tx => (
            <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                tx.type === 'contribution' ? 'bg-blue-500/20' : 'bg-green-500/20'
              }`}>
                {tx.type === 'contribution' ? <ArrowUpRight className="w-4 h-4 text-blue-400" /> : <ArrowDownRight className="w-4 h-4 text-green-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{tx.description}</p>
                <p className="text-xs text-white/50">{tx.createdAt}</p>
              </div>
              <p className={`text-sm font-bold ${tx.type === 'contribution' ? 'text-blue-400' : 'text-green-400'}`}>
                {tx.type === 'contribution' ? '-' : '+'}₹{tx.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
