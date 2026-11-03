import { RegisteredUser } from '../context/AuthContext';
import { BUSINESS_RULES } from '../data/businessRules';
import { getInvestments, getTotalInvested } from './investmentService';
import { walletTransactions } from '../data/mockData';

function usersKeyUsers(): RegisteredUser[] {
  try {
    return JSON.parse(localStorage.getItem('jwellbox_users') || '[]');
  } catch {
    return [];
  }
}

/** Direct referrals (level 1) — referredBy stores referral CODE or user id */
export function getDirectMembers(userId: string, all = usersKeyUsers()) {
  const me = all.find(u => u.id === userId);
  return all.filter(
    u =>
      u.id !== userId &&
      (u.referredBy === userId ||
        (!!me?.referralCode && u.referredBy === me.referralCode))
  );
}

/** Build team recursively for leader progress */
export function getTeamTree(userId: string, all = usersKeyUsers()): RegisteredUser[] {
  const directs = getDirectMembers(userId, all);
  const nested = directs.flatMap(d => getTeamTree(d.id, all));
  const map = new Map<string, RegisteredUser>();
  [...directs, ...nested].forEach(u => map.set(u.id, u));
  return [...map.values()];
}

export function getTeamSize(userId: string) {
  return getTeamTree(userId).length;
}

export function isLeaderEligible(userId: string) {
  return getTeamSize(userId) >= BUSINESS_RULES.leaderTeamRequirement;
}

/** Own contribution / investment total */
export function getOwnContribution(userId: string) {
  return getTotalInvested(userId);
}

/**
 * Approximate L1 income: 10% of each direct member's investments
 */
export function getLevel1Income(userId: string) {
  const directs = getDirectMembers(userId);
  const fromLive = directs.reduce(
    (sum, m) => sum + getTotalInvested(m.id) * (BUSINESS_RULES.level1Percent / 100),
    0
  );
  const fromMock = walletTransactions
    .filter(t => t.userId === userId && t.type === 'commission_l1')
    .reduce((s, t) => s + t.amount, 0);
  return Math.round(fromLive + fromMock);
}

/** L2: 5% of investments of direct members' directs */
export function getLevel2Income(userId: string) {
  const directs = getDirectMembers(userId);
  const l2Members = directs.flatMap(d => getDirectMembers(d.id));
  const fromLive = l2Members.reduce(
    (sum, m) => sum + getTotalInvested(m.id) * (BUSINESS_RULES.level2Percent / 100),
    0
  );
  const fromMock = walletTransactions
    .filter(t => t.userId === userId && t.type === 'commission_l2')
    .reduce((s, t) => s + t.amount, 0);
  return Math.round(fromLive + fromMock);
}

/**
 * Leader income: 5% of (L1+L2 earnings of whole team) — only if team >= 100
 * Credited on 3rd of each month (display estimate)
 */
export function getLeaderIncomeEstimate(userId: string, user?: RegisteredUser | null) {
  const teamSize = Math.max(user?.teamSize || 0, getTeamSize(userId));
  const isLeader = !!(user?.isLeader || user?.role === 'leader' || teamSize >= BUSINESS_RULES.leaderTeamRequirement);
  if (!isLeader || teamSize < BUSINESS_RULES.leaderTeamRequirement) {
    const fromMock = walletTransactions
      .filter(t => t.userId === userId && t.type === 'leader_payout')
      .reduce((s, t) => s + t.amount, 0);
    return { eligible: false, teamSize, amount: fromMock, requirement: BUSINESS_RULES.leaderTeamRequirement };
  }

  const team = getTeamTree(userId);
  const teamContributionIncome = team.reduce((sum, m) => {
    // Team members' L1+L2 style earnings approx from their investments network is heavy;
    // Use 10%+5% of each member investment as proxy of "income generated in tree"
    return sum + getTotalInvested(m.id) * ((BUSINESS_RULES.level1Percent + BUSINESS_RULES.level2Percent) / 100);
  }, 0);

  const estimate = Math.round(teamContributionIncome * (BUSINESS_RULES.leaderPercent / 100));
  const fromMock = walletTransactions
    .filter(t => t.userId === userId && t.type === 'leader_payout')
    .reduce((s, t) => s + t.amount, 0);

  return {
    eligible: true,
    teamSize,
    amount: Math.max(estimate, fromMock),
    requirement: BUSINESS_RULES.leaderTeamRequirement,
  };
}

export function getGoldOrderCommission(userId: string) {
  return walletTransactions
    .filter(t => t.userId === userId && t.type === 'gold_order_commission')
    .reduce((s, t) => s + t.amount, 0);
}

export function getCommissionWithdrawable(userId: string) {
  return (
    getLevel1Income(userId) +
    getLevel2Income(userId) +
    getLeaderIncomeEstimate(userId).amount +
    getGoldOrderCommission(userId)
  );
}

export function getDashboardStats(user: RegisteredUser) {
  const teamSize = Math.max(user.teamSize || 0, getTeamSize(user.id));
  const leader = getLeaderIncomeEstimate(user.id, { ...user, teamSize });
  const l1 = getLevel1Income(user.id);
  const l2 = getLevel2Income(user.id);
  const own = getOwnContribution(user.id);
  const investments = getInvestments(user.id);
  const goldBonus = getGoldOrderCommission(user.id);
  const isLeader =
    user.isLeader || user.role === 'leader' || user.role === 'admin' || teamSize >= BUSINESS_RULES.leaderTeamRequirement;

  return {
    ownContribution: own,
    level1Income: l1,
    level2Income: l2,
    leaderIncome: leader.amount,
    goldBonus,
    totalEarnings: l1 + l2 + leader.amount + goldBonus,
    teamSize,
    isLeader,
    leaderProgress: Math.min(100, Math.round((teamSize / BUSINESS_RULES.leaderTeamRequirement) * 100)),
    leaderRequirement: BUSINESS_RULES.leaderTeamRequirement,
    leaderEligible: leader.eligible,
    investments,
    withdrawableCommission: l1 + l2 + leader.amount + goldBonus,
  };
}
