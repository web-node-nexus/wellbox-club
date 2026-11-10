import { RegisteredUser } from '../context/AuthContext';
import { BUSINESS_RULES } from '../data/businessRules';
import { getInvestments, getTotalInvested } from './investmentService';
import { getMembersCache } from './memberDb';
import {
  getCommissionBalance,
  getCommissionsByType,
  getDirectReferrals,
  getTeamTreeIds,
  sumCommissionsByType,
  syncLeaderPayout,
} from './commissionService';

function allUsers(): RegisteredUser[] {
  return getMembersCache();
}

/** Direct referrals (level 1) — referredBy stores referral CODE or user id */
export function getDirectMembers(userId: string, all = allUsers()) {
  return getDirectReferrals(userId, all);
}

/** Build team recursively for leader progress */
export function getTeamTree(userId: string, all = allUsers()): RegisteredUser[] {
  const ids = new Set(getTeamTreeIds(userId, all));
  return all.filter(u => ids.has(u.id));
}

export function getTeamSize(userId: string) {
  return getTeamTreeIds(userId).length;
}

export function isLeaderEligible(userId: string) {
  return getTeamSize(userId) >= BUSINESS_RULES.leaderTeamRequirement;
}

export function getOwnContribution(userId: string) {
  return getTotalInvested(userId);
}

/** L1: ledger first, else live calc from direct members' investments */
export function getLevel1Income(userId: string) {
  const fromLedger = sumCommissionsByType(userId, 'commission_l1');
  if (fromLedger > 0) return fromLedger;

  const directs = getDirectMembers(userId);
  return Math.round(
    directs.reduce(
      (sum, m) => sum + getTotalInvested(m.id) * (BUSINESS_RULES.level1Percent / 100),
      0
    )
  );
}

/** L2: ledger first, else live calc */
export function getLevel2Income(userId: string) {
  const fromLedger = sumCommissionsByType(userId, 'commission_l2');
  if (fromLedger > 0) return fromLedger;

  const directs = getDirectMembers(userId);
  const l2Members = directs.flatMap(d => getDirectMembers(d.id));
  return Math.round(
    l2Members.reduce(
      (sum, m) => sum + getTotalInvested(m.id) * (BUSINESS_RULES.level2Percent / 100),
      0
    )
  );
}

export function getLeaderIncomeEstimate(userId: string, user?: RegisteredUser | null) {
  const teamSize = Math.max(user?.teamSize || 0, getTeamSize(userId));
  const isLeader = !!(
    user?.isLeader ||
    user?.role === 'leader' ||
    user?.role === 'admin'
  );

  const fromLedger = sumCommissionsByType(userId, 'leader_payout');
  const pending = getCommissionsByType(userId, 'leader_payout')
    .filter(c => c.status === 'pending')
    .reduce((s, c) => s + c.amount, 0);

  if (!isLeader || teamSize < BUSINESS_RULES.leaderTeamRequirement) {
    return {
      eligible: false,
      teamSize,
      amount: fromLedger,
      pending,
      requirement: BUSINESS_RULES.leaderTeamRequirement,
    };
  }

  if (fromLedger + pending > 0) {
    return {
      eligible: true,
      teamSize,
      amount: fromLedger + pending,
      pending,
      requirement: BUSINESS_RULES.leaderTeamRequirement,
    };
  }

  // Estimate: 5% of team L1+L2 commissions
  const teamIds = new Set(getTeamTreeIds(userId));
  const teamIncome = allUsers()
    .filter(u => teamIds.has(u.id))
    .reduce(
      (s, m) =>
        s + sumCommissionsByType(m.id, 'commission_l1') + sumCommissionsByType(m.id, 'commission_l2'),
      0
    );

  const estimate =
    teamIncome > 0
      ? Math.round(teamIncome * (BUSINESS_RULES.leaderPercent / 100))
      : Math.round(
          getTeamTree(userId).reduce(
            (sum, m) =>
              sum +
              getTotalInvested(m.id) *
                ((BUSINESS_RULES.level1Percent + BUSINESS_RULES.level2Percent) / 100),
            0
          ) *
            (BUSINESS_RULES.leaderPercent / 100)
        );

  return {
    eligible: true,
    teamSize,
    amount: estimate,
    pending: 0,
    requirement: BUSINESS_RULES.leaderTeamRequirement,
  };
}

export function getGoldOrderCommission(userId: string) {
  return sumCommissionsByType(userId, 'gold_order_commission');
}

export function getCommissionWithdrawable(userId: string) {
  const bal = getCommissionBalance(userId);
  if (bal > 0) return bal;
  return (
    getLevel1Income(userId) +
    getLevel2Income(userId) +
    getLeaderIncomeEstimate(userId).amount +
    getGoldOrderCommission(userId)
  );
}

export async function refreshLeaderIncome(user: RegisteredUser) {
  try {
    return await syncLeaderPayout(user);
  } catch (e) {
    console.warn('syncLeaderPayout', e);
    return { amount: 0, status: 'error' as const };
  }
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
    user.isLeader || user.role === 'leader' || user.role === 'admin';

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
    withdrawableCommission: getCommissionWithdrawable(user.id),
  };
}
