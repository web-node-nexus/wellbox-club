import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Crown, Download, Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import {
  fetchCommissions,
  getCommissionsByType,
  type CommissionRecord,
  type CommissionType,
} from '../services/commissionService';
import { BUSINESS_RULES, formatInr } from '../data/businessRules';

export default function Income() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [dateFilter, setDateFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<CommissionRecord[]>([]);
  const [viewingTransaction, setViewingTransaction] = useState<CommissionRecord | null>(null);

  const getIncomeType = () => {
    if (location.pathname.includes('level2'))
      return {
        type: 'commission_l2' as CommissionType,
        label: 'Level 2',
        icon: TrendingUp,
        color: 'from-blue-500 to-indigo-600',
        description: `${BUSINESS_RULES.level2Percent}% from your referrals' referrals' investments`,
      };
    if (location.pathname.includes('leader'))
      return {
        type: 'leader_payout' as CommissionType,
        label: 'Leader',
        icon: Crown,
        color: 'from-amber-500 to-orange-600',
        description: `${BUSINESS_RULES.leaderPercent}% of team income (team ≥ ${BUSINESS_RULES.leaderTeamRequirement}, payout on ${BUSINESS_RULES.leaderPayoutDay}rd)`,
      };
    return {
      type: 'commission_l1' as CommissionType,
      label: 'Level 1',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      description: `${BUSINESS_RULES.level1Percent}% from your direct referrals' investments`,
    };
  };

  const incomeType = getIncomeType();

  useEffect(() => {
    if (!user) return;
    fetchCommissions(user.id)
      .then(() => setRows(getCommissionsByType(user.id, incomeType.type)))
      .catch(() => setRows(getCommissionsByType(user.id, incomeType.type)));
  }, [user, incomeType.type, location.pathname]);

  if (!user) return null;

  const filteredTransactions = rows.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
    const d = new Date(t.createdAt);
    const matchesDate =
      dateFilter === 'all' ||
      (dateFilter === 'month' && d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear()) ||
      (dateFilter === 'year' && d.getFullYear() === new Date().getFullYear());
    return matchesSearch && matchesDate;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.status === 'completed' || t.type === 'leader_payout')
    .reduce((s, t) => s + t.amount, 0);

  const exportCSV = () => {
    const csv =
      'Date,Description,Amount,Status\n' +
      filteredTransactions.map(t => `${t.createdAt},"${t.description}",${t.amount},${t.status}`).join('\n');
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${incomeType.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <incomeType.icon className="w-6 h-6 text-white" />
            </div>
            {incomeType.label} Income
          </h1>
          <p className="text-gray-500 mt-1">{incomeType.description}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${incomeType.color} rounded-3xl p-8 text-white shadow-2xl`}
      >
        <p className="text-sm opacity-80 font-medium">Total {incomeType.label} Income</p>
        <p className="text-5xl font-bold mt-2">{formatInr(totalIncome)}</p>
        <p className="text-sm opacity-80 mt-3">{filteredTransactions.length} transactions</p>
      </motion.div>

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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="font-medium">No {incomeType.label} income yet</p>
            <p className="text-sm mt-1">
              When your referral invests, {incomeType.label} commission will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredTransactions.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setViewingTransaction(t)}
                className="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{t.description}</p>
                  <p className="text-sm text-gray-500">
                    {t.createdAt} · {t.status}
                  </p>
                </div>
                <p className="font-bold text-green-600">+{formatInr(t.amount)}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {viewingTransaction && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setViewingTransaction(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Transaction</h3>
            <p className="text-sm text-gray-600 mb-4">{viewingTransaction.description}</p>
            <p className="text-2xl font-bold text-green-600 mb-1">
              {formatInr(viewingTransaction.amount)}
            </p>
            <p className="text-xs text-gray-500">
              {viewingTransaction.createdAt} · {viewingTransaction.status}
            </p>
            <button
              onClick={() => setViewingTransaction(null)}
              className="mt-6 w-full py-2.5 bg-gray-100 rounded-xl font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
