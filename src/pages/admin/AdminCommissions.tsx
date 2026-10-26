import { motion } from 'framer-motion';
import { DollarSign, Download } from 'lucide-react';
import { walletTransactions, users } from '../../data/mockData';
import { useState } from 'react';

export default function AdminCommissions() {
  const [filter, setFilter] = useState('all');

  const commissions = walletTransactions.filter(t => 
    t.type.includes('commission') || t.type === 'leader_payout' || t.type === 'gold_order_commission'
  );

  const filteredCommissions = commissions.filter(c => {
    if (filter === 'all') return true;
    return c.type === filter;
  });

  const exportCSV = () => {
    const csv = 'ID,User ID,Type,Amount,Description,Date\n' +
      filteredCommissions.map(c => `${c.id},${c.userId},${c.type},${c.amount},"${c.description}",${c.createdAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'commissions.csv';
    a.click();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'commission_l1': return 'Level 1';
      case 'commission_l2': return 'Level 2';
      case 'leader_payout': return 'Leader';
      case 'gold_order_commission': return 'Gold Order';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Commissions</h1>
          <p className="text-white/50 mt-1">Track all commission payouts</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10">
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      <div className="flex items-center gap-3">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm">
          <option value="all">All Commissions</option>
          <option value="commission_l1">Level 1</option>
          <option value="commission_l2">Level 2</option>
          <option value="leader_payout">Leader</option>
          <option value="gold_order_commission">Gold Order</option>
        </select>
      </div>

      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-white/50">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCommissions.map(c => {
                const user = users.find(u => u.id === c.userId);
                return (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono">{c.id}</td>
                    <td className="px-6 py-4 text-sm">{user?.name || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                        {getTypeLabel(c.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-400">₹{c.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{c.description}</td>
                    <td className="px-6 py-4 text-sm">{c.createdAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
