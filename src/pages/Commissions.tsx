import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Crown, Gift, Filter } from 'lucide-react';
import { walletTransactions } from '../data/mockData';
import { useState } from 'react';

export default function Commissions() {
  const { user } = useAuth();
  const { settings } = useApp();
  const [filter, setFilter] = useState<string>('all');
  if (!user) return null;

  const myTransactions = walletTransactions.filter(t => t.userId === user.id);
  
  const filteredTransactions = filter === 'all' 
    ? myTransactions 
    : myTransactions.filter(t => {
        if (filter === 'l1') return t.type === 'commission_l1';
        if (filter === 'l2') return t.type === 'commission_l2';
        if (filter === 'leader') return t.type === 'leader_payout';
        if (filter === 'gold') return t.type === 'gold_order_commission';
        return true;
      });

  const l1Total = myTransactions.filter(t => t.type === 'commission_l1').reduce((s, t) => s + t.amount, 0);
  const l2Total = myTransactions.filter(t => t.type === 'commission_l2').reduce((s, t) => s + t.amount, 0);
  const leaderTotal = myTransactions.filter(t => t.type === 'leader_payout').reduce((s, t) => s + t.amount, 0);
  const goldTotal = myTransactions.filter(t => t.type === 'gold_order_commission').reduce((s, t) => s + t.amount, 0);
  const grandTotal = l1Total + l2Total + leaderTotal + goldTotal;

  const commissionCards = [
    { label: 'Level 1 Commission', sublabel: `${settings.level1Commission}% of direct referral contribution`, value: l1Total, icon: DollarSign, color: 'from-green-500 to-emerald-600' },
    { label: 'Level 2 Commission', sublabel: `${settings.level2Commission}% of L2 referral contribution`, value: l2Total, icon: TrendingUp, color: 'from-blue-500 to-indigo-600' },
    { label: 'Leader Income', sublabel: `${settings.leaderCommission}% of team income (monthly)`, value: leaderTotal, icon: Crown, color: 'from-amber-500 to-orange-600' },
    { label: 'Gold Order Commission', sublabel: `${settings.goldOrderCommission}% on referred gold orders`, value: goldTotal, icon: Gift, color: 'from-purple-500 to-violet-600' },
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'commission_l1': return 'Level 1';
      case 'commission_l2': return 'Level 2';
      case 'leader_payout': return 'Leader';
      case 'gold_order_commission': return 'Gold Order';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'commission_l1': return 'bg-green-100 text-green-700';
      case 'commission_l2': return 'bg-blue-100 text-blue-700';
      case 'leader_payout': return 'bg-amber-100 text-amber-700';
      case 'gold_order_commission': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Commissions</h1>
        <p className="text-gray-500 mt-1">Track all your commission earnings</p>
      </div>

      {/* Commission Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {commissionCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{card.value.toLocaleString()}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{card.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.sublabel}</p>
          </motion.div>
        ))}
      </div>

      {/* Grand Total */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
        <p className="text-sm text-amber-100">Total Commission Earned</p>
        <p className="text-4xl font-bold mt-1">₹{grandTotal.toLocaleString()}</p>
        <p className="text-sm text-amber-100 mt-2">All commission types combined</p>
      </div>

      {/* Filter + Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="font-semibold text-gray-900">Transaction History</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400" />
              {['all', 'l1', 'l2', 'leader', 'gold'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === f ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'l1' ? 'Level 1' : f === 'l2' ? 'Level 2' : f === 'leader' ? 'Leader' : 'Gold'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No commission transactions found</p>
            </div>
          ) : (
            filteredTransactions.map(tx => (
              <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor(tx.type)}`}>
                  {tx.type === 'leader_payout' ? <Crown className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTypeColor(tx.type)}`}>
                      {getTypeLabel(tx.type)}
                    </span>
                    <span className="text-xs text-gray-500">{tx.createdAt}</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-green-600">+₹{tx.amount.toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
