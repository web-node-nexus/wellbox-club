import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, CheckCircle, XCircle, Clock, Download, Eye, Filter, DollarSign, TrendingUp, Search, Calendar, User, Copy, Check, AlertCircle, Ban, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
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
  upiId?: string;
  notes?: string;
}

export default function AdminWithdrawals() {
  const { showToast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    const stored = localStorage.getItem('admin_withdrawals');
    return stored ? JSON.parse(stored) : initialWithdrawals;
  });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedWithdrawals, setSelectedWithdrawals] = useState<string[]>([]);
  const [viewingWithdrawal, setViewingWithdrawal] = useState<Withdrawal | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    localStorage.setItem('admin_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  const filteredWithdrawals = withdrawals.filter(w => {
    const user = users.find(u => u.id === w.userId);
    const matchesSearch = search === '' || 
                         user?.name.toLowerCase().includes(search.toLowerCase()) ||
                         w.id.toLowerCase().includes(search.toLowerCase()) ||
                         w.amount.toString().includes(search);
    
    const matchesFilter = filter === 'all' || w.status === filter;
    
    const matchesDateRange = !dateRange.start || !dateRange.end || 
      (new Date(w.createdAt) >= new Date(dateRange.start) && 
       new Date(w.createdAt) <= new Date(dateRange.end));

    return matchesSearch && matchesFilter && matchesDateRange;
  });

  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter(w => w.status === 'pending').length,
    approved: withdrawals.filter(w => w.status === 'approved').length,
    rejected: withdrawals.filter(w => w.status === 'rejected').length,
    paid: withdrawals.filter(w => w.status === 'paid').length,
    totalPendingAmount: withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0),
    totalApprovedAmount: withdrawals.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.amount, 0),
    totalPaidAmount: withdrawals.filter(w => w.status === 'paid').reduce((sum, w) => sum + w.amount, 0),
    totalRejectedAmount: withdrawals.filter(w => w.status === 'rejected').reduce((sum, w) => sum + w.amount, 0),
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

  const handleBulkMarkAsPaid = () => {
    if (selectedWithdrawals.length === 0) {
      showToast('error', 'Please select withdrawals');
      return;
    }
    setWithdrawals(withdrawals.map(w => 
      selectedWithdrawals.includes(w.id) && w.status === 'approved' ? { ...w, status: 'paid' as const } : w
    ));
    setSelectedWithdrawals([]);
    showToast('success', `${selectedWithdrawals.length} withdrawals marked as paid`);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', 'Copied to clipboard');
  };

  const exportCSV = () => {
    const csv = 'ID,User,Amount,Status,Bank/UPI,Requested,Processed\n' +
      filteredWithdrawals.map(w => {
        const user = users.find(u => u.id === w.userId);
        const paymentMethod = w.bankDetails ? `${w.bankDetails.bankName} - ${w.bankDetails.accountNumber}` : w.upiId || 'N/A';
        return `${w.id},"${user?.name || 'Unknown'}",${w.amount},${w.status},"${paymentMethod}",${w.createdAt},${w.processedAt || ''}`;
      }).join('\n');
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
          <p className="text-sm text-green-400 mt-2">₹{stats.totalApprovedAmount.toLocaleString()}</p>
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
          <p className="text-sm text-blue-400 mt-2">{stats.paid} transactions</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/20 rounded-2xl p-5"
        >
          <XCircle className="w-8 h-8 text-red-400 mb-2" />
          <p className="text-2xl font-bold">{stats.rejected}</p>
          <p className="text-xs text-white/50 mt-1">Rejected</p>
          <p className="text-sm text-red-400 mt-2">₹{stats.totalRejectedAmount.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedWithdrawals.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between"
        >
          <span className="text-sm font-medium text-amber-300">
            {selectedWithdrawals.length} withdrawal(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkApprove}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve Selected
            </button>
            <button
              onClick={handleBulkReject}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject Selected
            </button>
            <button
              onClick={handleBulkMarkAsPaid}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Mark as Paid
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

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by user, ID, or amount..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50"
            />
          </div>
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)} 
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50"
          >
            <option value="all">All Withdrawals</option>
            <option value="pending">Pending Only</option>
            <option value="approved">Approved Only</option>
            <option value="rejected">Rejected Only</option>
            <option value="paid">Paid Only</option>
          </select>
          <input
            type="date"
            value={dateRange.start}
            onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50"
            placeholder="End Date"
          />
        </div>
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
                    className="w-4 h-4 rounded"
                  />
                </th>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Payment Method</th>
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
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">{w.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-purple-900 font-bold text-sm">
                          {user?.name.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user?.name || 'Unknown'}</p>
                          <p className="text-xs text-white/50">{user?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-400">₹{w.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      {w.bankDetails ? (
                        <div>
                          <p className="text-xs text-white/60">{w.bankDetails.bankName}</p>
                          <p className="text-xs font-mono">{w.bankDetails.accountNumber.slice(-4)}</p>
                        </div>
                      ) : w.upiId ? (
                        <p className="text-xs">{w.upiId}</p>
                      ) : (
                        <p className="text-xs text-white/40">N/A</p>
                      )}
                    </td>
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

      {filteredWithdrawals.length === 0 && (
        <div className="text-center py-12">
          <Wallet className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No withdrawals found</p>
        </div>
      )}

      {/* View Withdrawal Modal */}
      <AnimatePresence>
        {viewingWithdrawal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setViewingWithdrawal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-slate-900 to-purple-950 rounded-2xl max-w-2xl w-full p-6 border border-amber-500/20 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Withdrawal Details</h3>
                <button onClick={() => setViewingWithdrawal(null)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50 mb-1">Withdrawal ID</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-medium">{viewingWithdrawal.id}</p>
                      <button
                        onClick={() => copyToClipboard(viewingWithdrawal.id)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50 mb-1">Amount</p>
                    <p className="text-2xl font-bold text-green-400">₹{viewingWithdrawal.amount.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50 mb-1">User</p>
                    <p className="font-medium">{users.find(u => u.id === viewingWithdrawal.userId)?.name || 'Unknown'}</p>
                    <p className="text-xs text-white/50">{users.find(u => u.id === viewingWithdrawal.userId)?.phone}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50 mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      viewingWithdrawal.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      viewingWithdrawal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      viewingWithdrawal.status === 'paid' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {viewingWithdrawal.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                       viewingWithdrawal.status === 'pending' ? <Clock className="w-3 h-3" /> :
                       viewingWithdrawal.status === 'paid' ? <DollarSign className="w-3 h-3" /> :
                       <XCircle className="w-3 h-3" />}
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

                {/* Payment Details */}
                {(viewingWithdrawal.bankDetails || viewingWithdrawal.upiId) && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50 mb-3">Payment Details</p>
                    {viewingWithdrawal.bankDetails ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-white/60">Bank Name</span>
                          <span className="text-sm font-medium">{viewingWithdrawal.bankDetails.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-white/60">Account Number</span>
                          <span className="text-sm font-mono">{viewingWithdrawal.bankDetails.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-white/60">IFSC Code</span>
                          <span className="text-sm font-mono">{viewingWithdrawal.bankDetails.ifscCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-white/60">Account Holder</span>
                          <span className="text-sm font-medium">{viewingWithdrawal.bankDetails.accountHolder}</span>
                        </div>
                      </div>
                    ) : viewingWithdrawal.upiId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-white/60">UPI ID</span>
                        <span className="text-sm font-medium">{viewingWithdrawal.upiId}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes */}
                {viewingWithdrawal.notes && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50 mb-1">Notes</p>
                    <p className="text-sm">{viewingWithdrawal.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {viewingWithdrawal.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleApprove(viewingWithdrawal.id);
                          setViewingWithdrawal(null);
                        }}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleReject(viewingWithdrawal.id);
                          setViewingWithdrawal(null);
                        }}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </>
                  )}
                  {viewingWithdrawal.status === 'approved' && (
                    <button
                      onClick={() => {
                        handleMarkAsPaid(viewingWithdrawal.id);
                        setViewingWithdrawal(null);
                      }}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-5 h-5" />
                      Mark as Paid
                    </button>
                  )}
                  <button
                    onClick={() => setViewingWithdrawal(null)}
                    className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
