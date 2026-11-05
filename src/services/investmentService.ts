import { supabase, type DbInvestment, type DbGoldOrder, isSupabaseConfigured } from '../lib/supabase';
import { getMembersCache, normalizeMobile } from './memberDb';
import { creditReferralCommissionsOnInvestment } from './commissionService';

export interface Investment {
  id: string;
  userId: string;
  amount: number;
  date: string;
  lockedUntil: string;
  status: 'locked' | 'unlocked' | 'used';
  paymentId?: string;
  mobile?: string;
}

export interface GoldOrderRecord {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  designId: string;
  designName: string;
  weightGrams: number;
  amount: number;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: string;
  investmentIds: string[];
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function refreshStatus(inv: Investment): Investment {
  if (inv.status === 'used') return inv;
  const unlocked = new Date() >= new Date(inv.lockedUntil);
  return { ...inv, status: unlocked ? 'unlocked' : 'locked' };
}

function rowToInvestment(row: DbInvestment): Investment {
  return refreshStatus({
    id: row.id,
    userId: row.user_id,
    amount: Number(row.amount),
    date: row.date,
    lockedUntil: row.locked_until,
    status: row.status,
    paymentId: row.payment_id || undefined,
    mobile: row.mobile,
  });
}

function investmentToRow(inv: Investment, mobile: string): DbInvestment {
  return {
    id: inv.id,
    user_id: inv.userId,
    mobile: normalizeMobile(mobile || inv.mobile || ''),
    amount: inv.amount,
    date: inv.date,
    locked_until: inv.lockedUntil,
    status: inv.status,
    payment_id: inv.paymentId ?? null,
  };
}

/** In-memory cache keyed by userId */
const byUser = new Map<string, Investment[]>();
let goldOrdersCache: GoldOrderRecord[] = [];

function setUserInvestments(userId: string, list: Investment[]) {
  byUser.set(userId, list.map(refreshStatus));
}

export function getInvestments(userId: string): Investment[] {
  return (byUser.get(userId) || []).map(refreshStatus);
}

export async function fetchInvestmentsForUser(userId: string, mobile?: string): Promise<Investment[]> {
  if (!isSupabaseConfigured) return getInvestments(userId);

  let query = supabase.from('investments').select('*').eq('user_id', userId);
  const { data, error } = await query.order('created_at', { ascending: true });

  if (error) {
    // Fallback: try by mobile if user id changed
    if (mobile) {
      const m = normalizeMobile(mobile);
      const { data: byMobile, error: err2 } = await supabase
        .from('investments')
        .select('*')
        .eq('mobile', m)
        .order('created_at', { ascending: true });
      if (err2) throw err2;
      const list = (byMobile as DbInvestment[]).map(rowToInvestment).map(i => ({ ...i, userId }));
      setUserInvestments(userId, list);
      // Re-link rows to current user id
      await Promise.all(
        list
          .filter(i => i.userId === userId)
          .map(i =>
            supabase
              .from('investments')
              .update({ user_id: userId })
              .eq('id', i.id)
          )
      );
      return getInvestments(userId);
    }
    throw error;
  }

  setUserInvestments(userId, (data as DbInvestment[]).map(rowToInvestment));
  return getInvestments(userId);
}

export async function restoreInvestmentsByMobile(userId: string, mobile: string) {
  return fetchInvestmentsForUser(userId, mobile);
}

export async function addInvestment(
  userId: string,
  amount: number,
  paymentId?: string,
  mobile?: string
): Promise<Investment> {
  const now = new Date();
  const m = normalizeMobile(mobile || '');
  const inv: Investment = {
    id: `inv_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    userId,
    amount,
    date: now.toISOString().split('T')[0],
    lockedUntil: addMonths(now, 12).toISOString().split('T')[0],
    status: 'locked',
    paymentId,
    mobile: m,
  };

  let saved = inv;

  if (!isSupabaseConfigured) {
    const list = getInvestments(userId);
    list.push(inv);
    setUserInvestments(userId, list);
  } else {
    const { data, error } = await supabase
      .from('investments')
      .insert(investmentToRow(inv, m))
      .select('*')
      .single();

    if (error) {
      console.error('Supabase addInvestment failed:', error.message);
      throw error;
    }

    saved = rowToInvestment(data as DbInvestment);
    const list = getInvestments(userId);
    list.push(saved);
    setUserInvestments(userId, list);
  }

  // Credit L1 / L2 to upline — resolve investor with real referredBy from cache/DB
  const { fetchMemberByMobile, rowToUser, upsertMembersCache } = await import('./memberDb');
  let investor = getMembersCache().find(u => u.id === userId);
  if (!investor && m) {
    investor = getMembersCache().find(u => u.mobile === m);
  }
  if ((!investor || !investor.referredBy?.trim()) && isSupabaseConfigured) {
    try {
      if (m) {
        const byMobile = await fetchMemberByMobile(m).catch(() => null);
        if (byMobile) investor = byMobile;
      }
      if ((!investor || !investor.referredBy?.trim()) && userId) {
        const { data } = await supabase.from('members').select('*').eq('id', userId).maybeSingle();
        if (data) {
          investor = rowToUser(data as import('../lib/supabase').DbMember);
          upsertMembersCache(investor);
        }
      }
    } catch {
      /* fall through */
    }
  }
  if (!investor) {
    console.warn('addInvestment: member not found for commission credit', userId, m);
  } else if (!investor.referredBy?.trim()) {
    console.warn('addInvestment: member has no referredBy — no L1/L2', investor.mobile);
  } else {
    try {
      await creditReferralCommissionsOnInvestment({
        investor,
        amount: saved.amount,
        investmentId: saved.id,
      });
    } catch (e) {
      // Investment already saved — don't roll back membership payment
      console.error('Commission credit failed (investment kept)', e);
    }
  }

  return saved;
}

/** All investments for admin panels */
export async function fetchAllInvestments(): Promise<Investment[]> {
  if (!isSupabaseConfigured) {
    const all: Investment[] = [];
    byUser.forEach(list => all.push(...list.map(refreshStatus)));
    return all.sort((a, b) => b.date.localeCompare(a.date));
  }

  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchAllInvestments failed:', error.message);
    throw error;
  }

  const list = (data as DbInvestment[]).map(rowToInvestment);
  const grouped = new Map<string, Investment[]>();
  list.forEach(inv => {
    const g = grouped.get(inv.userId) || [];
    g.push(inv);
    grouped.set(inv.userId, g);
  });
  grouped.forEach((g, id) => setUserInvestments(id, g));
  return list;
}

/** Prefetch investments for many users (team income calc) */
export async function fetchInvestmentsForUsers(userIds: string[]) {
  if (!isSupabaseConfigured || !userIds.length) return;
  const { data, error } = await supabase.from('investments').select('*').in('user_id', userIds);
  if (error) {
    console.error('fetchInvestmentsForUsers', error.message);
    return;
  }
  const byUser = new Map<string, Investment[]>();
  (data as DbInvestment[]).forEach(row => {
    const inv = rowToInvestment(row);
    const list = byUser.get(inv.userId) || [];
    list.push(inv);
    byUser.set(inv.userId, list);
  });
  byUser.forEach((list, id) => setUserInvestments(id, list));
}

export function getTotalInvested(userId: string): number {
  return getInvestments(userId)
    .filter(i => i.status !== 'used')
    .reduce((s, i) => s + i.amount, 0);
}

export function getLockedInvested(userId: string): number {
  return getInvestments(userId)
    .filter(i => i.status === 'locked')
    .reduce((s, i) => s + i.amount, 0);
}

export function getUnlockedInvested(userId: string): number {
  return getInvestments(userId)
    .filter(i => i.status === 'unlocked')
    .reduce((s, i) => s + i.amount, 0);
}

export async function spendUnlockedInvestment(
  userId: string,
  amount: number
): Promise<{ success: boolean; investmentIds: string[]; message: string }> {
  const list = getInvestments(userId);
  let remaining = amount;
  const usedIds: string[] = [];

  for (const inv of list) {
    if (remaining <= 0) break;
    if (inv.status !== 'unlocked') continue;
    usedIds.push(inv.id);
    remaining -= inv.amount;
    inv.status = 'used';
  }

  if (remaining > 0) {
    return {
      success: false,
      investmentIds: [],
      message: 'Insufficient unlocked investment for this gold order',
    };
  }

  setUserInvestments(userId, list);

  if (isSupabaseConfigured && usedIds.length) {
    const { error } = await supabase
      .from('investments')
      .update({ status: 'used' })
      .in('id', usedIds);
    if (error) {
      console.error('Supabase spendUnlockedInvestment failed:', error.message);
      throw error;
    }
  }

  return { success: true, investmentIds: usedIds, message: 'OK' };
}

function rowToGoldOrder(row: DbGoldOrder): GoldOrderRecord {
  return {
    id: row.id,
    userId: row.user_id,
    userName: row.user_name,
    userMobile: row.user_mobile,
    designId: row.design_id,
    designName: row.design_name,
    weightGrams: Number(row.weight_grams),
    amount: Number(row.amount),
    status: row.status,
    createdAt: row.created_at,
    investmentIds: Array.isArray(row.investment_ids) ? row.investment_ids : [],
  };
}

export function getGoldOrders(): GoldOrderRecord[] {
  return goldOrdersCache;
}

export async function fetchGoldOrders(): Promise<GoldOrderRecord[]> {
  if (!isSupabaseConfigured) return goldOrdersCache;
  const { data, error } = await supabase
    .from('gold_orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  goldOrdersCache = (data as DbGoldOrder[]).map(rowToGoldOrder);
  return goldOrdersCache;
}

export async function saveGoldOrder(order: GoldOrderRecord) {
  goldOrdersCache = [order, ...goldOrdersCache.filter(o => o.id !== order.id)];

  if (!isSupabaseConfigured) return;

  const row: DbGoldOrder = {
    id: order.id,
    user_id: order.userId,
    user_name: order.userName,
    user_mobile: order.userMobile,
    design_id: order.designId,
    design_name: order.designName,
    weight_grams: order.weightGrams,
    amount: order.amount,
    status: order.status,
    created_at: order.createdAt,
    investment_ids: order.investmentIds,
  };

  const { error } = await supabase.from('gold_orders').upsert(row);
  if (error) {
    console.error('Supabase saveGoldOrder failed:', error.message);
    throw error;
  }
}

export function getUserGoldOrders(userId: string) {
  return getGoldOrders().filter(o => o.userId === userId);
}
