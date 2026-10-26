import { motion } from 'framer-motion';
import { Wallet, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { withdrawals, users } from '../../data/mockData';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function AdminWithdrawals() {
  const { showToast } = useToast();
  const [filter, setFilter] = useState('all');

  const filteredWithdrawals = withdrawals.filter(w => {
    if (filter === 'all') return true;
    return w.status === filter;
  });

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;
  const approvedCount = withdrawals.filter(w => w.status === 'approved').length;
  const totalPending = withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0);

  const handleApprove = (id: string) => {
    showToast('success', 'Withdrawal approved successfully', 'Success');
  };

  const handleReject = (id: string) => {
    showToast('error', 'Withdrawal rejected', 'Rejected');
  };

  const exportCSV = () => {
    const csv = 'ID,User ID,Amount,Status,Created At,Processed At\n' +
      filteredWithdrawals.map(w => `${w.id},${w.userId},${w.amount},${w.status},${w.createdAt},${w.processedAt || ''}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'withdrawals.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Withdrawals</h1>
          <p className="text-white/50 mt-1">Approve and manage withdrawal requests</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10">
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 rounded-2xl p-5">
          <Clock className="w-8 h-8 text-yellow-400 mb-2" />
          <p className="text-2xl font-bold">{pendingCount}</p>
          <p className="text-xs text-white/50 mt-1">Pending Requests</p>
          <p className="text-sm text-yellow-400 mt-2">₹{totalPending.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 rounded-2xl p-5">
          <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold">{approvedCount}</p>
          <p className="text-xs text-white/50 mt-1">Approved</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <Wallet className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-2xl font-bold">{withdrawals.length}</p>
          <p className="text-xs text-white/50 mt-1">Total Requests</p>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm">
          <option value="all">All Withdrawals</option>
          <option value="pending">Pending Only</option>
          <option value="approved">Approved Only</option>
          <option value="rejected">Rejected Only</option>
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
                <th className="px-6 py-4 font-medium">Requested</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredWithdrawals.map(w => {
                const user = users.find(u => u.id === w.userId);
                return (
                  <tr key={w.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono">{w.id}</td>
                    <td className="px-6 py-4 text-sm">{user?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm font-bold">₹{w.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{w.createdAt}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        w.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {w.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                         w.status === 'pending' ? <Clock className="w-3 h-3" /> :
                         <XCircle className="w-3 h-3" />}
                        {w.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {w.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleApprove(w.id)} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-medium transition-colors">
                            Approve
                          </button>
                          <button onClick={() => handleReject(w.id)} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-medium transition-colors">
                            Reject
                          </button>
                        </div>
                      )}
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
