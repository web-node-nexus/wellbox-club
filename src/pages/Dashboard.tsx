import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Crown, Copy, Share2, CheckCircle, Wallet, Lock, Unlock, Calendar, TrendingUp, DollarSign, Users, Gift, ArrowUpRight } from 'lucide-react';
import { walletTransactions, contributions, getCommissionWalletBalance, getContributionWalletBalance, users } from '../data/mockData';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useToast } from '../context/ToastContext';

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
    const text = `Join Jwellbox Club and start earning with gold! Use my referral code: ${user.referralCode}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Chart data
  const monthlyEarnings = [
    { month: 'Jan', amount: 2500 }, { month: 'Feb', amount: 3200 }, { month: 'Mar', amount: 2800 },
    { month: 'Apr', amount: 4100 }, { month: 'May', amount: 3800 }, { month: 'Jun', amount: 5200 },
  ];
  const incomeSplit = [
    { name: 'Level 1', value: l1Income, color: '#10b981' },
    { name: 'Level 2', value: l2Income, color: '#3b82f6' },
    { name: 'Leader', value: leaderIncome, color: '#f59e0b' },
    { name: 'Gold Bonus', value: goldBonus, color: '#8b5cf6' },
  ];
  const teamGrowth = [
    { month: 'Jan', members: 5 }, { month: 'Feb', members: 12 }, { month: 'Mar', members: 18 },
    { month: 'Apr', members: 25 }, { month: 'May', members: 32 }, { month: 'Jun', members: teamMembers },
  ];

  // Next leader payout countdown
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

  const statCards = [
    { label: 'Own Contribution', value: contributionBalance, icon: DollarSign, color: 'from-blue-500 to-indigo-600' },
    { label: 'Level 1 Income', value: l1Income, icon: Users, color: 'from-green-500 to-emerald-600' },
    { label: 'Level 2 Income', value: l2Income, icon: TrendingUp, color: 'from-purple-500 to-violet-600' },
    { label: 'Leader Income', value: leaderIncome, icon: Crown, color: 'from-amber-500 to-orange-600' },
    { label: 'Gold Order Bonus', value: goldBonus, icon: Gift, color: 'from-pink-500 to-rose-600' },
    { label: 'Total Earnings', value: totalEarnings, icon: TrendingUp, color: 'from-teal-500 to-cyan-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-2xl p-6 text-purple-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-2xl lg:text-3xl font-bold font-[var(--font-heading)] mb-2">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-purple-900/70 mb-4">Here's your portfolio overview</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium text-purple-900/60 mb-1">Your Referral Code</p>
              <p className="text-2xl font-bold font-mono">{user.referralCode}</p>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyReferral} className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur transition-colors">
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={shareWhatsApp} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Leader Badge / Progress */}
      {!user.isLeader ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-6 h-6 text-purple-400" />
            <h3 className="font-semibold text-lg">Leader Progress</h3>
          </div>
          <p className="text-sm text-white/60 mb-3">Build your team to 100 members to become a Leader!</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-white/10 rounded-full h-3">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(teamMembers / 100) * 100}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} className="h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            </div>
            <span className="text-sm font-bold text-purple-400">{teamMembers}/100</span>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl p-6 border border-amber-500/30 glow-gold">
          <div className="flex items-center gap-4">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/30 pulse-glow">
              <Crown className="w-8 h-8 text-purple-900" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold gradient-text">Leader Status Active!</h3>
              <p className="text-sm text-white/60">You're earning 5% monthly on your team's income</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition-all">
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold">
              <AnimatedCounter target={stat.value} prefix="₹" />
            </p>
            <p className="text-xs text-white/50 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Wallet Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-8 h-8" />
            <Unlock className="w-5 h-5 text-green-200" />
          </div>
          <p className="text-sm text-green-100">Commission Wallet</p>
          <p className="text-3xl font-bold mt-1">₹{commissionBalance.toLocaleString()}</p>
          <p className="text-xs text-green-200 mt-2 mb-4">Withdrawable anytime</p>
          <button className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur">
            Withdraw Now
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Lock className="w-8 h-8" />
            <Lock className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-sm text-blue-100">Contribution Wallet</p>
          <p className="text-3xl font-bold mt-1">₹{contributionBalance.toLocaleString()}</p>
          <p className="text-xs text-blue-200 mt-2 mb-4">Locked for 12 months</p>
          {myContributions.length > 0 && myContributions[0].status === 'unlocked' ? (
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur">Withdraw</button>
              <button className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl font-medium transition-colors">Buy Gold</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-blue-200">
              <Calendar className="w-4 h-4" />
              <span>Unlocks in {Math.max(0, Math.ceil((new Date(myContributions[0]?.lockedUntil || Date.now()).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Next Leader Payout */}
      {user.isLeader && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-2xl p-6 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Next Leader Payout</p>
              <p className="text-2xl font-bold gradient-text mt-1">{daysUntilPayout} days</p>
              <p className="text-xs text-white/50 mt-1">Credited on 3rd of every month at 10:00 AM</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-purple-900" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Earnings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Monthly Earnings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyEarnings}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1a0a2e', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="amount" stroke="#f59e0b" fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Income Split */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Income Split</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={incomeSplit} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                {incomeSplit.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1a0a2e', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {incomeSplit.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-white/60">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team Growth */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Team Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={teamGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1a0a2e', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="members" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
