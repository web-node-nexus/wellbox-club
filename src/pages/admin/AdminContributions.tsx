import { motion } from 'framer-motion';
import { Coins, Lock, Unlock, Download, Loader2, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { fetchAllInvestments, type Investment } from '../../services/investmentService';
import { fetchAllMembers } from '../../services/memberDb';
import type { RegisteredUser } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminContributions() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState('all');
  const [rows, setRows] = useState<Investment[]>([]);
  const [members, setMembers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const [invs, people] = await Promise.all([fetchAllInvestments(), fetchAllMembers()]);
      setRows(invs);
      setMembers(people);
    } catch (e: any) {
      console.error(e);
      if (!quiet) showToast('error', e?.message || 'Could not load contributions from database');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void load();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void load(true);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [load]);

  const filteredContributions = rows.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  const totalContributions = rows.reduce((sum, c) => sum + c.amount, 0);
  const lockedAmount = rows.filter(c => c.status === 'locked').reduce((sum, c) => sum + c.amount, 0);
  const unlockedAmount = rows
    .filter(c => c.status === 'unlocked')
    .reduce((sum, c) => sum + c.amount, 0);

  const nameFor = (userId: string, mobile?: string) => {
    const m =
      members.find(u => u.id === userId) ||
      (mobile ? members.find(u => u.mobile === mobile) : undefined);
    return m ? `${m.name} (${m.mobile})` : mobile || userId;
  };

  const exportCSV = () => {
    const csv =
      'ID,User ID,User,Amount,Date,Locked Until,Status\n' +
      filteredContributions
        .map(
          c =>
            `${c.id},${c.userId},"${nameFor(c.userId, c.mobile)}",${c.amount},${c.date},${c.lockedUntil},${c.status}`
        )
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contributions.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Contributions</h1>
          <p className="text-white/50 mt-1">Live investments from Supabase</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => void load()}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5"
        >
          <Coins className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-2xl font-bold">₹{totalContributions.toLocaleString()}</p>
          <p className="text-xs text-white/50 mt-1">Total Contributions</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5"
        >
          <Lock className="w-8 h-8 text-orange-400 mb-2" />
          <p className="text-2xl font-bold">₹{lockedAmount.toLocaleString()}</p>
          <p className="text-xs text-white/50 mt-1">Locked Amount</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5"
        >
          <Unlock className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold">₹{unlockedAmount.toLocaleString()}</p>
          <p className="text-xs text-white/50 mt-1">Unlocked Amount</p>
        </motion.div>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm"
        >
          <option value="all">All Contributions</option>
          <option value="locked">Locked Only</option>
          <option value="unlocked">Unlocked Only</option>
          <option value="used">Used (Gold)</option>
        </select>
        <span className="text-sm text-white/50">{filteredContributions.length} rows</span>
      </div>

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
              {loading && filteredContributions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    <Loader2 className="w-6 h-6 animate-spin inline" />
                  </td>
                </tr>
              ) : filteredContributions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/50">
                    No contributions in database yet
                  </td>
                </tr>
              ) : (
                filteredContributions.map(c => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono">{c.id.slice(0, 14)}…</td>
                    <td className="px-6 py-4 text-sm">{nameFor(c.userId, c.mobile)}</td>
                    <td className="px-6 py-4 text-sm font-bold">₹{c.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{c.date}</td>
                    <td className="px-6 py-4 text-sm">{c.lockedUntil}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          c.status === 'locked'
                            ? 'bg-orange-500/20 text-orange-400'
                            : c.status === 'used'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-green-500/20 text-green-400'
                        }`}
                      >
                        {c.status === 'locked'
                          ? '🔒 Locked'
                          : c.status === 'used'
                            ? '💎 Used'
                            : '🔓 Unlocked'}
                      </span>
                    </td>
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
