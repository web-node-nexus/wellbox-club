/**
 * Razorpay webhooks for Autopay.
 * Configure in Dashboard → Webhooks → URL: https://YOUR_DOMAIN/api/razorpay-webhook
 * Events: subscription.charged, subscription.activated, subscription.halted, subscription.cancelled, payment.captured
 *
 * Env: RAZORPAY_WEBHOOK_SECRET (optional but recommended), SUPABASE_* keys
 *
 * On subscription.charged / invoice.paid → credit investment for that month (skip first if already credited by client).
 */
import crypto from 'crypto';
import { supabaseRest } from './_lib/supabaseAdmin.js';

function verifyWebhook(req, rawBody) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return true; // allow if not configured (still lock down by obscurity — set in prod)
  const signature = req.headers['x-razorpay-signature'];
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signature;
}

function addMonths(isoDate, months) {
  const d = new Date(`${isoDate}T00:00:00`);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d.toISOString().slice(0, 10);
}

async function creditAutopayInvestment({
  userId,
  mobile,
  amount,
  paymentId,
  subscriptionId,
}) {
  // Dedupe
  try {
    await supabaseRest('autopay_payment_log', {
      method: 'POST',
      body: [
        {
          id: `apl_${paymentId}`,
          razorpay_payment_id: paymentId,
          razorpay_subscription_id: subscriptionId,
          user_id: userId,
          amount,
          created_at: new Date().toISOString(),
        },
      ],
    });
  } catch (e) {
    if (/duplicate|unique|23505/i.test(String(e?.message || e?.data || ''))) {
      return { skipped: true, reason: 'already_credited' };
    }
    // table missing — continue best-effort
    if (!/Could not find|PGRST|relation/i.test(String(e?.message || ''))) {
      console.warn('autopay_payment_log', e?.message);
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const invId = `inv_auto_${paymentId}`.slice(0, 60);
  const lockedUntil = addMonths(today, 12);

  await supabaseRest('investments', {
    method: 'POST',
    body: [
      {
        id: invId,
        user_id: userId,
        mobile: mobile || '',
        amount,
        date: today,
        locked_until: lockedUntil,
        status: 'locked',
        payment_id: paymentId,
        created_at: new Date().toISOString(),
      },
    ],
    headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
  });

  // Credit L1/L2 for upline (same rules as client addInvestment)
  try {
    const members = await supabaseRest(
      `members?id=eq.${encodeURIComponent(userId)}&select=id,name,mobile,referral_code,referred_by`
    );
    const investor = Array.isArray(members) ? members[0] : null;
    const sponsorCode = (investor?.referred_by || '').trim().toUpperCase();
    if (sponsorCode) {
      let l1rows = await supabaseRest(
        `members?referral_code=eq.${encodeURIComponent(sponsorCode)}&select=id,name,referral_code,referred_by`
      );
      if (!Array.isArray(l1rows) || !l1rows[0]) {
        l1rows = await supabaseRest(
          `members?id=eq.${encodeURIComponent(sponsorCode)}&select=id,name,referral_code,referred_by`
        );
      }
      const l1 = Array.isArray(l1rows) ? l1rows[0] : null;
      if (l1?.id) {
        const l1Amt = Math.round(amount * 0.1);
        await supabaseRest('commissions', {
          method: 'POST',
          body: [
            {
              id: `c_l1_${invId}`,
              user_id: l1.id,
              type: 'commission_l1',
              amount: l1Amt,
              description: `L1 10% on Autopay ₹${amount} (${investor?.name || userId})`,
              source_user_id: userId,
              source_investment_id: invId,
              status: 'completed',
              created_at: new Date().toISOString(),
            },
          ],
          headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
        });
        const l2Code = (l1.referred_by || '').trim().toUpperCase();
        if (l2Code) {
          let l2rows = await supabaseRest(
            `members?referral_code=eq.${encodeURIComponent(l2Code)}&select=id,name`
          );
          if (!Array.isArray(l2rows) || !l2rows[0]) {
            l2rows = await supabaseRest(
              `members?id=eq.${encodeURIComponent(l2Code)}&select=id,name`
            );
          }
          const l2 = Array.isArray(l2rows) ? l2rows[0] : null;
          if (l2?.id) {
            const l2Amt = Math.round(amount * 0.05);
            await supabaseRest('commissions', {
              method: 'POST',
              body: [
                {
                  id: `c_l2_${invId}`,
                  user_id: l2.id,
                  type: 'commission_l2',
                  amount: l2Amt,
                  description: `L2 5% on Autopay ₹${amount} (${investor?.name || userId})`,
                  source_user_id: userId,
                  source_investment_id: invId,
                  status: 'completed',
                  created_at: new Date().toISOString(),
                },
              ],
              headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn('autopay commission credit', e?.message);
  }

  // Bump paid_count on subscription row
  try {
    const rows = await supabaseRest(
      `member_subscriptions?razorpay_subscription_id=eq.${encodeURIComponent(subscriptionId)}&select=*`
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    if (row) {
      await supabaseRest(
        `member_subscriptions?razorpay_subscription_id=eq.${encodeURIComponent(subscriptionId)}`,
        {
          method: 'PATCH',
          body: {
            paid_count: Number(row.paid_count || 0) + 1,
            status: 'active',
            updated_at: new Date().toISOString(),
          },
          headers: { Prefer: 'return=minimal' },
        }
      );
    }
  } catch (e) {
    console.warn('member_subscriptions update', e?.message);
  }

  return { credited: true, invId };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const rawBody =
    typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});

  if (!verifyWebhook(req, rawBody)) {
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  let event;
  try {
    event = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const eventName = event.event || '';
  const payload = event.payload || {};

  try {
    // Status updates
    if (
      eventName === 'subscription.halted' ||
      eventName === 'subscription.cancelled' ||
      eventName === 'subscription.completed' ||
      eventName === 'subscription.activated' ||
      eventName === 'subscription.authenticated'
    ) {
      const sub = payload.subscription?.entity || payload.subscription || {};
      const subId = sub.id;
      if (subId) {
        const statusMap = {
          'subscription.halted': 'halted',
          'subscription.cancelled': 'cancelled',
          'subscription.completed': 'completed',
          'subscription.activated': 'active',
          'subscription.authenticated': 'authenticated',
        };
        try {
          await supabaseRest(
            `member_subscriptions?razorpay_subscription_id=eq.${encodeURIComponent(subId)}`,
            {
              method: 'PATCH',
              body: {
                status: statusMap[eventName] || sub.status || 'active',
                updated_at: new Date().toISOString(),
              },
              headers: { Prefer: 'return=minimal' },
            }
          );
        } catch {
          /* ignore */
        }
      }
      return res.status(200).json({ ok: true, handled: eventName });
    }

    // Monthly charge
    if (eventName === 'subscription.charged' || eventName === 'invoice.paid') {
      const payment =
        payload.payment?.entity ||
        payload.payment ||
        payload.invoice?.entity?.payment_id ||
        {};
      const sub = payload.subscription?.entity || payload.subscription || {};
      const invoice = payload.invoice?.entity || payload.invoice || {};

      const paymentId =
        payment.id ||
        (typeof payment === 'string' ? payment : null) ||
        invoice.payment_id ||
        invoice.id;
      const subscriptionId = sub.id || invoice.subscription_id;
      const amountPaise = Number(payment.amount || invoice.amount || sub.notes?.amount_inr * 100 || 0);
      const amount = amountPaise >= 100 ? Math.round(amountPaise / 100) : Number(sub.notes?.amount_inr || 0);

      if (!paymentId || !subscriptionId || !amount) {
        return res.status(200).json({ ok: true, skipped: 'missing fields', eventName });
      }

      // Resolve user from our DB subscription row, else notes
      let userId = sub.notes?.user_id || '';
      let mobile = sub.notes?.mobile || '';

      try {
        const rows = await supabaseRest(
          `member_subscriptions?razorpay_subscription_id=eq.${encodeURIComponent(subscriptionId)}&select=*`
        );
        const row = Array.isArray(rows) ? rows[0] : null;
        if (row) {
          userId = row.user_id || userId;
          mobile = row.mobile || mobile;
        }
      } catch {
        /* ignore */
      }

      if (!userId && mobile) {
        try {
          const members = await supabaseRest(
            `members?mobile=eq.${encodeURIComponent(mobile)}&select=id,mobile&limit=1`
          );
          if (Array.isArray(members) && members[0]) {
            userId = members[0].id;
            mobile = members[0].mobile;
          }
        } catch {
          /* ignore */
        }
      }

      if (!userId) {
        return res.status(200).json({ ok: true, skipped: 'user not found', subscriptionId });
      }

      const result = await creditAutopayInvestment({
        userId,
        mobile,
        amount,
        paymentId: String(paymentId),
        subscriptionId,
      });

      return res.status(200).json({ ok: true, eventName, ...result });
    }

    return res.status(200).json({ ok: true, ignored: eventName });
  } catch (e) {
    console.error('razorpay-webhook', e);
    return res.status(500).json({ error: e?.message || 'Webhook failed' });
  }
}
