import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Coins, Lock, Unlock, Calendar, ArrowRight, Gem, Download, Eye, X, TrendingUp } from 'lucide-react';
import { contributions } from '../data/mockData';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Contributions() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [viewingContribution, setViewingContribution] = useState<any>(null);
  if (!user) return null;

  const myContributions = contributions.filter(c => c.userId === user.id);
  const totalContributed = myContributions.reduce((s, c) => s + c.amount, 0);
  const lockedAmount = myContributions.filter(c => c.status === 'locked').reduce((s, c) => s + c.amount, 0);
  const unlockedAmount = myContributions.filter(c => c.status === 'unlocked').reduce((s, c) => s + c.amount, 0);

  const getDaysUntilUnlock = (lockedUntil: string) => {
    const now = new Date();
    const unlock = new Date(lockedUntil);
    const diff = unlock.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const exportCSV = () => {
    const csv = 'ID,Amount,Date,Locked Until,Status\n' +
      myContributions.map(c => `${c.id},${c.amount},${c.date},${c.lockedUntil},${c.status}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contributions.csv';
    a.click();
    showToast('success', 'Contributions exported successfully', 'Export');
  };

  const handleWithdraw = (contributionId: string) => {
    showToast('success', 'Withdrawal request submitted', 'Success');
  };

  const handleConvertToGold = (contributionId: string) => {
    showToast('success', 'Redirecting to Gold Showroom...', 'Convert');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Contributions</h1>
          <p className="text-white/50 mt-1">Track your gold savings and lock periods</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Coins className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{totalContributed.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total Contributed</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{lockedAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Locked Amount</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Unlock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{unlockedAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Available (Unlocked)</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">12-Month Lock Period</p>
            <p className="text-sm text-blue-700 mt-1">Each contribution is locked for 12 months from the contribution date. After the lock period expires, you can choose to:</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-blue-100">
                <ArrowRight className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Withdraw to bank account</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-blue-100">
                <Gem className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-gray-700">Convert to gold purchase</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contributions List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Contribution History</h3>
        </div>
        {myContributions.length === 0 ? (
          <div className="text-center py-12">
            <Coins className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No contributions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {myContributions.map(c => {
              const daysLeft = getDaysUntilUnlock(c.lockedUntil);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        c.status === 'locked' ? 'bg-orange-100' : 'bg-green-100'
                      }`}>
                        {c.status === 'locked' ? <Lock className="w-5 h-5 text-orange-600" /> : <Unlock className="w-5 h-5 text-green-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">₹{c.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Contributed on {c.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {c.status === 'locked' ? (
                        <div>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                            🔒 {daysLeft} days left
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Unlocks: {c.lockedUntil}</p>
                        </div>
                      ) : (
                        <div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            🔓 Unlocked
                          </span>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleWithdraw(c.id)}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Withdraw
                            </button>
                            <button
                              onClick={() => handleConvertToGold(c.id)}
                              className="px-3 py-1 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition-colors"
                            >
                              Buy Gold
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {c.status === 'locked' && (
                    <div className="mt-3 ml-14">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-orange-400 to-amber-500 h-1.5 rounded-full"
                          style={{ width: `${Math.max(0, 100 - (daysLeft / 365) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{Math.round(100 - (daysLeft / 365) * 100)}% of lock period completed</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
