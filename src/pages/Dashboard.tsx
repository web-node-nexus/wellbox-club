import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Copy, Share2, CheckCircle, Wallet, Lock, Unlock, Calendar, TrendingUp, DollarSign, Users, Gift, ArrowUpRight, ArrowDownRight, Target, Zap, Award, Eye, Bell, Trophy, Star, Flame, Sparkles, Gem, QrCode, BarChart3, PieChart as PieChartIcon, Activity, Clock, Filter, Download, Plus, Minus, RefreshCw, ExternalLink, ChevronRight, Medal, Rocket, Briefcase } from 'lucide-react';
import { walletTransactions, contributions, getCommissionWalletBalance, getContributionWalletBalance, users } from '../data/mockData';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadialBarChart, RadialBar, Legend, BarChart, Bar } from 'recharts';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showQR, setShowQR] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'team'>('overview');
  
  if (!user) return null;

  const commissionBalance = getCommissionWalletBalance(user.id);
  const contributionBalance = getContributionWalletBalance(user.id);
  const myTransactions = walletTransactions.filter(t => t.userId === user.id);
  const myContributions = contributions.filter(c => c.userId === user.id);
  const teamMembers = users.filter(u => u.referredBy === user.id).length;
  
  const l1Income = myTransactions.filter(t => t.type === 'commission_l1').reduce((s, t) => s + t.amount, 0);
  const l2Income = myTransactions.filter(t => t.type === 'commission_l2').reduce((s, t) => s + t.amount, 0);
  const leaderIncome = myTransactions.filter(t => t.type === 'leader_payout').reduce((s, t) => s + t.amount, 0);
  const goldBonus = myTransactions.filter(t => t.type === 'gold_order_commission').reduce((s, t) => s + t.amount, 0);
  const totalEarnings = l1Income + l2Income + leaderIncome + goldBonus;

  const copyReferral = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register/${user.referralCode}`);
    setCopied(true);
    showToast('success', 'Referral link copied!', 'Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `Join Jewellbox Club and start earning with gold! Use my referral code: ${user.referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    showToast('success', 'Opening WhatsApp...', 'Share');
  };

  // Enhanced chart data
  const monthlyEarnings = [
    { month: 'Jan', l1: 1500, l2: 800, leader: 0, gold: 200 },
    { month: 'Feb', l1: 2000, l2: 1000, leader: 0, gold: 300 },
    { month: 'Mar', l1: 1800, l2: 900, leader: 0, gold: 250 },
    { month: 'Apr', l1: 2500, l2: 1200, leader: 0, gold: 400 },
    { month: 'May', l1: 2800, l2: 1400, leader: 0, gold: 350 },
    { month: 'Jun', l1: 3200, l2: 1600, leader: 0, gold: 400 },
  ];

  const incomeSplit = [
    { name: 'Level 1', value: l1Income, color: '#10b981' },
    { name: 'Level 2', value: l2Income, color: '#3b82f6' },
    { name: 'Leader', value: leaderIncome, color: '#f59e0b' },
    { name: 'Gold Bonus', value: goldBonus, color: '#8b5cf6' },
  ];

  const teamGrowth = [
    { month: 'Jan', members: 5, active: 4 },
    { month: 'Feb', members: 12, active: 10 },
    { month: 'Mar', members: 18, active: 15 },
    { month: 'Apr', members: 25, active: 22 },
    { month: 'May', members: 32, active: 28 },
    { month: 'Jun', members: teamMembers, active: Math.floor(teamMembers * 0.9) },
  ];

  // Weekly performance data
  const weeklyPerformance = [
    { day: 'Mon', earnings: 450, referrals: 2 },
    { day: 'Tue', earnings: 680, referrals: 3 },
    { day: 'Wed', earnings: 520, referrals: 1 },
    { day: 'Thu', earnings: 890, referrals: 4 },
    { day: 'Fri', earnings: 750, referrals: 2 },
    { day: 'Sat', earnings: 1200, referrals: 5 },
    { day: 'Sun', earnings: 980, referrals: 3 },
  ];

  // Performance metrics
  const performanceData = [
    { name: 'Target', value: 100, fill: '#f59e0b' },
    { name: 'Achieved', value: Math.min((teamMembers / 100) * 100, 100), fill: '#10b981' },
  ];

  const getNextPayoutDate = () => {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let payoutDate = new Date(year, month, 3);
    if (now > payoutDate) {
      month++;
      if (month > 11) { month = 0; year++; }
      payoutDate = new Date(year, month, 3);
    }
    return payoutDate;
  };
  const nextPayout = getNextPayoutDate();
  const daysUntilPayout = Math.ceil((nextPayout.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const notifications = [
    { id: 1, type: 'commission', title: 'Commission Credited', message: '₹500 Level 1 commission received', time: '2 hours ago', icon: DollarSign, color: 'text-green-400', unread: true },
    { id: 2, type: 'team', title: 'New Team Member', message: 'Priya Sharma joined your team', time: '5 hours ago', icon: Users, color: 'text-blue-400', unread: true },
    { id: 3, type: 'gold', title: 'Gold Order Bonus', message: '₹450 commission from gold order', time: '1 day ago', icon: Gift, color: 'text-purple-400', unread: false },
    { id: 4, type: 'achievement', title: 'Achievement Unlocked!', message: 'You earned 10 direct referrals', time: '2 days ago', icon: Trophy, color: 'text-amber-400', unread: false },
    { id: 5, type: 'payout', title: 'Leader Payout', message: '₹2,500 leader payout credited', time: '3 days ago', icon: Crown, color: 'text-yellow-400', unread: false },
  ];

  const achievements = [
    { id: 1, title: 'First Referral', description: 'Added your first team member', earned: true, icon: Star, reward: '₹100 Bonus' },
    { id: 2, title: 'Team Builder', description: 'Reached 10 team members', earned: teamMembers >= 10, icon: Users, reward: '₹500 Bonus' },
    { id: 3, title: 'Commission King', description: 'Earned ₹10,000 in commissions', earned: totalEarnings >= 10000, icon: DollarSign, reward: '₹1,000 Bonus' },
    { id: 4, title: 'Gold Expert', description: 'Completed 5 gold orders', earned: goldBonus > 0, icon: Award, reward: '₹750 Bonus' },
    { id: 5, title: 'Leader Status', description: 'Reached 100 team members', earned: user.isLeader, icon: Crown, reward: '5% Monthly Payout' },
    { id: 6, title: 'Top Performer', description: 'Earned ₹50,000 total', earned: totalEarnings >= 50000, icon: Medal, reward: '₹5,000 Bonus' },
  ];

  // Top team members
  const topTeamMembers = users
    .filter(u => u.referredBy === user.id)
    .sort((a, b) => b.teamSize - a.teamSize)
    .slice(0, 5);

  // Recent activities
  const recentActivities = [
    { id: 1, action: 'Commission earned', amount: 500, type: 'l1', time: '2 hours ago' },
    { id: 2, action: 'New referral joined', member: 'Amit Patel', time: '5 hours ago' },
    { id: 3, action: 'Gold order completed', amount: 450, type: 'bonus', time: '1 day ago' },
    { id: 4, action: 'Withdrawal processed', amount: 2000, type: 'withdrawal', time: '2 days ago' },
    { id: 5, action: 'Investment made', amount: 5000, type: 'investment', time: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold font-[var(--font-heading)] mb-2">
                Welcome back, {user.name.split(' ')[0]}! 👋
              </h1>
              <p className="text-white/80 text-lg">Your gold investment journey continues</p>
              {user.isLeader && (
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-xl border border-white/30">
                  <Crown className="w-5 h-5 text-amber-300" />
                  <span className="font-semibold">Leader Status Active</span>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyReferral} className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur transition-colors font-medium">
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? 'Copied!' : 'Copy Referral'}</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowQR(!showQR)} className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur transition-colors font-medium">
                <QrCode className="w-5 h-5" />
                <span>QR Code</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={shareWhatsApp} className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 rounded-xl transition-colors font-medium shadow-lg">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowNotifications(!showNotifications)} className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur transition-colors font-medium relative">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">{notifications.filter(n => n.unread).length}</span>
              </motion.button>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-sm text-white/70 mb-1">Your Referral Code</p>
            <p className="text-3xl font-bold font-mono">{user.referralCode}</p>
          </div>
        </div>

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-full right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl p-6 z-50"
            >
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Scan to Join</h3>
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Share this QR code with friends</p>
                <button onClick={() => setShowQR(false)} className="mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium">
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-between">
              <h3 className="font-bold">Notifications</h3>
              <button className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors">
                Mark all as read
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map(notif => (
                <div key={notif.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${notif.unread ? 'bg-blue-50/50' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100">
                      <notif.icon className={`w-5 h-5 ${notif.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="font-semibold text-gray-900 text-sm">{notif.title}</p>
                        {notif.unread && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notif.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white rounded-2xl p-2 border border-gray-100 shadow-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 shadow-lg'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Activity className="w-5 h-5 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 shadow-lg'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-5 h-5 inline mr-2" />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'team'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 shadow-lg'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-5 h-5 inline mr-2" />
          Team
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Leader Progress / Badge */}
          {!user.isLeader ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Target className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Leader Progress</h3>
                  <p className="text-white/70 text-sm">Build your team to 100 members to become a Leader!</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{teamMembers}</p>
                  <p className="text-xs text-white/70">/ 100 members</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-white/20 rounded-full h-4 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(teamMembers / 100) * 100}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-lg" />
                </div>
                <span className="text-lg font-bold">{Math.round((teamMembers / 100) * 100)}%</span>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-2xl p-6 text-purple-900 shadow-2xl">
              <div className="flex items-center gap-4">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center shadow-xl">
                  <Crown className="w-10 h-10" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold font-[var(--font-heading)]">Leader Status Active! 👑</h3>
                  <p className="text-purple-900/80">You're earning 5% monthly on your team's income</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold">Next payout in {daysUntilPayout} days</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/contributions">
              <motion.div whileHover={{ scale: 1.05, y: -5 }} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg cursor-pointer">
                <Plus className="w-8 h-8 mb-2" />
                <p className="font-bold">Invest Now</p>
                <p className="text-xs text-white/70">Start saving gold</p>
              </motion.div>
            </Link>
            <Link to="/wallet">
              <motion.div whileHover={{ scale: 1.05, y: -5 }} className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg cursor-pointer">
                <Wallet className="w-8 h-8 mb-2" />
                <p className="font-bold">Withdraw</p>
                <p className="text-xs text-white/70">Commission earnings</p>
              </motion.div>
            </Link>
            <Link to="/gold-showroom">
              <motion.div whileHover={{ scale: 1.05, y: -5 }} className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg cursor-pointer">
                <Gem className="w-8 h-8 mb-2" />
                <p className="font-bold">Buy Gold</p>
                <p className="text-xs text-white/70">Browse showroom</p>
              </motion.div>
            </Link>
            <Link to="/team">
              <motion.div whileHover={{ scale: 1.05, y: -5 }} className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white shadow-lg cursor-pointer">
                <Users className="w-8 h-8 mb-2" />
                <p className="font-bold">My Team</p>
                <p className="text-xs text-white/70">View network</p>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Level 1 Income', value: l1Income, icon: Users, color: 'from-green-500 to-emerald-600', link: '/income/level1' },
              { label: 'Level 2 Income', value: l2Income, icon: TrendingUp, color: 'from-purple-500 to-violet-600', link: '/income/level2' },
              { label: 'Leader Income', value: leaderIncome, icon: Crown, color: 'from-amber-500 to-orange-600', link: user.isLeader ? '/income/leader' : '#' },
              { label: 'Gold Order Bonus', value: goldBonus, icon: Gift, color: 'from-pink-500 to-rose-600', link: '/gold-showroom' },
              { label: 'Total Earnings', value: totalEarnings, icon: Zap, color: 'from-teal-500 to-cyan-600', link: '/commissions' },
              { label: 'Team Members', value: teamMembers, icon: Users, color: 'from-blue-500 to-indigo-600', link: '/team' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <Link to={stat.link} className="block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.label === 'Team Members' ? stat.value : <AnimatedCounter target={stat.value} prefix="₹" />}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 font-medium">{stat.label}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Wallet Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <Wallet className="w-10 h-10" />
                <Unlock className="w-6 h-6 text-green-200" />
              </div>
              <p className="text-sm text-green-100 font-medium">Commission Wallet</p>
              <p className="text-4xl font-bold mt-2">₹{commissionBalance.toLocaleString()}</p>
              <p className="text-sm text-green-200 mt-2">💰 Withdrawable anytime</p>
              <Link to="/wallet">
                <button className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-colors backdrop-blur">
                  Withdraw Now →
                </button>
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <Lock className="w-10 h-10" />
                <Lock className="w-6 h-6 text-blue-200" />
              </div>
              <p className="text-sm text-blue-100 font-medium">Contribution Wallet</p>
              <p className="text-4xl font-bold mt-2">₹{contributionBalance.toLocaleString()}</p>
              <p className="text-sm text-blue-200 mt-2">🔒 Locked for 12 months</p>
              <Link to="/gold-showroom" className="mt-4 block">
                <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                  <Gem className="w-5 h-5" />
                  Order Gold from Showroom
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                Achievements
              </h3>
              <span className="text-sm text-gray-500">{achievements.filter(a => a.earned).length}/{achievements.length} unlocked</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {achievements.map((achievement, i) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    achievement.earned
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 shadow-lg'
                      : 'bg-gray-50 border-gray-200 opacity-50'
                  }`}
                >
                  <achievement.icon className={`w-8 h-8 mx-auto mb-2 ${achievement.earned ? 'text-amber-500' : 'text-gray-400'}`} />
                  <p className="text-xs font-semibold text-center text-gray-900">{achievement.title}</p>
                  <p className="text-[10px] text-center text-gray-500 mt-1">{achievement.description}</p>
                  {achievement.earned && (
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-[10px] text-green-600 font-medium">{achievement.reward}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-500" />
                Recent Activity
              </h3>
              <Link to="/notifications" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, i) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === 'l1' || activity.type === 'bonus' ? 'bg-green-100' :
                    activity.type === 'withdrawal' ? 'bg-blue-100' :
                    activity.type === 'investment' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    {activity.type === 'l1' || activity.type === 'bonus' ? <ArrowDownRight className="w-5 h-5 text-green-600" /> :
                     activity.type === 'withdrawal' ? <ArrowUpRight className="w-5 h-5 text-blue-600" /> :
                     activity.type === 'investment' ? <Lock className="w-5 h-5 text-purple-600" /> :
                     <Users className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                  {activity.amount && (
                    <p className={`text-lg font-bold ${
                      activity.type === 'withdrawal' || activity.type === 'investment' ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {activity.type === 'withdrawal' || activity.type === 'investment' ? '-' : '+'}₹{activity.amount.toLocaleString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <>
          {/* Performance Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-6">
            {/* Weekly Performance */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Weekly Performance</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg">This Week</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
                  <Bar dataKey="earnings" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Earnings Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Earnings Breakdown</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyEarnings}>
                  <defs>
                    <linearGradient id="colorL1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorL2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="l1" stackId="1" stroke="#10b981" fillOpacity={1} fill="url(#colorL1)" />
                  <Area type="monotone" dataKey="l2" stackId="1" stroke="#3b82f6" fillOpacity={1} fill="url(#colorL2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Income Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Income Distribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={incomeSplit} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                    {incomeSplit.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                      <p className="text-xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600 font-semibold">+12%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Team Size</p>
                      <p className="text-xl font-bold text-gray-900">{teamMembers} members</p>
                    </div>
                  </div>
                  <span className="text-sm text-blue-600 font-semibold">+8%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg. Commission</p>
                      <p className="text-xl font-bold text-gray-900">₹{Math.round(totalEarnings / Math.max(teamMembers, 1)).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-sm text-amber-600 font-semibold">+15%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <>
          {/* Team Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
              <Users className="w-12 h-12 mb-4" />
              <p className="text-sm text-blue-100">Total Team</p>
              <p className="text-4xl font-bold mt-2">{teamMembers}</p>
              <p className="text-sm text-blue-200 mt-2">Direct & Indirect</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
              <Activity className="w-12 h-12 mb-4" />
              <p className="text-sm text-green-100">Active Members</p>
              <p className="text-4xl font-bold mt-2">{Math.floor(teamMembers * 0.9)}</p>
              <p className="text-sm text-green-200 mt-2">90% engagement</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
              <TrendingUp className="w-12 h-12 mb-4" />
              <p className="text-sm text-purple-100">Growth Rate</p>
              <p className="text-4xl font-bold mt-2">+25%</p>
              <p className="text-sm text-purple-200 mt-2">This month</p>
            </div>
          </motion.div>

          {/* Top Performers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Medal className="w-6 h-6 text-amber-500" />
                Top Performers
              </h3>
              <Link to="/team" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {topTeamMembers.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-purple-900 font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.teamSize} team members</p>
                  </div>
                  {member.isLeader && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3" /> Leader
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team Growth Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Team Growth</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={teamGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
                <Legend />
                <Line type="monotone" dataKey="members" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} name="Total Members" />
                <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} name="Active Members" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}
    </div>
  );
}
