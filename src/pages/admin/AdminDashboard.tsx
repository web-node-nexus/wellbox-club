import { motion } from 'framer-motion';
import { Users, Crown, Coins, DollarSign, Wallet, ShoppingBag, TrendingUp, Activity } from 'lucide-react';
import { users, contributions, walletTransactions, withdrawals, goldLeads } from '../../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const totalMembers = users.length;
  const totalLeaders = users.filter(u => u.isLeader).length;
  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
  const totalCommissions = walletTransactions.filter(t => t.type.includes('commission') || t.type === 'leader_payout').reduce((sum, t) => sum + t.amount, 0);
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
  const totalGoldLeads = goldLeads.length;

  const stats = [
    { label: 'Total Members', value: totalMembers, icon: Users, color: 'from-blue-500 to-cyan-600', change: '+12%' },
    { label: 'Active Leaders', value: totalLeaders, icon: Crown, color: 'from-amber-500 to-orange-600', change: '+8%' },
    { label: 'Total Contributions', value: `₹${(totalContributions / 1000).toFixed(0)}K`, icon: Coins, color: 'from-green-500 to-emerald-600', change: '+15%' },
    { label: 'Commissions Paid', value: `₹${(totalCommissions / 1000).toFixed(0)}K`, icon: DollarSign, color: 'from-purple-500 to-pink-600', change: '+22%' },
    { label: 'Pending Withdrawals', value: pendingWithdrawals, icon: Wallet, color: 'from-red-500 to-rose-600', change: '-5%' },
    { label: 'Gold Leads', value: totalGoldLeads, icon: ShoppingBag, color: 'from-indigo-500 to-violet-600', change: '+18%' },
  ];

  // Chart data
  const monthlyData = [
    { month: 'Jan', members: 120, contributions: 45000, commissions: 12000 },
    { month: 'Feb', members: 180, contributions: 62000, commissions: 18500 },
    { month: 'Mar', members: 250, contributions: 78000, commissions: 24000 },
    { month: 'Apr', members: 320, contributions: 95000, commissions: 31000 },
    { month: 'May', members: 410, contributions: 115000, commissions: 38500 },
    { month: 'Jun', members: 520, contributions: 142000, commissions: 47000 },
  ];

  const commissionBreakdown = [
    { name: 'Level 1', value: 45, color: '#10b981' },
    { name: 'Level 2', value: 25, color: '#3b82f6' },
    { name: 'Leader', value: 20, color: '#f59e0b' },
    { name: 'Gold Orders', value: 10, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-white/50 mt-1">Platform overview and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-green-400">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
            <p className="text-xs text-white/50 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Leader & Member Management - Highlighted */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 backdrop-blur border-2 border-amber-500/30 rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-xl">
            <Crown className="w-7 h-7 text-purple-900" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Leader & Member Management</h3>
            <p className="text-white/60">Admin controls for team hierarchy</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Leader Rules */}
          <div className="bg-white/5 rounded-xl p-5 border border-amber-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-6 h-6 text-amber-400" />
              <h4 className="font-bold text-amber-400">Leader Rules</h4>
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>100 members required to become Leader</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>10+ direct members for income</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>5% monthly team income</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Payout on 3rd of every month</span>
              </li>
            </ul>
          </div>

          {/* Admin Actions */}
          <div className="bg-white/5 rounded-xl p-5 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-6 h-6 text-purple-400" />
              <h4 className="font-bold text-purple-400">Admin Actions</h4>
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Promote members to Leader</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>View all member details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Approve withdrawals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>Manage gold showroom</span>
              </li>
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/5 rounded-xl p-5 border border-green-500/20">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <h4 className="font-bold text-green-400">Current Status</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Total Members</span>
                <span className="text-lg font-bold text-green-400">{totalMembers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Active Leaders</span>
                <span className="text-lg font-bold text-amber-400">{totalLeaders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/70">Pending Promotions</span>
                <span className="text-lg font-bold text-purple-400">
                  {users.filter(u => !u.isLeader && u.teamSize >= 100).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Manage Leaders
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            Manage Members
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 flex items-center gap-2"
          >
            <Activity className="w-5 h-5" />
            View Audit Logs
          </motion.button>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Platform Growth</h3>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="members" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMembers)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Commission Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Commission Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={commissionBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {commissionBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {commissionBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-white/60">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px' }} />
              <Bar dataKey="contributions" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="commissions" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Activity</h3>
          <Activity className="w-5 h-5 text-amber-400" />
        </div>
        <div className="space-y-3">
          {[
            { action: 'New member registered', user: 'Deepak Verma', time: '2 hours ago', color: 'bg-blue-500' },
            { action: 'Withdrawal approved', user: 'Rajesh Kumar', time: '5 hours ago', color: 'bg-green-500' },
            { action: 'Leader payout processed', user: 'Priya Sharma', time: '1 day ago', color: 'bg-amber-500' },
            { action: 'Gold order completed', user: 'Amit Patel', time: '2 days ago', color: 'bg-purple-500' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <div className={`w-2 h-2 ${activity.color} rounded-full`} />
              <div className="flex-1">
                <p className="text-sm">{activity.action}</p>
                <p className="text-xs text-white/50">{activity.user}</p>
              </div>
              <span className="text-xs text-white/40">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
