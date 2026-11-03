import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BUSINESS_RULES } from '../data/businessRules';
import { getMembersCache, rowToUser, upsertMember, upsertMembersCache } from './memberDb';
import type { RegisteredUser } from '../context/AuthContext';
import type { DbMember } from '../lib/supabase';

export type CommissionType =
  | 'commission_l1'
  | 'commission_l2'
  | 'leader_payout'
  | 'gold_order_commission';

export interface CommissionRecord {
  id: string;
  userId: string;
  type: CommissionType;
  amount: number;
  description: string;
  sourceUserId?: string;
  sourceInvestmentId?: string;
  status: 'completed' | 'pending';
  createdAt: string;
}

type DbCommission = {
  id: string;
  user_id: string;
  type: CommissionType;
  amount: number;
  description: string;
  source_user_id: string | null;
  source_investment_id: string | null;
  status: 'completed' | 'pending';
  created_at: string;
};

let cache: CommissionRecord[] = [];

function rowToCommission(row: DbCommission): CommissionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    amount: Number(row.amount),
    description: row.description,
    sourceUserId: row.source_user_id || undefined,
    sourceInvestmentId: row.source_investment_id || undefined,
    status: row.status,
    createdAt: (row.created_at || '').split('T')[0],
  };
}

export function findReferrer(member: RegisteredUser, all = getMembersCache()): RegisteredUser | null {
  if (!member.referredBy?.trim()) return null;
  const codeOrId = member.referredBy.trim();
  return (
    all.find(u => u.id === codeOrId) ||
    all.find(u => !!u.referralCode && u.referralCode.toUpperCase() === codeOrId.toUpperCase()) ||
    null
  );
}

/** Direct referrals by id OR referral code */
export function getDirectReferrals(userId: string, all = getMembersCache()) {
  const me = all.find(u => u.id === userId);
  return all.filter(
    u =>
      u.id !== userId &&
      (u.referredBy === userId ||
        (!!me?.referralCode && u.referredBy?.toUpperCase() === me.referralCode.toUpperCase()))
  );
}

export function getTeamTreeIds(userId: string, all = getMembersCache()): string[] {
  const map = new Map<string, RegisteredUser>();
  const walk = (id: string) => {
    getDirectReferrals(id, all).forEach(d => {
      if (map.has(d.id)) return;
      map.set(d.id, d);
      walk(d.id);
    });
  };
  walk(userId);
  return [...map.keys()];
}

export function getCommissionsCache(userId?: string) {
  if (!userId) return cache;
  return cache.filter(c => c.userId === userId);
}

export async function fetchCommissions(userId?: string): Promise<CommissionRecord[]> {
  if (!isSupabaseConfigured) return getCommissionsCache(userId);

  let q = supabase.from('commissions').select('*').order('created_at', { ascending: false });
  if (userId) q = q.eq('user_id', userId);

  const { data, error } = await q;
  if (error) {
    console.error('fetchCommissions failed', error.message);
    throw error;
  }

  const rows = (data as DbCommission[]).map(rowToCommission);
  if (userId) {
    cache = [...cache.filter(c => c.userId !== userId), ...rows];
    return rows;
  }
  cache = rows;
  return cache;
}

