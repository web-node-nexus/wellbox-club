/**
 * Create monthly Autopay subscription for a chosen amount (₹1–₹10000).
 * Flow: Plan (monthly, that amount) → Subscription (total_count = 24).
 *
 * POST { amount, name?, mobile?, userId?, notes? }
 * Returns { subscriptionId, planId, amount, totalCount, keyId }
 */
import { razorpayFetch } from './_lib/razorpayAuth.js';

const MIN = 1;
const MAX = 10000;
const TOTAL_COUNT = 24; // 24 monthly cycles

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const amountInr = Math.round(Number(body.amount));
    if (!amountInr || amountInr < MIN || amountInr > MAX) {
      return res.status(400).json({
        error: `Autopay amount must be between ₹${MIN} and ₹${MAX}`,
      });
    }

    const amountPaise = amountInr * 100;
    const mobile = String(body.mobile || '')
      .replace(/\D/g, '')
      .slice(-10);
    const name = String(body.name || 'Jewellbox Member').slice(0, 80);
    const userId = String(body.userId || '').slice(0, 40);
    const totalCount = Number(body.totalCount) > 0 ? Math.min(Number(body.totalCount), 120) : TOTAL_COUNT;

    // 1) Plan for this exact monthly amount
    const { data: plan, keyId } = await razorpayFetch('/plans', {
      method: 'POST',
      body: {
        period: 'monthly',
        interval: 1,
        item: {
          name: `Jewellbox Monthly ₹${amountInr}`,
          amount: amountPaise,
          currency: 'INR',
          description: `Monthly contribution ₹${amountInr} × ${totalCount} months`,
        },
        notes: {
          source: 'jewellbox-club',
          amount_inr: String(amountInr),
        },
      },
    });

    // 2) Subscription — 24 billing cycles (same amount each month)
    const { data: sub } = await razorpayFetch('/subscriptions', {
      method: 'POST',
      body: {
        plan_id: plan.id,
        total_count: totalCount,
        quantity: 1,
        customer_notify: 1,
        notes: {
          source: 'jewellbox-club',
          mobile: mobile || '',
          name,
          user_id: userId || '',
          amount_inr: String(amountInr),
          total_count: String(totalCount),
          ...(body.notes && typeof body.notes === 'object' ? body.notes : {}),
        },
      },
    });

    return res.status(200).json({
      subscriptionId: sub.id,
      planId: plan.id,
      amount: amountInr,
      amountPaise,
      totalCount,
      currency: 'INR',
      keyId,
      status: sub.status,
    });
  } catch (e) {
    console.error('create-razorpay-subscription', e?.data || e);
    return res.status(e?.status || 500).json({
      error: e?.message || 'Could not create Autopay subscription',
      details: e?.data?.error || undefined,
    });
  }
}
