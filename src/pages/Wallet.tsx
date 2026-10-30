import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowDownRight, ArrowUpRight, Send, CheckCircle, Clock, XCircle, Calendar, CreditCard, Building2, Smartphone, Download, Eye, X, Lock, Unlock, Gem, IndianRupee, AlertCircle, Plus } from 'lucide-react';
import { getCommissionWalletBalance, walletTransactions, withdrawals } from '../data/mockData';
import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';

export default function WalletPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolder: '',
  });
  const [upiId, setUpiId] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'commission' | 'investment'>('commission');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);

  if (!user) return null;

  const commissionBalance = getCommissionWalletBalance(user.id);
  
  // Get investment data from localStorage
  const monthlyInvestments = JSON.parse(localStorage.getItem(`investments_${user.id}`) || '[]');
  const totalInvested = monthlyInvestments.reduce((sum: number, inv: any) => sum + inv.amount, 0);
  
  const myTransactions = walletTransactions.filter(t => t.userId === user.id);
  const myWithdrawals = withdrawals.filter(w => w.userId === user.id);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(amount) > commissionBalance) {
      showToast('error', 'Insufficient commission balance', 'Error');
      return;
    }
    if (Number(amount) < 100) {
      showToast('error', 'Minimum withdrawal amount is ₹100', 'Error');
      return;
    }
    if (method === 'bank' && (!bankDetails.bankName || !bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolder)) {
      showToast('error', 'Please fill all bank details', 'Error');
      return;
    }
    if (method === 'upi' && !upiId) {
      showToast('error', 'Please enter UPI ID', 'Error');
      return;
    }

    showToast('success', 'Withdrawal request submitted successfully!', 'Success');
    setShowWithdraw(false);
    setAmount('');
    setBankDetails({ bankName: '', accountNumber: '', ifscCode: '', accountHolder: '' });
    setUpiId('');
  };

  const exportTransactions = () => {
    const csv = 'Date,Type,Description,Amount\n' +
      myTransactions.map(t => `${t.createdAt},${t.type},"${t.description}",${t.amount}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    showToast('success', 'Transactions exported successfully', 'Export');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Wallet & Withdraw</h1>
          <p className="text-white/50 mt-1">Manage your commission and investment wallets</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportTransactions}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </motion.button>
      </div>

      {/* Wallet Tabs */}
      <div className="flex gap-2 bg-white/5 rounded-2xl p-2 border border-white/10">
        <button
          onClick={() => setActiveTab('commission')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'commission'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Unlock className="w-5 h-5 inline mr-2" />
          Commission Wallet
        </button>
        <button
          onClick={() => setActiveTab('investment')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'investment'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Lock className="w-5 h-5 inline mr-2" />
          Investment Wallet
        </button>
      </div>

      {/* Commission Wallet */}
      {activeTab === 'commission' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl mb-6">
            <div className="flex items-center justify-between mb-6">
              <Wallet className="w-12 h-12" />
              <span className="text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur">Withdrawable</span>
            </div>
            <p className="text-sm text-green-100 font-medium">Available Commission Balance</p>
            <p className="text-5xl font-bold mt-2">₹{commissionBalance.toLocaleString()}</p>
            <p className="text-sm text-green-200 mt-3">💰 Withdraw anytime • Min ₹100 • Processed in 24-48 hrs</p>
            
            <div className="mt-4 p-4 bg-white/10 rounded-xl">
              <p className="text-xs text-green-100 mb-2 font-semibold">This wallet includes:</p>
              <ul className="text-xs text-green-100 space-y-1">
                <li>✓ Level 1 commissions (10%)</li>
                <li>✓ Level 2 commissions (5%)</li>
                <li>✓ Leader payouts (5%)</li>
                <li>✓ Gold order bonuses (4%)</li>
              </ul>
            </div>

            <div className="mt-6 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowWithdraw(!showWithdraw)}
                className="flex-1 py-4 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-lg transition-colors backdrop-blur"
              >
                Withdraw Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setPaymentAmount(1000);
                  setShowPaymentModal(true);
                }}
                className="flex-1 py-4 bg-white/30 hover:bg-white/40 rounded-xl font-semibold text-lg transition-colors backdrop-blur flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Funds
              </motion.button>
            </div>
          </div>

          {/* Withdraw Form */}
          <AnimatePresence>
            {showWithdraw && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden mb-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Withdraw Commission</h3>
                <form onSubmit={handleWithdraw} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      max={commissionBalance}
                      min={100}
                      placeholder={`Min: ₹100 | Max: ₹${commissionBalance.toLocaleString()}`}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      required
                    />
                    <div className="flex gap-2 mt-2">
                      {[1000, 5000, 10000, commissionBalance].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAmount(String(Math.min(val, commissionBalance)))}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors"
                        >
                          ₹{val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Method *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMethod('bank')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          method === 'bank' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Building2 className={`w-6 h-6 mx-auto mb-2 ${method === 'bank' ? 'text-amber-600' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${method === 'bank' ? 'text-amber-700' : 'text-gray-600'}`}>Bank Transfer</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMethod('upi')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          method === 'upi' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Smartphone className={`w-6 h-6 mx-auto mb-2 ${method === 'upi' ? 'text-amber-600' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${method === 'upi' ? 'text-amber-700' : 'text-gray-600'}`}>UPI</p>
                      </button>
                    </div>
                  </div>

                  {method === 'bank' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                        <input
                          type="text"
                          value={bankDetails.bankName}
                          onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                          placeholder="e.g., State Bank of India"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                          <input
                            type="text"
                            value={bankDetails.accountNumber}
                            onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                            placeholder="Enter account number"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                          <input
                            type="text"
                            value={bankDetails.ifscCode}
                            onChange={e => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                            placeholder="e.g., SBIN0001234"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                        <input
                          type="text"
                          value={bankDetails.accountHolder}
                          onChange={e => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                          placeholder="Enter account holder name"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {method === 'upi' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID *</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="e.g., username@paytm"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </motion.div>
                  )}

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> Withdrawal requests are processed within 24-48 hours. Amount will be transferred to your {method === 'bank' ? 'bank account' : 'UPI ID'}.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowWithdraw(false)}
                      className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Withdrawal History */}
          {myWithdrawals.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Withdrawal History</h3>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  {showHistory ? 'Hide' : 'View All'}
                </button>
              </div>
              <div className="space-y-3">
                {(showHistory ? myWithdrawals : myWithdrawals.slice(0, 3)).map(w => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">₹{w.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{w.createdAt}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                      w.status === 'approved' ? 'bg-green-100 text-green-700' :
                      w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {w.status === 'approved' ? <CheckCircle className="w-3 h-3" /> :
                       w.status === 'pending' ? <Clock className="w-3 h-3" /> :
                       <XCircle className="w-3 h-3" />}
                      {w.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Investment Wallet */}
      {activeTab === 'investment' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Investment Balance Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl mb-6">
            <div className="flex items-center justify-between mb-6">
              <Lock className="w-12 h-12" />
              <span className="text-sm bg-white/20 px-4 py-2 rounded-full backdrop-blur">Locked</span>
            </div>
            <p className="text-sm text-blue-100 font-medium">Total Investment Balance</p>
            <p className="text-5xl font-bold mt-2">₹{totalInvested.toLocaleString()}</p>
            <p className="text-sm text-blue-200 mt-3">🔒 Locked for minimum 12 months • Can order gold after lock period</p>
            
            <div className="mt-4 p-4 bg-white/10 rounded-xl">
              <p className="text-xs text-blue-100 mb-2 font-semibold">Investment Rules:</p>
              <ul className="text-xs text-blue-100 space-y-1">
                <li>✓ Minimum ₹1,000 per month (no maximum limit)</li>
                <li>✓ Locked for minimum 12 months (can extend)</li>
                <li>✓ Can order gold from showroom after lock</li>
                <li>✗ Cannot withdraw as cash</li>
                <li>✗ No early withdrawal allowed</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-amber-500/20 border border-amber-400/30 rounded-xl">
              <p className="text-xs text-amber-100">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                <strong>Important:</strong> Investment amount can only be used to order gold from our showroom after the 12-month lock period. Cash withdrawal is not available for investments.
              </p>
            </div>

            <Link to="/gold-showroom">
              <button className="mt-6 w-full py-4 bg-amber-500 hover:bg-amber-600 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2">
                <Gem className="w-5 h-5" />
                Order Gold from Showroom
              </button>
            </Link>
          </div>

          {/* Investment History */}
          {monthlyInvestments.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Investment History</h3>
              <div className="space-y-3">
                {monthlyInvestments.map((inv: any) => {
                  const daysLeft = Math.ceil((new Date(inv.lockedUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const isUnlocked = daysLeft <= 0;
                  
                  return (
                    <motion.div
                      key={inv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">₹{inv.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Invested on {inv.date}</p>
                      </div>
                      <div className="text-right">
                        {isUnlocked ? (
                          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <Unlock className="w-3 h-3" />
                            Unlocked - Order Gold
                          </span>
                        ) : (
                          <div>
                            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                              <Lock className="w-3 h-3" />
                              {daysLeft} days left
                            </span>
                            <p className="text-xs text-gray-500 mt-1">Unlocks: {inv.lockedUntil}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Transaction Ledger - Commission Only */}
      {activeTab === 'commission' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Commission Transaction Ledger</h3>
          <div className="space-y-2">
            {myTransactions.slice(0, 10).map(tx => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setViewingTransaction(tx)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === 'contribution' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {tx.type === 'contribution' ? <ArrowUpRight className="w-5 h-5 text-blue-600" /> : <ArrowDownRight className="w-5 h-5 text-green-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                  <p className="text-xs text-gray-500">{tx.createdAt}</p>
                </div>
                <p className={`text-sm font-bold ${tx.type === 'contribution' ? 'text-blue-600' : 'text-green-600'}`}>
                  {tx.type === 'contribution' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* View Transaction Modal */}
      <AnimatePresence>
        {viewingTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setViewingTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Transaction Details</h3>
                <button onClick={() => setViewingTransaction(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                    <p className="font-mono font-medium text-gray-900">{viewingTransaction.id}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                    <p className="text-xl font-bold text-green-600">₹{viewingTransaction.amount.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="font-medium text-gray-900">{viewingTransaction.type}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="font-medium text-gray-900">{viewingTransaction.createdAt}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="font-medium text-gray-900">{viewingTransaction.description}</p>
                </div>
                <button
                  onClick={() => setViewingTransaction(null)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={paymentAmount}
        description="Add funds to wallet"
        onSuccess={(response) => {
          console.log('Payment successful:', response);
          showToast('success', 'Funds added successfully!', 'Success');
          // Here you would typically update the wallet balance
          // For now, we'll just show a success message
        }}
        onFailure={(error) => {
          console.error('Payment failed:', error);
          showToast('error', 'Payment failed. Please try again.', 'Error');
        }}
      />
    </div>
  );
}
