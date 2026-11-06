import { supabase, isSupabaseConfigured, type DbWithdrawal } from '../lib/supabase';
import type { RegisteredUser } from '../context/AuthContext';
import { getCommissionBalance } from './commissionService';
import { upsertMember } from './memberDb';

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid';
export type WithdrawalMethod = 'bank' | 'upi';

export interface WithdrawalRecord {
  id: string;
  userId: string;
  userMobile: string;
  amount: number;
  method: WithdrawalMethod;
  status: WithdrawalStatus;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolder: string;
  upiId: string;
  adminNote: string;
  razorpayPayoutId?: string;
  createdAt: string;
  processedAt?: string;
}

let cache: WithdrawalRecord[] = [];

function rowToWithdrawal(row: DbWithdrawal): WithdrawalRecord {
  return {
    id: row.id,
    userId: row.user_id,
    userMobile: row.user_mobile || '',
    amount: Number(row.amount),
    method: row.method,
    status: row.status,
    bankName: row.bank_name || '',
    accountNumber: row.account_number || '',
    ifscCode: row.ifsc_code || '',
    accountHolder: row.account_holder || '',
    upiId: row.upi_id || '',
    adminNote: row.admin_note || '',
    razorpayPayoutId: row.razorpay_payout_id || undefined,
    createdAt: (row.created_at || '').split('T')[0],
    processedAt: row.processed_at ? row.processed_at.split('T')[0] : undefined,
  };
}

export function getWithdrawalsCache(userId?: string) {
  if (!userId) return cache;
  return cache.filter(w => w.userId === userId);
}

/** Commission earned minus pending/approved/paid withdrawals */
export function getAvailableToWithdraw(userId: string) {
  const earned = getCommissionBalance(userId);
  const reserved = getWithdrawalsCache(userId)
    .filter(w => w.status === 'pending' || w.status === 'approved' || w.status === 'paid')
    .reduce((s, w) => s + w.amount, 0);
  return Math.max(0, earned - reserved);
}

export async function fetchWithdrawals(userId?: string): Promise<WithdrawalRecord[]> {
  if (!isSupabaseConfigured) return getWithdrawalsCache(userId);

  let q = supabase.from('withdrawals').select('*').order('created_at', { ascending: false });
  if (userId) q = q.eq('user_id', userId);

  const { data, error } = await q;
  if (error) {
    console.error('fetchWithdrawals failed', error.message);
    throw error;
  }

  const rows = (data as DbWithdrawal[]).map(rowToWithdrawal);
  if (userId) {
    cache = [...cache.filter(w => w.userId !== userId), ...rows];
    return rows;
  }
  cache = rows;
  return cache;
}

export async function saveMemberPayoutDetails(
  user: RegisteredUser,
  details: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolder?: string;
    upiId?: string;
  }
): Promise<RegisteredUser> {
  return upsertMember({
    ...user,
    bankName: details.bankName ?? user.bankName ?? '',
    accountNumber: details.accountNumber ?? user.accountNumber ?? '',
    ifscCode: details.ifscCode ?? user.ifscCode ?? '',
    accountHolder: details.accountHolder ?? user.accountHolder ?? '',
    upiId: details.upiId ?? user.upiId ?? '',
  });
}

export async function requestWithdrawal(params: {
  user: RegisteredUser;
  amount: number;
  method: WithdrawalMethod;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolder?: string;
  upiId?: string;
}): Promise<WithdrawalRecord> {
  const amount = Math.round(Number(params.amount));
  if (amount < 100) throw new Error('Minimum withdrawal is ₹100');

  await fetchWithdrawals(params.user.id).catch(() => undefined);
  const available = getAvailableToWithdraw(params.user.id);
  if (amount > available) {
    throw new Error(`Insufficient balance. Available: ₹${available.toLocaleString()}`);
  }

  if (params.method === 'bank') {
    if (
      !params.bankName?.trim() ||
      !params.accountNumber?.trim() ||
      !params.ifscCode?.trim() ||
      !params.accountHolder?.trim()
    ) {
      throw new Error('Please fill all bank details');
    }
  } else if (!params.upiId?.trim()) {
    throw new Error('Please enter UPI ID');
  }

  // Persist payout details on member for next time
  await saveMemberPayoutDetails(params.user, {
    bankName: params.bankName,
    accountNumber: params.accountNumber,
    ifscCode: params.ifscCode,
    accountHolder: params.accountHolder,
    upiId: params.upiId,
  }).catch(() => undefined);

  const rec: WithdrawalRecord = {
    id: `wd_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    userId: params.user.id,
    userMobile: params.user.mobile,
    amount,
    method: params.method,
    status: 'pending',
    bankName: params.bankName?.trim() || '',
    accountNumber: params.accountNumber?.trim() || '',
    ifscCode: (params.ifscCode || '').trim().toUpperCase(),
    accountHolder: params.accountHolder?.trim() || '',
    upiId: params.upiId?.trim() || '',
    adminNote: '',
    createdAt: new Date().toISOString().split('T')[0],
  };

  if (!isSupabaseConfigured) {
    cache = [rec, ...cache];
    return rec;
  }

  const { data, error } = await supabase
    .from('withdrawals')
    .insert({
      id: rec.id,
      user_id: rec.userId,
      user_mobile: rec.userMobile,
      amount: rec.amount,
      method: rec.method,
      status: rec.status,
      bank_name: rec.bankName,
      account_number: rec.accountNumber,
      ifsc_code: rec.ifscCode,
      account_holder: rec.accountHolder,
      upi_id: rec.upiId,
      admin_note: '',
      razorpay_payout_id: null,
      created_at: new Date().toISOString(),
      processed_at: null,
    })
    .select('*')
    .single();

  if (error) {
    console.error('requestWithdrawal failed', error.message);
    if (/Could not find the table|PGRST205|withdrawals/i.test(error.message)) {
      throw new Error(
        'Withdrawals table missing. Run supabase/withdrawals_migration.sql in Supabase SQL Editor.'
      );
    }
    throw error;
  }

  const saved = rowToWithdrawal(data as DbWithdrawal);
  cache = [saved, ...cache.filter(w => w.id !== saved.id)];
  try {
    const { notifyAdmin } = await import('./notificationService');
    await notifyAdmin({
      type: 'withdrawal',
      title: 'Withdrawal request',
      message: `${params.user.name} requested ₹${saved.amount.toLocaleString()} via ${saved.method}`,
      meta: { withdrawalId: saved.id, userId: saved.userId, amount: saved.amount },
    });
  } catch {
    /* non-blocking */
  }
  return saved;
}

export async function updateWithdrawalStatus(
  id: string,
  status: WithdrawalStatus,
  adminNote = ''
): Promise<WithdrawalRecord> {
  if (!isSupabaseConfigured) {
    const idx = cache.findIndex(w => w.id === id);
    if (idx < 0) throw new Error('Withdrawal not found');
    cache[idx] = {
      ...cache[idx],
      status,
      adminNote: adminNote || cache[idx].adminNote,
      processedAt: new Date().toISOString().split('T')[0],
    };
    cache = [...cache];
    return cache[idx];
  }

  const { data, error } = await supabase
    .from('withdrawals')
    .update({
      status,
      admin_note: adminNote,
      processed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  const saved = rowToWithdrawal(data as DbWithdrawal);
  cache = cache.map(w => (w.id === saved.id ? saved : w));
  return saved;
}
