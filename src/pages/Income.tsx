import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Crown, Download, Filter, Calendar, Eye, X, Search } from 'lucide-react';
import { walletTransactions } from '../data/mockData';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function Income() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [dateFilter, setDateFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewingTransaction, setViewingTransaction] = useState<any>(null);
  if (!user) return null;

  const getIncomeType = () => {
    if (location.pathname.includes('level1')) return { type: 'commission_l1', label: 'Level 1', icon: DollarSign, color: 'from-green-500 to-emerald-600', description: 'Commission from your direct referrals' };
    if (location.pathname.includes('level2')) return { type: 'commission_l2', label: 'Level 2', icon: TrendingUp, color: 'from-blue-500 to-indigo-600', description: 'Commission from your referrals\' referrals' };
    if (location.pathname.includes('leader')) return { type: 'leader_payout', label: 'Leader', icon: Crown, color: 'from-amber-500 to-orange-600', description: 'Monthly leader payout on team income' };
    return { type: 'commission_l1', label: 'Level 1', icon: DollarSign, color: 'from-green-500 to-emerald-600', description: 'Commission from your direct referrals' };
  };

  const incomeType = getIncomeType();
  const myTransactions = walletTransactions.filter(t => t.userId === user.id && t.type === incomeType.type);
  
  const filteredTransactions = myTransactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'month' && new Date(t.createdAt).getMonth() === new Date().getMonth()) ||
      (dateFilter === 'year' && new Date(t.createdAt).getFullYear() === new Date().getFullYear());
    return matchesSearch && matchesDate;
  });

  const totalIncome = filteredTransactions.reduce((s, t) => s + t.amount, 0);

  const exportCSV = () => {
    const csv = 'Date,Description,Amount\n' + filteredTransactions.map(t => `${t.createdAt},"${t.description}",${t.amount}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${incomeType.label}-income.csv`;
    a.click();
    showToast('success', 'Income data exported successfully', 'Export');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${incomeType.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <incomeType.icon className="w-6 h-6 text-white" />
            </div>
            {incomeType.label} Income
          </h1>
          <p className="text-white/50 mt-1">{incomeType.description}</p>
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

      {/* Total Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-gradient-to-br ${incomeType.color} rounded-3xl p-8 text-white shadow-2xl`}>
        <p className="text-sm opacity-80 font-medium">Total {incomeType.label} Income</p>
        <p className="text-5xl font-bold mt-2">₹{totalIncome.toLocaleString()}</p>
        <p className="text-sm opacity-80 mt-3">{filteredTransactions.length} transactions</p>
      </motion.div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs text-gray-500">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    No {incomeType.label.toLowerCase()} income found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {tx.createdAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{tx.description}</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">+₹{tx.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setViewingTransaction(tx)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Transaction Modal */}
      {viewingTransaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setViewingTransaction(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
              <button onClick={() => setViewingTransaction(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                  <p className="font-mono font-medium text-gray-900">{viewingTransaction.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Amount</p>
                  <p className="text-xl font-bold text-green-600">₹{viewingTransaction.amount.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <p className="font-medium text-gray-900">{viewingTransaction.type}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="font-medium text-gray-900">{viewingTransaction.createdAt}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="font-medium text-gray-900">{viewingTransaction.description}</p>
              </div>
              <button
                onClick={() => setViewingTransaction(null)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
