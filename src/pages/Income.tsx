import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Crown, Download, Filter, Calendar } from 'lucide-react';
import { walletTransactions } from '../data/mockData';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Income() {
  const { user } = useAuth();
  const location = useLocation();
  const [dateFilter, setDateFilter] = useState('all');
  if (!user) return null;

  const getIncomeType = () => {
    if (location.pathname.includes('level1')) return { type: 'commission_l1', label: 'Level 1', icon: DollarSign, color: 'from-green-500 to-emerald-600' };
    if (location.pathname.includes('level2')) return { type: 'commission_l2', label: 'Level 2', icon: TrendingUp, color: 'from-blue-500 to-indigo-600' };
    if (location.pathname.includes('leader')) return { type: 'leader_payout', label: 'Leader', icon: Crown, color: 'from-amber-500 to-orange-600' };
    return { type: 'commission_l1', label: 'Level 1', icon: DollarSign, color: 'from-green-500 to-emerald-600' };
  };

  const incomeType = getIncomeType();
  const myTransactions = walletTransactions.filter(t => t.userId === user.id && t.type === incomeType.type);
  const totalIncome = myTransactions.reduce((s, t) => s + t.amount, 0);

  const exportCSV = () => {
    const csv = 'Date,Description,Amount\n' + myTransactions.map(t => `${t.createdAt},"${t.description}",${t.amount}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${incomeType.label}-income.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${incomeType.color} rounded-xl flex items-center justify-center`}>
              <incomeType.icon className="w-5 h-5 text-white" />
            </div>
            {incomeType.label} Income
          </h1>
          <p className="text-white/50 mt-1">Track your {incomeType.label.toLowerCase()} earnings</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      {/* Total Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-gradient-to-br ${incomeType.color} rounded-2xl p-6 text-white`}>
        <p className="text-sm opacity-80">Total {incomeType.label} Income</p>
        <p className="text-4xl font-bold mt-2">₹{totalIncome.toLocaleString()}</p>
        <p className="text-sm opacity-80 mt-2">{myTransactions.length} transactions</p>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-white/40" />
        <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50">
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-white/50">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {myTransactions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-white/50">
                    No {incomeType.label.toLowerCase()} income yet
                  </td>
                </tr>
              ) : (
                myTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/40" />
                        {tx.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{tx.description}</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-400">+₹{tx.amount.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
