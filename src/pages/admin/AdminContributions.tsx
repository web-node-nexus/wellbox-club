import { motion } from 'framer-motion';
import { Coins, Lock, Unlock, Calendar, Download } from 'lucide-react';
import { contributions, users } from '../../data/mockData';
import { useState } from 'react';

export default function AdminContributions() {
  const [filter, setFilter] = useState('all');

  const filteredContributions = contributions.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
  const lockedAmount = contributions.filter(c => c.status === 'locked').reduce((sum, c) => sum + c.amount, 0);
  const unlockedAmount = contributions.filter(c => c.status === 'unlocked').reduce((sum, c) => sum + c.amount, 0);

  const exportCSV = () => {
    const csv = 'ID,User ID,Amount,Date,Locked Until,Status\n' +
      filteredContributions.map(c => `${c.id},${c.userId},${c.amount},${c.date},${c.lockedUntil},${c.status}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contributions.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contributions</h1>
          <p className="text-white/50 mt-1">Manage member contributions</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10">
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <Coins className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-2xl font-bold">₹{totalContributions.toLocaleString()}</p>
          <p className="text-xs text-white/50 mt-1">Total Contributions</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <Lock className="w-8 h-8 text-orange-400 mb-2" />
          <p className="text-2xl font-bold">₹{lockedAmount.toLocaleString()}</p>
          <p className="text-xs text-white/50 mt-1">Locked Amount</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <Unlock className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold">₹{unlockedAmount.toLocaleString()}</p>
          <p className="text-xs text-white/50 mt-1">Unlocked Amount</p>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm">
          <option value="all">All Contributions</option>
          <option value="locked">Locked Only</option>
          <option value="unlocked">Unlocked Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-white/50">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Locked Until</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredContributions.map(c => {
                const user = users.find(u => u.id === c.userId);
                return (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono">{c.id}</td>
                    <td className="px-6 py-4 text-sm">{user?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm font-bold">₹{c.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{c.date}</td>
                    <td className="px-6 py-4 text-sm">{c.lockedUntil}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        c.status === 'locked' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {c.status === 'locked' ? '🔒 Locked' : '🔓 Unlocked'}
                      </span>
                    </td>
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
