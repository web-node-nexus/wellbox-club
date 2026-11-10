import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Crown, Copy, Share2, CheckCircle, Wallet, Lock, Unlock, Calendar, TrendingUp,
  DollarSign, Users, Gift, Gem, Target, Zap, Bell, Trophy, Star, Medal, Coins,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/incomeService';
import { BUSINESS_RULES, daysUntil, formatInr, nextLeaderPayoutDate } from '../data/businessRules';
import {
  getLockedInvested,
  getUnlockedInvested,
  fetchInvestmentsForUser,
  fetchInvestmentsForUsers,
} from '../services/investmentService';
import {
  fetchCommissions,
  syncLeaderPayout,
  getTeamTreeIds,
} from '../services/commissionService';

export default function Dashboard() {
  const { user, promoteToLeaderIfEligible, refreshUsers, membersTick } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [statsTick, setStatsTick] = useState(0);

  const stats = useMemo(
    () => (user ? getDashboardStats(user) : null),
    [user, statsTick, membersTick]
  );

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        await refreshUsers().catch(() => undefined);
        await fetchCommissions(user.id);
        await fetchInvestmentsForUser(user.id, user.mobile).catch(() => undefined);
        const teamIds = getTeamTreeIds(user.id);
        await fetchInvestmentsForUsers([user.id, ...teamIds]).catch(() => undefined);
        await syncLeaderPayout(user).catch(() => undefined);
      } finally {
        if (!cancelled) setStatsTick(t => t + 1);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, refreshUsers]);

  useEffect(() => {
    if (stats) promoteToLeaderIfEligible(stats.teamSize);
  }, [stats?.teamSize, promoteToLeaderIfEligible]);

  if (!user || !stats) return null;

  const locked = getLockedInvested(user.id);
  const unlocked = getUnlockedInvested(user.id);
  const nextPayout = nextLeaderPayoutDate();
  const daysToPayout = daysUntil(nextPayout);

  const referralLink = `${window.location.origin}/register/${user.referralCode}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('success', 'Referral link copied!', 'Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    // Exact same URL as Copy Link (put URL first so WhatsApp shows it clearly)
    const text = `${referralLink}\n\nJoin Jewellbox Club — use my referral link above.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Namaste, {user.name.split(' ')[0]}
            </h1>
            {stats.isLeader ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-950 shadow-lg shadow-amber-500/30">
                <Crown className="w-3.5 h-3.5" />
                LEADER BADGE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                MEMBER
              </span>
            )}
            {stats.isLeader && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                Also Member
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            Code <span className="font-mono font-semibold text-amber-700">{user.referralCode || '—'}</span>
            {' · '}L1 {BUSINESS_RULES.level1Percent}% · L2 {BUSINESS_RULES.level2Percent}%
            {stats.isLeader && ` · Leader ${BUSINESS_RULES.leaderPercent}% (3rd of month)`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={copyReferral}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium hover:border-amber-300"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Link'}
          </button>
          <button
            type="button"
            onClick={shareWhatsApp}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-medium"
          >
            <Share2 className="w-4 h-4" /> WhatsApp
          </button>
        </div>
      </div>

      {/* Leader progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-5 text-white shadow-xl ${
          stats.isLeader
            ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500'
            : 'bg-gradient-to-r from-purple-700 via-violet-700 to-indigo-700'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Target className="w-4 h-4" />
              {stats.isLeader
                ? stats.leaderEligible
                  ? `Leader active · payout every month on ${BUSINESS_RULES.leaderPayoutDay}rd`
                  : `Leader · need ${BUSINESS_RULES.leaderTeamRequirement} team for ${BUSINESS_RULES.leaderPercent}% income`
                : 'Member · team growth (Leader only if you joined via Leader form)'}
            </p>
            <p className="text-3xl font-bold mt-1">
              {stats.isLeader
                ? `${stats.teamSize} / ${stats.leaderRequirement} members`
                : `${stats.teamSize} team members`}
            </p>
            {stats.isLeader && !stats.leaderEligible && (
              <p className="text-sm opacity-90 mt-1">
                {Math.max(0, stats.leaderRequirement - stats.teamSize)} more for Leader {BUSINESS_RULES.leaderPercent}% team income
              </p>
            )}
            {stats.isLeader && stats.leaderEligible && (
              <p className="text-sm opacity-90 mt-1">
                Next credit in {daysToPayout} day(s) · {nextPayout.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
            {!stats.isLeader && (
              <p className="text-sm opacity-90 mt-1">
                You earn L1 {BUSINESS_RULES.level1Percent}% and L2 {BUSINESS_RULES.level2Percent}% — members do not become Leaders by team size
              </p>
            )}
          </div>
          {stats.isLeader && (
            <div className="sm:w-48">
              <div className="h-3 rounded-full bg-black/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${stats.leaderProgress}%` }}
                />
              </div>
              <p className="text-xs mt-2 text-right font-semibold">{stats.leaderProgress}%</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Core income cards — concept layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Own Contribution',
            value: stats.ownContribution,
            icon: Coins,
            color: 'from-blue-500 to-indigo-600',
            hint: 'Locked 12 months',
            link: '/contributions',
          },
          {
            label: '1st Level Income',
            value: stats.level1Income,
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
            hint: `${BUSINESS_RULES.level1Percent}% direct referrals`,
            link: '/income/level1',
          },
          {
            label: '2nd Level Income',
            value: stats.level2Income,
            icon: TrendingUp,
            color: 'from-purple-500 to-violet-600',
            hint: `${BUSINESS_RULES.level2Percent}% second level`,
            link: '/income/level2',
          },
          {
            label: 'Leader Income',
            value: stats.leaderIncome,
            icon: Crown,
            color: 'from-amber-500 to-orange-600',
            hint: stats.isLeader
              ? `${BUSINESS_RULES.leaderPercent}% · credit on 3rd`
              : 'Leaders only — join via Leader form',
            link: stats.isLeader ? '/income/leader' : '/team',
          },
        ].map((card, i) => (
          <Link key={card.label} to={card.link}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all h-full"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatInr(card.value)}</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{card.label}</p>
              <p className="text-xs text-gray-500 mt-1">{card.hint}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Wallets */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-3xl p-6 text-white bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <Wallet className="w-9 h-9" />
            <Unlock className="w-5 h-5 text-green-100" />
          </div>
          <p className="text-sm text-green-100">Commission Wallet (withdraw anytime)</p>
          <p className="text-4xl font-bold mt-1">{formatInr(stats.withdrawableCommission)}</p>
          <p className="text-xs text-green-100 mt-2">
            Includes Level 1 + Level 2 + Leader + Gold {BUSINESS_RULES.goldOrderPercent}% referral
          </p>
          <Link
            to="/wallet"
            className="mt-5 block text-center py-3 rounded-xl bg-white/20 hover:bg-white/30 font-semibold"
          >
            Withdraw Commission →
          </Link>
        </div>

        <div className="rounded-3xl p-6 text-white bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <Lock className="w-9 h-9" />
            <Calendar className="w-5 h-5 text-blue-100" />
          </div>
          <p className="text-sm text-blue-100">Contribution / Investment</p>
          <p className="text-4xl font-bold mt-1">{formatInr(stats.ownContribution)}</p>
          <p className="text-xs text-blue-100 mt-2">
            Locked {formatInr(locked)} · Unlocked for gold {formatInr(unlocked)}
          </p>
          <p className="text-xs text-blue-50/90 mt-1">
            After 12 months: buy gold OR withdraw contribution. No early cash withdraw.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link to="/gold-showroom" className="py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-center font-semibold text-sm flex items-center justify-center gap-1">
              <Gem className="w-4 h-4" /> Buy Gold
            </Link>
            <Link to="/wallet" className="py-3 rounded-xl bg-white/15 hover:bg-white/25 text-center font-semibold text-sm">
              View Lock
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions + gold note */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Link to="/team" className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-purple-200 shadow-sm">
          <Users className="w-8 h-8 text-purple-600 mb-2" />
          <p className="font-bold text-gray-900">My Team</p>
          <p className="text-sm text-gray-500">
            {stats.isLeader
              ? `${stats.teamSize} members · ${BUSINESS_RULES.leaderTeamRequirement} for Leader income`
              : `${stats.teamSize} members`}
          </p>
        </Link>
        <Link to="/gold-showroom" className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-amber-200 shadow-sm">
          <Gem className="w-8 h-8 text-amber-600 mb-2" />
          <p className="font-bold text-gray-900">Digital Gold Showroom</p>
          <p className="text-sm text-gray-500">Designs by gram (no price) · call to order · {BUSINESS_RULES.goldOrderPercent}% to referrer</p>
        </Link>
        <Link to="/referral" className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-green-200 shadow-sm">
          <Zap className="w-8 h-8 text-green-600 mb-2" />
          <p className="font-bold text-gray-900">Share & Earn</p>
          <p className="text-sm text-gray-500">Direct {BUSINESS_RULES.level1Percent}% · 2nd level {BUSINESS_RULES.level2Percent}%</p>
        </Link>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900 flex gap-3">
        <Gift className="w-5 h-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-semibold">Manufacturer gold — very low price</p>
          <p className="text-amber-800/80 mt-0.5">
            Showroom shows weight (grams) only — no price. Customers call to order. Referrers earn {BUSINESS_RULES.goldOrderPercent}% of the gold order amount.
          </p>
        </div>
      </div>

      {/* Investments list */}
      {stats.investments.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Your contributions
          </h3>
          <div className="space-y-2">
            {stats.investments.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">{formatInr(inv.amount)}</p>
                  <p className="text-xs text-gray-500">
                    {inv.date} · unlock {inv.lockedUntil}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  inv.status === 'unlocked' ? 'bg-green-100 text-green-700' :
                  inv.status === 'used' ? 'bg-gray-200 text-gray-600' :
                  'bg-amber-100 text-amber-800'
                }`}>{inv.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'First Join', done: stats.ownContribution > 0, icon: Star },
          { label: '10 Team', done: stats.teamSize >= 10, icon: Users },
          { label: 'Leader 100', done: stats.teamSize >= 100, icon: Crown },
          { label: 'Gold Order', done: stats.goldBonus > 0, icon: Medal },
        ].map(a => (
          <div
            key={a.label}
            className={`rounded-2xl p-4 border ${
              a.done ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100 opacity-70'
            }`}
          >
            <a.icon className={`w-5 h-5 mb-2 ${a.done ? 'text-amber-600' : 'text-gray-400'}`} />
            <p className="text-sm font-semibold text-gray-800">{a.label}</p>
            <p className="text-xs text-gray-500">{a.done ? 'Unlocked' : 'Locked'}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Bell className="w-3.5 h-3.5" />
        Tip: Commission anytime withdraw. Contribution only after 12 months or gold purchase.
      </div>
    </div>
  );
}
