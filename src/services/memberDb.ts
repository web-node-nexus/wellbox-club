import { supabase, type DbMember, isSupabaseConfigured } from '../lib/supabase';
import type { RegisteredUser } from '../context/AuthContext';

export function normalizeMobile(mobile: string) {
  return mobile.replace(/\D/g, '').slice(-10);
}

export function rowToUser(row: DbMember): RegisteredUser {
  return {
    id: row.id,
    name: row.name,
    mobile: normalizeMobile(row.mobile),
    email: row.email || undefined,
    phone: row.phone || undefined,
    referralCode: row.referral_code || '',
    referredBy: row.referred_by || '',
    city: row.city || '',
    role: row.role,
    isLeader: Boolean(row.is_leader),
    teamSize: Number(row.team_size) || 0,
    joinDate: row.join_date,
    bankName: row.bank_name || '',
    accountNumber: row.account_number || '',
    ifscCode: row.ifsc_code || '',
    accountHolder: row.account_holder || '',
    upiId: row.upi_id || '',
  };
}

export function userToRow(user: RegisteredUser): DbMember {
  return {
    id: user.id,
    name: user.name,
    mobile: normalizeMobile(user.mobile),
    email: user.email ?? null,
    phone: user.phone ?? null,
    referral_code: user.referralCode || '',
    referred_by: user.referredBy || '',
    city: user.city || '',
    role: user.role,
    is_leader: user.isLeader || user.role === 'leader' || user.role === 'admin',
    team_size: user.teamSize || 0,
    join_date: user.joinDate,
    bank_name: user.bankName || '',
    account_number: user.accountNumber || '',
    ifsc_code: user.ifscCode || '',
    account_holder: user.accountHolder || '',
    upi_id: user.upiId || '',
  };
}

let cache: RegisteredUser[] = [];
let cacheReady = false;
let cacheError: string | null = null;

export function getMembersCache(): RegisteredUser[] {
  return cache;
}

export function getMembersCacheError() {
  return cacheError;
}

export function isMembersCacheReady() {
  return cacheReady;
}

function setCache(users: RegisteredUser[]) {
  const byMobile = new Map<string, RegisteredUser>();
  users.forEach(u => byMobile.set(normalizeMobile(u.mobile), { ...u, mobile: normalizeMobile(u.mobile) }));
  cache = [...byMobile.values()];
  cacheReady = true;
}

export function upsertMembersCache(user: RegisteredUser) {
  const clean = { ...user, mobile: normalizeMobile(user.mobile) };
  const idx = cache.findIndex(u => normalizeMobile(u.mobile) === clean.mobile || u.id === clean.id);
  if (idx >= 0) cache[idx] = { ...cache[idx], ...clean };
  else cache.push(clean);
  cache = [...cache];
}

export async function fetchAllMembers(): Promise<RegisteredUser[]> {
  if (!isSupabaseConfigured) {
    cacheError = 'Supabase env missing';
    cacheReady = true;
    return cache;
  }

  const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: true });

  if (error) {
    cacheError = error.message;
    cacheReady = true;
    console.error('Supabase members fetch failed:', error.message);
    throw error;
  }

  cacheError = null;
  setCache((data as DbMember[]).map(rowToUser));
  return cache;
}

export function clearMembersCache() {
  cache = [];
  cacheReady = false;
  cacheError = null;
}

export async function fetchMemberByMobile(mobile: string): Promise<RegisteredUser | null> {
  const m = normalizeMobile(mobile);

  // Always check Supabase first so wiped DB isn't blocked by stale memory cache
  const { data, error } = await supabase.from('members').select('*').eq('mobile', m).maybeSingle();
  if (error) {
    console.error('Supabase member lookup failed:', error.message);
    throw error;
  }
  if (!data) {
    // Drop stale cache entry if DB no longer has this mobile
    cache = cache.filter(u => normalizeMobile(u.mobile) !== m);
    return null;
  }
  const user = rowToUser(data as DbMember);
  upsertMembersCache(user);
  return user;
}

export async function upsertMember(user: RegisteredUser): Promise<RegisteredUser> {
  const row = userToRow(user);
  const { data, error } = await supabase
    .from('members')
    .upsert(
      { ...row, updated_at: new Date().toISOString() },
      { onConflict: 'mobile' }
    )
    .select('*')
    .single();

  if (error) {
    console.error('Supabase member upsert failed:', error.message);
    throw error;
  }

  const saved = rowToUser(data as DbMember);
  upsertMembersCache(saved);
  return saved;
}

export async function ensureDemoMembers(demos: RegisteredUser[]) {
  // Insert demos only if missing — ignore conflicts
  for (const demo of demos) {
    const existing = cache.find(u => normalizeMobile(u.mobile) === normalizeMobile(demo.mobile));
    if (existing) continue;
    try {
      const { data: remote } = await supabase
        .from('members')
        .select('id')
        .eq('mobile', normalizeMobile(demo.mobile))
        .maybeSingle();
      if (remote) continue;
      await upsertMember(demo);
    } catch (e) {
      console.warn('Demo seed skipped for', demo.mobile, e);
    }
  }
}
