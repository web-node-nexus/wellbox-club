import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Wallet, ArrowDownRight, ArrowUpRight, Lock, Unlock, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { getCommissionWalletBalance, getContributionWalletBalance, walletTransactions, contributions, withdrawals } from '../data/mockData';
import { useState } from 'react';

export default function WalletPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'commission' | 'contribution'>('commission');
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  if (!user) return null;

  const commissionBalance = getCommissionWalletBalance(user.id);
  const contributionBalance = getContributionWalletBalance(user.id);
  const myTransactions = walletTransactions.filter(t => t.userId === user.id && t.wallet === activeTab);
  const myContributions = contributions.filter(c => c.userId === user.id);
  const myWithdrawals = withdrawals.filter(w => w.userId === user.id);
  const unlockedContributions = myContributions.filter(c => c.status === 'unlocked');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdraw(false);
      setWithdrawAmount('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Wallet</h1>
        <p className="text-gray-500 mt-1">Manage your commission and contribution balances</p>
      </div>

      {/* Wallet Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-2xl p-6 cursor-pointer transition-all ${
            activeTab === 'commission' ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl shadow-green-200' : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
          }`}
          onClick={() => setActiveTab('commission')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === 'commission' ? 'bg-white/20' : 'bg-green-100'}`}>
              <Wallet className={`w-5 h-5 ${activeTab === 'commission' ? 'text-white' : 'text-green-600'}`} />
            </div>
            <Unlock className={`w-5 h-5 ${activeTab === 'commission' ? 'text-green-200' : 'text-green-400'}`} />
          </div>
          <p className={`text-sm ${activeTab === 'commission' ? 'text-green-100' : 'text-gray-500'}`}>Commission Wallet</p>
          <p className={`text-3xl font-bold mt-1 ${activeTab === 'commission' ? 'text-white' : 'text-gray-900'}`}>₹{commissionBalance.toLocaleString()}</p>
          <p className={`text-xs mt-2 ${activeTab === 'commission' ? 'text-green-200' : 'text-gray-400'}`}>Withdrawable anytime</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-2xl p-6 cursor-pointer transition-all ${
            activeTab === 'contribution' ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-200' : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
          }`}
          onClick={() => setActiveTab('contribution')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === 'contribution' ? 'bg-white/20' : 'bg-blue-100'}`}>
              <Lock className={`w-5 h-5 ${activeTab === 'contribution' ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <Lock className={`w-5 h-5 ${activeTab === 'contribution' ? 'text-blue-200' : 'text-blue-400'}`} />
          </div>
          <p className={`text-sm ${activeTab === 'contribution' ? 'text-blue-100' : 'text-gray-500'}`}>Contribution Wallet</p>
          <p className={`text-3xl font-bold mt-1 ${activeTab === 'contribution' ? 'text-white' : 'text-gray-900'}`}>₹{contributionBalance.toLocaleString()}</p>
          <p className={`text-xs mt-2 ${activeTab === 'contribution' ? 'text-blue-200' : 'text-gray-400'}`}>Locked for 12 months • Withdraw or convert to gold after unlock</p>
        </motion.div>
      </div>

      {/* Commission Wallet Details */}
      {activeTab === 'commission' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Withdraw Button */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Available for Withdrawal</p>
                <p className="text-2xl font-bold text-gray-900">₹{commissionBalance.toLocaleString()}</p>
              </div>
              <button
                onClick={() => setShowWithdraw(!showWithdraw)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-200"
              >
                <Send className="w-4 h-4" />
                Withdraw
              </button>
            </div>

            {showWithdraw && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-gray-100">
                {withdrawSuccess ? (
                  <div className="flex items-center gap-2 p-4 bg-green-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-700">Withdrawal request submitted! Admin will process it shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleWithdraw} className="space-y-3">
                    <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                      <p className="text-xs text-amber-700">Withdrawal requests are processed by admin within 24-48 hours. Amount will be transferred to your bank account.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        max={commissionBalance}
                        placeholder={`Max: ₹${commissionBalance.toLocaleString()}`}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors">
                        Submit Request
                      </button>
                      <button type="button" onClick={() => setShowWithdraw(false)} className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </div>

          {/* Recent Withdrawals */}
          {myWithdrawals.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Withdrawal History</h3>
              <div className="space-y-3">
                {myWithdrawals.map(w => (
                  <div key={w.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">₹{w.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{w.createdAt}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      w.status === 'approved' ? 'bg-green-100 text-green-700' :
                      w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {w.status === 'approved' ? '✓ Approved' : w.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Contribution Wallet Details */}
      {activeTab === 'contribution' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Contribution Lock Period</p>
                <p className="text-xs text-blue-700 mt-1">Each contribution is locked for 12 months. After the lock period, you can either withdraw the amount or convert it into gold purchase.</p>
              </div>
            </div>

            {unlockedContributions.length > 0 && (
              <div className="mb-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Unlock className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-green-900">Unlocked Contributions Available</p>
                </div>
                <p className="text-xs text-green-700">You have {unlockedContributions.length} contribution(s) that have completed the 12-month lock period.</p>
                <div className="flex gap-2 mt-3">
                  <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                    Withdraw Unlocked
                  </button>
                  <button className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors">
                    Convert to Gold
                  </button>
                </div>
              </div>
            )}

            <h3 className="font-semibold text-gray-900 mb-3">Contribution History</h3>
            <div className="space-y-2">
              {myContributions.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    {c.status === 'locked' ? (
                      <Lock className="w-4 h-4 text-orange-500" />
                    ) : (
                      <Unlock className="w-4 h-4 text-green-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">₹{c.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Contributed on {c.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      c.status === 'locked' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {c.status === 'locked' ? `🔒 Until ${c.lockedUntil}` : '🔓 Unlocked'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Transaction Ledger */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">
          {activeTab === 'commission' ? 'Commission' : 'Contribution'} Ledger
        </h3>
        <div className="space-y-2">
          {myTransactions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            myTransactions.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  tx.type.includes('contribution') ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {tx.type === 'contribution' ? (
                    <ArrowUpRight className="w-4 h-4 text-blue-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                  <p className="text-xs text-gray-500">{tx.createdAt}</p>
                </div>
                <p className={`text-sm font-semibold ${
                  tx.type === 'contribution' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {tx.type === 'contribution' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
