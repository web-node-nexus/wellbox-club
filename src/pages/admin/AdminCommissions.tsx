import { motion } from 'framer-motion';
import { Download, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  backfillCommissionsFromInvestments,
  fetchCommissions,
  type CommissionRecord,
} from '../../services/commissionService';
import { fetchAllMembers } from '../../services/memberDb';
import type { RegisteredUser } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminCommissions() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState('all');
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [members, setMembers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [backfilling, setBackfilling] = useState(false);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const [rows, people] = await Promise.all([fetchCommissions(), fetchAllMembers()]);
      setCommissions(rows);
      setMembers(people);
    } catch (e: any) {
      console.error(e);
      if (!quiet) showToast('error', e?.message || 'Could not load commissions from database');
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

  const filteredCommissions = commissions.filter(c => {
    if (filter === 'all') return true;
    return c.type === filter;
  });

  const nameFor = (userId: string) => {
    const m = members.find(u => u.id === userId);
    return m ? `${m.name} (${m.mobile})` : userId;
  };

  const exportCSV = () => {
    const csv =
      'ID,User ID,User,Type,Amount,Description,Date\n' +
      filteredCommissions
        .map(
          c =>
            `${c.id},${c.userId},"${nameFor(c.userId)}",${c.type},${c.amount},"${c.description}",${c.createdAt}`
        )
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'commissions.csv';
    a.click();
  };

  const handleBackfill = async () => {
    setBackfilling(true);
    try {
      const { created } = await backfillCommissionsFromInvestments();
      showToast(
        'success',
        created > 0
          ? `Backfilled ${created} commission row(s) from investments`
          : 'No missing commissions found — ledger already up to date'
      );
      await load(true);
    } catch (e: any) {
      showToast('error', e?.message || 'Backfill failed');
    } finally {
      setBackfilling(false);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'commission_l1':
        return 'Level 1';
      case 'commission_l2':
        return 'Level 2';
      case 'leader_payout':
        return 'Leader';
      case 'gold_order_commission':
        return 'Gold Order';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Commissions</h1>
          <p className="text-white/50 mt-1">Live from Supabase — L1 / L2 / Leader / Gold</p>
        </div>
        <div className="flex gap-2 flex-wrap">
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
            onClick={() => void handleBackfill()}
            disabled={backfilling}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-200 rounded-xl text-sm hover:bg-amber-500/30 disabled:opacity-50"
          >
            {backfilling ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
            Backfill Missing L1/L2
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

      <div className="flex items-center gap-3">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm"
        >
          <option value="all">All Commissions</option>
          <option value="commission_l1">Level 1</option>
          <option value="commission_l2">Level 2</option>
          <option value="leader_payout">Leader</option>
          <option value="gold_order_commission">Gold Order</option>
        </select>
        <span className="text-sm text-white/50">{filteredCommissions.length} rows</span>
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
              {loading && filteredCommissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    <Loader2 className="w-6 h-6 animate-spin inline" />
                  </td>
                </tr>
              ) : filteredCommissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/50">
                    No commissions yet. When a referral invests, L1/L2 appear here.
                    <br />
                    <span className="text-xs text-white/40">
                      If past investments are missing rows, click &quot;Backfill Missing L1/L2&quot;.
                    </span>
                  </td>
                </tr>
              ) : (
                filteredCommissions.map(c => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono">{c.id.slice(0, 12)}…</td>
                    <td className="px-6 py-4 text-sm">{nameFor(c.userId)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                        {getTypeLabel(c.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-400">
                      ₹{c.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">{c.description}</td>
                    <td className="px-6 py-4 text-sm">{c.createdAt}</td>
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
