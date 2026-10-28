import { motion } from 'framer-motion';
import { Users, Crown, Coins, DollarSign, Wallet, ShoppingBag, TrendingUp, Activity, Bell, ArrowUpRight, ArrowDownRight, Eye, Settings, AlertTriangle, CheckCircle, Clock, Zap, Target, Gift } from 'lucide-react';
import { users, contributions, walletTransactions, withdrawals, goldLeads, goldOrders } from '../../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const totalMembers = users.length;
  const totalLeaders = users.filter(u => u.isLeader).length;
  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
  const totalCommissions = walletTransactions.filter(t => t.type.includes('commission') || t.type === 'leader_payout').reduce((sum, t) => sum + t.amount, 0);
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
  const totalGoldLeads = goldLeads.length;
  const totalGoldOrders = goldOrders.length;

  const stats = [
    { label: 'Total Members', value: totalMembers, icon: Users, color: 'from-blue-500 to-cyan-600', change: '+12%', trend: 'up' },
    { label: 'Active Leaders', value: totalLeaders, icon: Crown, color: 'from-amber-500 to-orange-600', change: '+8%', trend: 'up' },
    { label: 'Total Contributions', value: `₹${(totalContributions / 1000).toFixed(0)}K`, icon: Coins, color: 'from-green-500 to-emerald-600', change: '+15%', trend: 'up' },
    { label: 'Commissions Paid', value: `₹${(totalCommissions / 1000).toFixed(0)}K`, icon: DollarSign, color: 'from-purple-500 to-pink-600', change: '+22%', trend: 'up' },
    { label: 'Pending Withdrawals', value: pendingWithdrawals, icon: Wallet, color: 'from-red-500 to-rose-600', change: '-5%', trend: 'down' },
    { label: 'Gold Orders', value: totalGoldOrders, icon: ShoppingBag, color: 'from-indigo-500 to-violet-600', change: '+18%', trend: 'up' },
  ];

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

  const recentActivities = [
    { id: 1, action: 'New member registered', user: 'Deepak Verma', time: '2 hours ago', icon: Users, color: 'bg-blue-500' },
    { id: 2, action: 'Withdrawal approved', user: 'Rajesh Kumar', time: '5 hours ago', icon: CheckCircle, color: 'bg-green-500' },
    { id: 3, action: 'Leader payout processed', user: 'Priya Sharma', time: '1 day ago', icon: Crown, color: 'bg-amber-500' },
    { id: 4, action: 'Gold order completed', user: 'Amit Patel', time: '2 days ago', icon: ShoppingBag, color: 'bg-purple-500' },
    { id: 5, action: 'New gold design added', user: 'Admin', time: '3 days ago', icon: Gift, color: 'bg-pink-500' },
  ];

  const topPerformers = users
    .filter(u => u.teamSize > 0)
    .sort((a, b) => b.teamSize - a.teamSize)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-white/50 mt-1">Platform overview and key metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">3</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
            <p className="text-xs text-white/50 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/users" className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-4 hover:border-blue-500/40 transition-all group">
          <Users className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-sm">Manage Users</p>
          <p className="text-xs text-white/50 mt-1">{totalMembers} total</p>
        </Link>
        <Link to="/admin/withdrawals" className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-4 hover:border-green-500/40 transition-all group">
          <Wallet className="w-8 h-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-sm">Withdrawals</p>
          <p className="text-xs text-white/50 mt-1">{pendingWithdrawals} pending</p>
        </Link>
        <Link to="/admin/gold-showroom" className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4 hover:border-amber-500/40 transition-all group">
          <ShoppingBag className="w-8 h-8 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-sm">Gold Showroom</p>
          <p className="text-xs text-white/50 mt-1">{totalGoldLeads} leads</p>
        </Link>
        <Link to="/admin/settings" className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4 hover:border-purple-500/40 transition-all group">
          <Settings className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-semibold text-sm">Settings</p>
          <p className="text-xs text-white/50 mt-1">Configure</p>
        </Link>
      </div>

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

      {/* Recent Activity & Top Performers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Activity</h3>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className={`w-10 h-10 ${activity.color} rounded-xl flex items-center justify-center`}>
                  <activity.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-white/50">{activity.user}</p>
                </div>
                <span className="text-xs text-white/40">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Performers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Top Performers</h3>
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-3">
            {topPerformers.map((user, i) => (
              <div key={user.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-purple-900 font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-white/50">{user.teamSize} team members</p>
                </div>
                {user.isLeader && (
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Leader
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pending Actions */}
      {pendingWithdrawals > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h3 className="font-semibold text-lg">Pending Actions</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-2xl font-bold text-amber-400">{pendingWithdrawals}</p>
              <p className="text-xs text-white/60 mt-1">Pending Withdrawals</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-2xl font-bold text-blue-400">{users.filter(u => !u.isLeader && u.teamSize >= 100).length}</p>
              <p className="text-xs text-white/60 mt-1">Ready for Leader Promotion</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-400">{goldLeads.filter(l => l.status === 'new').length}</p>
              <p className="text-xs text-white/60 mt-1">New Gold Leads</p>
            </div>
          </div>
          <Link to="/admin/withdrawals" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl text-sm font-medium transition-colors">
            <Eye className="w-4 h-4" />
            View All Pending Actions
          </Link>
        </motion.div>
      )}
    </div>
  );
}
