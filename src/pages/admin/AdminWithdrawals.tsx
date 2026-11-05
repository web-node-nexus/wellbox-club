import { motion } from 'framer-motion';
import {
  CheckCircle, XCircle, Clock, Download, Eye, DollarSign, RefreshCw, Loader2, X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  fetchWithdrawals,
  updateWithdrawalStatus,
  type WithdrawalRecord,
} from '../../services/withdrawalService';
import { fetchAllMembers } from '../../services/memberDb';
import type { RegisteredUser } from '../../context/AuthContext';

export default function AdminWithdrawals() {
  const { showToast } = useToast();
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [members, setMembers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState<WithdrawalRecord | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const [rows, people] = await Promise.all([fetchWithdrawals(), fetchAllMembers()]);
      setWithdrawals(rows);
      setMembers(people);
    } catch (e: any) {
      if (!quiet) {
        showToast(
          'error',
          e?.message || 'Could not load withdrawals. Run supabase/withdrawals_migration.sql if table is missing.'
        );
      }
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

  const nameFor = (userId: string, mobile?: string) => {
    const m = members.find(u => u.id === userId) || members.find(u => u.mobile === mobile);
    return m ? `${m.name} (${m.mobile})` : mobile || userId;
  };

  const filtered = withdrawals.filter(w => {
    const label = nameFor(w.userId, w.userMobile).toLowerCase();
    const matchesSearch =
      !search ||
      label.includes(search.toLowerCase()) ||
      w.id.toLowerCase().includes(search.toLowerCase()) ||
      String(w.amount).includes(search);
    const matchesFilter = filter === 'all' || w.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    pending: withdrawals.filter(w => w.status === 'pending').length,
    pendingAmt: withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0),
    paidAmt: withdrawals.filter(w => w.status === 'paid').reduce((s, w) => s + w.amount, 0),
  };

  const setStatus = async (id: string, status: WithdrawalRecord['status']) => {
    if (status === 'rejected' && !confirm('Reject this withdrawal?')) return;
    setBusyId(id);
    try {
      const saved = await updateWithdrawalStatus(id, status);
      setWithdrawals(prev => prev.map(w => (w.id === id ? saved : w)));
      showToast(
        'success',
        status === 'paid'
          ? 'Marked paid — confirm you transferred via bank/UPI/RazorpayX'
          : `Withdrawal ${status}`
      );
      if (viewing?.id === id) setViewing(saved);
    } catch (e: any) {
      showToast('error', e?.message || 'Update failed');
    } finally {
      setBusyId(null);
    }
  };

  const exportCSV = () => {
    const csv =
      'ID,User,Mobile,Amount,Method,Status,Bank/UPI,Requested,Processed\n' +
      filtered
        .map(w => {
          const pay =
            w.method === 'upi'
              ? w.upiId
              : `${w.bankName} ${w.accountNumber} ${w.ifscCode}`;
          return `${w.id},"${nameFor(w.userId, w.userMobile)}",${w.userMobile},${w.amount},${w.method},${w.status},"${pay}",${w.createdAt},${w.processedAt || ''}`;
        })
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'withdrawals.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Withdrawals</h1>
          <p className="text-white/50 mt-1">
            Live requests — pay to member bank/UPI, then mark Paid
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => void load()}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          <p className="text-xs text-white/50">Pending requests</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-2xl font-bold">₹{stats.pendingAmt.toLocaleString()}</p>
          <p className="text-xs text-white/50">Pending amount</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-2xl font-bold text-green-400">₹{stats.paidAmt.toLocaleString()}</p>
          <p className="text-xs text-white/50">Paid total</p>
        </div>
      </div>

      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-100">
        Razorpay Checkout collects money <strong>into</strong> Jewellbox. Paying members out needs
        RazorpayX / bank NEFT from your business account. Until RazorpayX API is connected: Approve →
        transfer manually → Mark Paid.
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, mobile, id…"
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm flex-1 min-w-[200px]"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 text-xs text-white/50 text-left">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payout to</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-white/40">
                    <Loader2 className="w-6 h-6 animate-spin inline" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-white/50">
                    No withdrawal requests yet
                  </td>
                </tr>
              ) : (
                filtered.map(w => (
                  <tr key={w.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-sm">{nameFor(w.userId, w.userMobile)}</td>
                    <td className="px-4 py-3 text-sm font-bold text-green-400">
                      ₹{w.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-white/70">
                      {w.method === 'upi' ? (
                        w.upiId
                      ) : (
                        <>
                          <div>{w.bankName}</div>
                          <div className="font-mono">
                            {w.accountNumber} · {w.ifscCode}
                          </div>
                          <div>{w.accountHolder}</div>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-white/10">{w.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{w.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => setViewing(w)}
                          className="p-2 hover:bg-white/10 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {w.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              disabled={busyId === w.id}
                              onClick={() => void setStatus(w.id, 'approved')}
                              className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={busyId === w.id}
                              onClick={() => void setStatus(w.id, 'rejected')}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {(w.status === 'pending' || w.status === 'approved') && (
                          <button
                            type="button"
                            disabled={busyId === w.id}
                            onClick={() => void setStatus(w.id, 'paid')}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                            title="Mark paid after transfer"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {viewing && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Withdrawal details</h3>
              <button type="button" onClick={() => setViewing(null)} className="p-2 hover:bg-white/10 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-2xl font-bold text-green-400">₹{viewing.amount.toLocaleString()}</p>
            <p className="text-sm text-white/60 mt-1">{nameFor(viewing.userId, viewing.userMobile)}</p>
            <p className="text-sm mt-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> {viewing.status} · {viewing.createdAt}
            </p>
            <div className="mt-4 p-3 bg-white/5 rounded-xl text-sm space-y-1">
              {viewing.method === 'upi' ? (
                <p>UPI: <span className="font-mono">{viewing.upiId}</span></p>
              ) : (
                <>
                  <p>{viewing.accountHolder}</p>
                  <p>{viewing.bankName}</p>
                  <p className="font-mono">{viewing.accountNumber}</p>
                  <p className="font-mono">{viewing.ifscCode}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
