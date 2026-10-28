import { motion } from 'framer-motion';
import { Wallet, CheckCircle, XCircle, Clock, Download, Eye, Filter, DollarSign, TrendingUp } from 'lucide-react';
import { withdrawals as initialWithdrawals, users } from '../../data/mockData';
import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt: string;
  processedAt?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolder: string;
  };
}

export default function AdminWithdrawals() {
  const { showToast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    const stored = localStorage.getItem('admin_withdrawals');
    return stored ? JSON.parse(stored) : initialWithdrawals;
  });
  const [filter, setFilter] = useState('all');
  const [selectedWithdrawals, setSelectedWithdrawals] = useState<string[]>([]);
  const [viewingWithdrawal, setViewingWithdrawal] = useState<Withdrawal | null>(null);

  useEffect(() => {
    localStorage.setItem('admin_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  const filteredWithdrawals = withdrawals.filter(w => {
    if (filter === 'all') return true;
    return w.status === filter;
  });

  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter(w => w.status === 'pending').length,
    approved: withdrawals.filter(w => w.status === 'approved').length,
    rejected: withdrawals.filter(w => w.status === 'rejected').length,
    paid: withdrawals.filter(w => w.status === 'paid').length,
    totalPendingAmount: withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0),
    totalPaidAmount: withdrawals.filter(w => w.status === 'paid').reduce((sum, w) => sum + w.amount, 0),
  };

  const handleApprove = (id: string) => {
    setWithdrawals(withdrawals.map(w => 
      w.id === id ? { ...w, status: 'approved' as const, processedAt: new Date().toISOString().split('T')[0] } : w
    ));
    showToast('success', 'Withdrawal approved successfully');
  };

  const handleReject = (id: string) => {
    if (confirm('Are you sure you want to reject this withdrawal?')) {
      setWithdrawals(withdrawals.map(w => 
        w.id === id ? { ...w, status: 'rejected' as const, processedAt: new Date().toISOString().split('T')[0] } : w
      ));
      showToast('success', 'Withdrawal rejected');
    }
  };

  const handleMarkAsPaid = (id: string) => {
    setWithdrawals(withdrawals.map(w => 
      w.id === id ? { ...w, status: 'paid' as const } : w
    ));
    showToast('success', 'Withdrawal marked as paid');
  };

  const handleBulkApprove = () => {
    if (selectedWithdrawals.length === 0) {
      showToast('error', 'Please select withdrawals to approve');
      return;
    }
    setWithdrawals(withdrawals.map(w => 
      selectedWithdrawals.includes(w.id) ? { ...w, status: 'approved' as const, processedAt: new Date().toISOString().split('T')[0] } : w
    ));
    setSelectedWithdrawals([]);
    showToast('success', `${selectedWithdrawals.length} withdrawals approved`);
  };

  const handleBulkReject = () => {
    if (selectedWithdrawals.length === 0) {
      showToast('error', 'Please select withdrawals to reject');
      return;
    }
    if (confirm(`Are you sure you want to reject ${selectedWithdrawals.length} withdrawals?`)) {
      setWithdrawals(withdrawals.map(w => 
        selectedWithdrawals.includes(w.id) ? { ...w, status: 'rejected' as const, processedAt: new Date().toISOString().split('T')[0] } : w
      ));
      setSelectedWithdrawals([]);
      showToast('success', `${selectedWithdrawals.length} withdrawals rejected`);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedWithdrawals(prev => 
      prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedWithdrawals.length === filteredWithdrawals.length) {
      setSelectedWithdrawals([]);
    } else {
      setSelectedWithdrawals(filteredWithdrawals.map(w => w.id));
    }
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
    showToast('success', 'Withdrawals exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Withdrawals Management</h1>
          <p className="text-white/50 mt-1">Approve and manage withdrawal requests</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 rounded-2xl p-5"
        >
          <Clock className="w-8 h-8 text-yellow-400 mb-2" />
          <p className="text-2xl font-bold">{stats.pending}</p>
          <p className="text-xs text-white/50 mt-1">Pending Requests</p>
          <p className="text-sm text-yellow-400 mt-2">₹{stats.totalPendingAmount.toLocaleString()}</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 rounded-2xl p-5"
        >
          <CheckCircle className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold">{stats.approved}</p>
          <p className="text-xs text-white/50 mt-1">Approved</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 rounded-2xl p-5"
        >
          <DollarSign className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-2xl font-bold">₹{(stats.totalPaidAmount / 1000).toFixed(0)}K</p>
          <p className="text-xs text-white/50 mt-1">Total Paid</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 rounded-2xl p-5"
        >
          <TrendingUp className="w-8 h-8 text-purple-400 mb-2" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-white/50 mt-1">Total Requests</p>
        </motion.div>
      </div>

      {/* Bulk Actions */}
      {selectedWithdrawals.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between"
        >
          <span className="text-sm font-medium text-amber-300">
            {selectedWithdrawals.length} withdrawal(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkApprove}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
            >
              Approve Selected
            </button>
            <button
              onClick={handleBulkReject}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
            >
              Reject Selected
            </button>
            <button
              onClick={() => setSelectedWithdrawals([])}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </motion.div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-white/40" />
        <select 
          value={filter} 
          onChange={e => setFilter(e.target.value)} 
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50"
        >
          <option value="all">All Withdrawals</option>
          <option value="pending">Pending Only</option>
          <option value="approved">Approved Only</option>
          <option value="rejected">Rejected Only</option>
          <option value="paid">Paid Only</option>
        </select>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-white/50">
                <th className="px-6 py-4 font-medium">
                  <input
                    type="checkbox"
                    checked={selectedWithdrawals.length === filteredWithdrawals.length && filteredWithdrawals.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4"
                  />
                </th>
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
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedWithdrawals.includes(w.id)}
                        onChange={() => toggleSelect(w.id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">{w.id}</td>
                    <td className="px-6 py-4 text-sm">{user?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm font-bold">₹{w.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{w.createdAt}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        w.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        w.status === 'paid' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {w.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                         w.status === 'pending' ? <Clock className="w-3 h-3" /> :
                         w.status === 'paid' ? <DollarSign className="w-3 h-3" /> :
                         <XCircle className="w-3 h-3" />}
                        {w.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setViewingWithdrawal(w)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {w.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(w.id)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(w.id)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {w.status === 'approved' && (
                          <button 
                            onClick={() => handleMarkAsPaid(w.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Withdrawal Modal */}
      {viewingWithdrawal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setViewingWithdrawal(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-b from-slate-900 to-purple-950 rounded-2xl max-w-lg w-full p-6 border border-amber-500/20"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-6">Withdrawal Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-1">Withdrawal ID</p>
                  <p className="font-mono font-medium">{viewingWithdrawal.id}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-1">Amount</p>
                  <p className="text-xl font-bold text-green-400">₹{viewingWithdrawal.amount.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-1">User</p>
                  <p className="font-medium">{users.find(u => u.id === viewingWithdrawal.userId)?.name || 'Unknown'}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-1">Status</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    viewingWithdrawal.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    viewingWithdrawal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    viewingWithdrawal.status === 'paid' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {viewingWithdrawal.status}
                  </span>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-1">Requested Date</p>
                  <p className="font-medium">{viewingWithdrawal.createdAt}</p>
                </div>
                {viewingWithdrawal.processedAt && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50 mb-1">Processed Date</p>
                    <p className="font-medium">{viewingWithdrawal.processedAt}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setViewingWithdrawal(null)}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10"
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