export async function addCommission(input: {
  userId: string;
  type: CommissionType;
  amount: number;
  description: string;
  sourceUserId?: string;
  sourceInvestmentId?: string;
  status?: 'completed' | 'pending';
  id?: string;
}): Promise<CommissionRecord | null> {
  const amount = Math.round(input.amount);
  if (amount <= 0) return null;

  if (input.sourceInvestmentId) {
    const existing = cache.find(
      c =>
        c.userId === input.userId &&
        c.type === input.type &&
        c.sourceInvestmentId === input.sourceInvestmentId
    );
    if (existing) return existing;

    if (isSupabaseConfigured) {
      const { data: remote } = await supabase
        .from('commissions')
        .select('*')
        .eq('user_id', input.userId)
        .eq('type', input.type)
        .eq('source_investment_id', input.sourceInvestmentId)
        .maybeSingle();
      if (remote) {
        const saved = rowToCommission(remote as DbCommission);
        cache = [saved, ...cache.filter(c => c.id !== saved.id)];
        return saved;
      }
    }
  }

  const rec: CommissionRecord = {
    id: input.id || `com_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    userId: input.userId,
    type: input.type,
    amount,
    description: input.description,
    sourceUserId: input.sourceUserId,
    sourceInvestmentId: input.sourceInvestmentId,
    status: input.status || 'completed',
    createdAt: new Date().toISOString().split('T')[0],
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('commissions')
      .insert({
        id: rec.id,
        user_id: rec.userId,
        type: rec.type,
        amount: rec.amount,
        description: rec.description,
        source_user_id: rec.sourceUserId || null,
        source_investment_id: rec.sourceInvestmentId || null,
        status: rec.status,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      console.error('addCommission failed', error.message);
      throw error;
    }
    const saved = rowToCommission(data as DbCommission);
    cache = [saved, ...cache.filter(c => c.id !== saved.id)];
    return saved;
  }

  cache = [rec, ...cache];
  return rec;
}

export function getCommissionBalance(userId: string) {
  return getCommissionsCache(userId)
    .filter(c => c.status === 'completed')
    .reduce((s, c) => s + c.amount, 0);
}

export function getCommissionsByType(userId: string, type: CommissionType) {
  return getCommissionsCache(userId).filter(c => c.type === type);
}

export function sumCommissionsByType(userId: string, type: CommissionType) {
  return getCommissionsByType(userId, type)
    .filter(c => c.status === 'completed')
    .reduce((s, c) => s + c.amount, 0);
}

/** Credit L1 10% + L2 5% when someone invests */
export async function creditReferralCommissionsOnInvestment(params: {
  investor: RegisteredUser;
  amount: number;
  investmentId: string;
}) {
  const all = getMembersCache();
  const investor = all.find(u => u.id === params.investor.id) || params.investor;

  const l1 = findReferrer(investor, all);
  if (!l1) return;

  await addCommission({
    userId: l1.id,
    type: 'commission_l1',
    amount: params.amount * (BUSINESS_RULES.level1Percent / 100),
    description: `Level 1 (${BUSINESS_RULES.level1Percent}%) — ${investor.name} invested ₹${params.amount.toLocaleString()}`,
    sourceUserId: investor.id,
    sourceInvestmentId: params.investmentId,
  });

  const l2 = findReferrer(l1, all);
  if (l2) {
    await addCommission({
      userId: l2.id,
      type: 'commission_l2',
      amount: params.amount * (BUSINESS_RULES.level2Percent / 100),
      description: `Level 2 (${BUSINESS_RULES.level2Percent}%) — ${investor.name} invested ₹${params.amount.toLocaleString()}`,
      sourceUserId: investor.id,
      sourceInvestmentId: params.investmentId,
    });
  }

  await refreshUplineTeamSizes(investor);
}

export async function refreshUplineTeamSizes(member: RegisteredUser) {
  const all = getMembersCache();
  const visited = new Set<string>();
  let current: RegisteredUser | null = member;

  while (current) {
    const parent = findReferrer(current, all);
    if (!parent || visited.has(parent.id)) break;
    visited.add(parent.id);

    const size = getTeamTreeIds(parent.id, getMembersCache()).length;
    const shouldLead = size >= BUSINESS_RULES.leaderTeamRequirement;
    const updated: RegisteredUser = {
      ...parent,
      teamSize: size,
      isLeader: shouldLead || parent.isLeader || parent.role === 'leader' || parent.role === 'admin',
      role:
        shouldLead && parent.role !== 'admin' && parent.role !== 'individual'
          ? 'leader'
          : parent.role,
    };
    await upsertMember(updated);
    current = updated;
  }
}

/** Leader 5% of team members' L1+L2 commissions (monthly). Pending before payout day. */
export async function syncLeaderPayout(leader: RegisteredUser) {
  const all = getMembersCache();
  const size = Math.max(leader.teamSize || 0, getTeamTreeIds(leader.id, all).length);
  const isLeader =
    leader.isLeader ||
    leader.role === 'leader' ||
    leader.role === 'admin' ||
    size >= BUSINESS_RULES.leaderTeamRequirement;

  if (!isLeader || size < BUSINESS_RULES.leaderTeamRequirement) {
    return { amount: 0, status: 'ineligible' as const };
  }

  const teamIds = new Set(getTeamTreeIds(leader.id, all));
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const payoutId = `leader_${leader.id}_${monthKey}`;

  const existing = cache.find(c => c.id === payoutId);
  if (existing) return { amount: existing.amount, status: existing.status };

  // Load all commissions if cache thin
  if (isSupabaseConfigured && cache.length === 0) {
    try {
      await fetchCommissions();
    } catch {
      /* ignore */
    }
  }

  const teamIncome = cache
    .filter(
      c =>
        teamIds.has(c.userId) &&
        (c.type === 'commission_l1' || c.type === 'commission_l2') &&
        c.status === 'completed'
    )
    .reduce((s, c) => s + c.amount, 0);

  const amount = Math.round(teamIncome * (BUSINESS_RULES.leaderPercent / 100));
  if (amount <= 0) return { amount: 0, status: 'zero' as const };

  const status = now.getDate() >= BUSINESS_RULES.leaderPayoutDay ? 'completed' : 'pending';
  await addCommission({
    id: payoutId,
    userId: leader.id,
    type: 'leader_payout',
    amount,
    description: `Leader ${BUSINESS_RULES.leaderPercent}% payout ${monthKey} (team income ₹${teamIncome.toLocaleString()})`,
    status,
  });

  return { amount, status };
}

export async function creditGoldOrderCommission(params: {
  referrerId: string;
  orderAmount: number;
  orderId: string;
  buyerName: string;
}) {
  return addCommission({
    userId: params.referrerId,
    type: 'gold_order_commission',
    amount: params.orderAmount * (BUSINESS_RULES.goldOrderPercent / 100),
    description: `Gold order ${BUSINESS_RULES.goldOrderPercent}% — ${params.buyerName}`,
    sourceInvestmentId: params.orderId,
  });
}

/**
 * Backfill L1/L2 for investments that never got commission rows
 * (e.g. registered before commission system).
 */
export async function backfillCommissionsFromInvestments() {
  if (!isSupabaseConfigured) return { created: 0 };

  const [{ data: invs }, { data: members }] = await Promise.all([
    supabase.from('investments').select('*'),
    supabase.from('members').select('*'),
  ]);

  if (!invs?.length || !members?.length) return { created: 0 };

  (members as DbMember[]).forEach(row => upsertMembersCache(rowToUser(row)));
  await fetchCommissions().catch(() => undefined);

  let created = 0;
  for (const row of invs as any[]) {
    const investor = getMembersCache().find(u => u.id === row.user_id);
    if (!investor) continue;
    const before = cache.length;
    await creditReferralCommissionsOnInvestment({
      investor,
      amount: Number(row.amount),
      investmentId: row.id,
    });
    if (cache.length > before) created += cache.length - before;
  }
  return { created };
}
