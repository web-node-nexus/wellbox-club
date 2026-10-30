import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Coins, Lock, Unlock, Calendar, ArrowRight, Gem, Download, Eye, X, TrendingUp, IndianRupee, AlertCircle } from 'lucide-react';
import { contributions } from '../data/mockData';
import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

export default function Contributions() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [viewingContribution, setViewingContribution] = useState<any>(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investAmount, setInvestAmount] = useState('');
  const [investError, setInvestError] = useState('');
  
  if (!user) return null;

  // Get monthly investments from localStorage
  const [monthlyInvestments, setMonthlyInvestments] = useState(() => {
    const stored = localStorage.getItem(`investments_${user.id}`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(`investments_${user.id}`, JSON.stringify(monthlyInvestments));
  }, [monthlyInvestments, user.id]);

  const myContributions = contributions.filter(c => c.userId === user.id);
  const allInvestments = [...monthlyInvestments, ...myContributions];
  
  const totalContributed = allInvestments.reduce((s: number, c: any) => s + c.amount, 0);
  const lockedAmount = allInvestments.filter((c: any) => c.status === 'locked').reduce((s: number, c: any) => s + c.amount, 0);
  const unlockedAmount = allInvestments.filter((c: any) => c.status === 'unlocked').reduce((s: number, c: any) => s + c.amount, 0);

  const getDaysUntilUnlock = (lockedUntil: string) => {
    const now = new Date();
    const unlock = new Date(lockedUntil);
    const diff = unlock.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleInvest = () => {
    const amount = Number(investAmount);
    if (amount < 1000) {
      setInvestError('Minimum investment is ₹1,000 per month');
      return;
    }
    // No maximum limit - user can invest any amount

    const newInvestment = {
      id: Date.now().toString(),
      userId: user.id,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      lockedUntil: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 months lock
      status: 'locked' as const,
    };

    setMonthlyInvestments([...monthlyInvestments, newInvestment]);
    showToast('success', `₹${amount.toLocaleString()} invested successfully! Locked for minimum 12 months.`, 'Investment Successful');
    setShowInvestModal(false);
    setInvestAmount('');
    setInvestError('');
  };

  const exportCSV = () => {
    const csv = 'ID,Amount,Date,Locked Until,Status\n' +
      allInvestments.map((c: any) => `${c.id},${c.amount},${c.date},${c.lockedUntil},${c.status}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investments.csv';
    a.click();
    showToast('success', 'Investments exported successfully', 'Export');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Investments</h1>
          <p className="text-white/50 mt-1">Track your monthly gold savings</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInvestModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg"
          >
            <IndianRupee className="w-4 h-4" />
            Invest Now
          </motion.button>
        </div>
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
              <p className="text-sm text-gray-500">Total Invested</p>
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
              <p className="text-sm text-gray-500">Available for Gold</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Important Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-blue-900 text-lg mb-2">Investment Rules</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">12-Month Lock Period</p>
                  <p className="text-xs text-blue-700">Each investment is locked for minimum 12 months</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <IndianRupee className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Minimum ₹1,000/month</p>
                  <p className="text-xs text-blue-700">Invest at least ₹1,000 every month</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Gem className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Order Gold After Lock</p>
                  <p className="text-xs text-blue-700">Use investment to buy gold from showroom</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">No Cash Withdrawal</p>
                  <p className="text-xs text-blue-700">Investment cannot be withdrawn as cash</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investments List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Investment History</h3>
        </div>
        {allInvestments.length === 0 ? (
          <div className="text-center py-12">
            <Coins className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No investments yet</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInvestModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg"
            >
              Make Your First Investment
            </motion.button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {allInvestments.map((c: any) => {
              const daysLeft = getDaysUntilUnlock(c.lockedUntil);
              const isUnlocked = daysLeft === 0;
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
                        isUnlocked ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        {isUnlocked ? <Unlock className="w-5 h-5 text-green-600" /> : <Lock className="w-5 h-5 text-orange-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">₹{c.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Invested on {c.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {isUnlocked ? (
                        <div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            🔓 Unlocked
                          </span>
                          <Link to="/gold-showroom">
                            <button className="mt-2 px-4 py-1.5 bg-amber-600 text-white text-xs rounded-lg hover:bg-amber-700 transition-colors">
                              Order Gold
                            </button>
                          </Link>
                        </div>
                      ) : (
                        <div>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                            🔒 {daysLeft} days left
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Unlocks: {c.lockedUntil}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {!isUnlocked && (
                    <div className="mt-3 ml-14">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-orange-400 to-amber-500 h-1.5 rounded-full"
                          style={{ width: `${Math.max(0, 100 - (daysLeft / 330) * 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{Math.round(100 - (daysLeft / 330) * 100)}% of lock period completed</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowInvestModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Monthly Investment</h3>
              <button onClick={() => setShowInvestModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> Investment is locked for minimum 12 months. After lock period, you can order gold from showroom. Cash withdrawal is not available for investments.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount (₹) *</label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={e => { setInvestAmount(e.target.value); setInvestError(''); }}
                  min={1000}
                  max={100000}
                  placeholder="Minimum ₹1,000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
                {investError && <p className="text-sm text-red-600 mt-1">{investError}</p>}
                <div className="flex gap-2 mt-2">
                  {[1000, 3000, 5000, 10000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => { setInvestAmount(String(val)); setInvestError(''); }}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors"
                    >
                      ₹{val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-600">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Lock Period: <strong>12 months</strong><br />
                  <Gem className="w-3 h-3 inline mr-1" />
                  After lock: Can order gold from showroom<br />
                  <IndianRupee className="w-3 h-3 inline mr-1" />
                  Minimum: ₹1,000 per month
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowInvestModal(false)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInvest}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg"
                >
                  Invest Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
