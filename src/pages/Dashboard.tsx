import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Users, DollarSign, Wallet, TrendingUp, Crown, ArrowUpRight, ArrowDownRight, Gem, Copy, CheckCircle } from 'lucide-react';
import { walletTransactions, contributions, getCommissionWalletBalance, getContributionWalletBalance, getDirectReferrals, users } from '../data/mockData';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  if (!user) return null;

  const commissionBalance = getCommissionWalletBalance(user.id);
  const contributionBalance = getContributionWalletBalance(user.id);
  const myTransactions = walletTransactions.filter(t => t.userId === user.id);
  const myContributions = contributions.filter(c => c.userId === user.id);
  const directReferrals = getDirectReferrals(user.id);
  const totalCommission = myTransactions.filter(t => t.wallet === 'commission').reduce((s, t) => s + t.amount, 0);
  const teamMembers = users.filter(u => u.referredBy === user.id).length;

  const copyReferral = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register/${user.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: 'Commission Wallet', value: `₹${commissionBalance.toLocaleString()}`, icon: Wallet, color: 'from-green-500 to-emerald-600', change: '+12%' },
    { label: 'Contribution Wallet', value: `₹${contributionBalance.toLocaleString()}`, icon: DollarSign, color: 'from-blue-500 to-indigo-600', change: '+8%' },
    { label: 'Team Members', value: teamMembers.toString(), icon: Users, color: 'from-purple-500 to-violet-600', change: '+3' },
    { label: 'Total Earned', value: `₹${totalCommission.toLocaleString()}`, icon: TrendingUp, color: 'from-amber-500 to-orange-600', change: '+15%' },
  ];

  const recentActivity = myTransactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your portfolio overview</p>
        </div>
        {user.isLeader && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl border border-yellow-200">
            <Crown className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-700">Leader Status</span>
          </div>
        )}
      </div>

      {/* Referral Link */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-5 text-white"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm text-amber-100">Your Referral Link</p>
            <p className="font-mono text-sm mt-1 opacity-90 break-all">{window.location.origin}/register/{user.referralCode}</p>
          </div>
          <button
            onClick={copyReferral}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                <ArrowUpRight className="w-3 h-3" />{stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/wallet" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Withdraw Commission</p>
                <p className="text-xs text-gray-500">Available: ₹{commissionBalance.toLocaleString()}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
            </Link>
            <Link to="/gold-showroom" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Gem className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Browse Gold</p>
                <p className="text-xs text-gray-500">Direct from manufacturer</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
            </Link>
            <Link to="/referrals" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Invite Members</p>
                <p className="text-xs text-gray-500">{directReferrals.length} direct referrals</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 ml-auto" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            <Link to="/commissions" className="text-sm text-amber-600 hover:text-amber-700 font-medium">View All</Link>
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No activity yet</p>
            ) : (
              recentActivity.map(tx => (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    tx.type.includes('commission') || tx.type === 'leader_payout' || tx.type === 'gold_order_commission'
                      ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {tx.type.includes('commission') || tx.type === 'leader_payout' || tx.type === 'gold_order_commission'
                      ? <ArrowDownRight className="w-4 h-4 text-green-600" />
                      : <ArrowUpRight className="w-4 h-4 text-blue-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{tx.description}</p>
                    <p className="text-xs text-gray-500">{tx.createdAt}</p>
                  </div>
                  <p className={`text-sm font-semibold ${
                    tx.type.includes('commission') || tx.type === 'leader_payout' || tx.type === 'gold_order_commission'
                      ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    +₹{tx.amount.toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Contributions Overview */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">My Contributions</h3>
          <Link to="/contributions" className="text-sm text-amber-600 hover:text-amber-700 font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Lock Period</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myContributions.slice(0, 4).map(c => (
                <tr key={c.id} className="text-sm">
                  <td className="py-3 text-gray-900">{c.date}</td>
                  <td className="py-3 font-medium text-gray-900">₹{c.amount.toLocaleString()}</td>
                  <td className="py-3 text-gray-500">Until {c.lockedUntil}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      c.status === 'locked' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {c.status === 'locked' ? '🔒 Locked' : '🔓 Unlocked'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leader Progress */}
      {!user.isLeader && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-6 h-6 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Leader Progress</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Build your team to 100 members to become a Leader and earn monthly payouts!</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-purple-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min((teamMembers / 100) * 100, 100)}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-purple-700">{teamMembers}/100</span>
          </div>
        </div>
      )}
    </div>
  );
}
