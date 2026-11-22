import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BUSINESS_RULES } from '../data/businessRules';

export type MemberSubscription = {
  id: string;
  userId: string;
  mobile: string;
  razorpaySubscriptionId: string;
  razorpayPlanId: string;
  amount: number;
  totalCount: number;
  paidCount: number;
  status: string;
  createdAt: string;
};

function rowToSub(row: any): MemberSubscription {
  return {
    id: row.id,
    userId: row.user_id,
    mobile: row.mobile || '',
    razorpaySubscriptionId: row.razorpay_subscription_id,
    razorpayPlanId: row.razorpay_plan_id || '',
    amount: Number(row.amount) || 0,
    totalCount: Number(row.total_count) || BUSINESS_RULES.autopayMonths,
    paidCount: Number(row.paid_count) || 0,
    status: row.status || 'created',
    createdAt: row.created_at,
  };
}

export async function createAutopaySubscription(input: {
  amount: number;
  name?: string;
  mobile?: string;
  userId?: string;
  notes?: Record<string, string>;
}) {
  const res = await fetch('/api/create-razorpay-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: input.amount,
      name: input.name,
      mobile: input.mobile,
      userId: input.userId,
      totalCount: BUSINESS_RULES.autopayMonths,
      notes: input.notes,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Could not create Autopay (${res.status})`);
  }
  return data as {
    subscriptionId: string;
    planId: string;
    amount: number;
    totalCount: number;
    keyId?: string;
  };
}

export async function verifyAutopayPayment(details: {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}) {
  const res = await fetch('/api/verify-razorpay-subscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.verified) {
    throw new Error(data?.error || 'Autopay verification failed');
  }
  return data;
}

export async function saveMemberSubscription(input: {
  userId: string;
  mobile: string;
  razorpaySubscriptionId: string;
  razorpayPlanId?: string;
  amount: number;
  totalCount?: number;
  status?: string;
  paidCount?: number;
}) {
  const rec = {
    id: `msub_${input.razorpaySubscriptionId}`,
    user_id: input.userId,
    mobile: input.mobile.replace(/\D/g, '').slice(-10),
    razorpay_subscription_id: input.razorpaySubscriptionId,
    razorpay_plan_id: input.razorpayPlanId || '',
    amount: input.amount,
    total_count: input.totalCount ?? BUSINESS_RULES.autopayMonths,
    paid_count: input.paidCount ?? 1,
    status: input.status || 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured) return rowToSub(rec);

  // Upsert by subscription id
  const { data: existing } = await supabase
    .from('member_subscriptions')
    .select('id')
    .eq('razorpay_subscription_id', input.razorpaySubscriptionId)
    .maybeSingle();

  if (existing?.id) {
    const { data, error } = await supabase
      .from('member_subscriptions')
      .update({
        status: rec.status,
        paid_count: rec.paid_count,
        updated_at: rec.updated_at,
      })
      .eq('id', existing.id)
      .select('*')
      .single();
    if (error) throw error;
    return rowToSub(data);
  }

  const { data, error } = await supabase.from('member_subscriptions').insert(rec).select('*').single();
  if (error) {
    if (/Could not find the table|PGRST205|member_subscriptions/i.test(error.message)) {
      console.warn('Run supabase/autopay_migration.sql — subscription not persisted');
      return rowToSub(rec);
    }
    throw error;
  }
  return rowToSub(data);
}

export async function fetchUserSubscriptions(userId: string): Promise<MemberSubscription[]> {
  if (!isSupabaseConfigured || !userId) return [];
  const { data, error } = await supabase
    .from('member_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    if (/Could not find|PGRST205/i.test(error.message)) return [];
    throw error;
  }
  return (data || []).map(rowToSub);
}
