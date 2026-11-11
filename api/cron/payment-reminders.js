/**
 * Payment contribution reminders — every 6 hours.
 *
 * Window: 5 days before due date through due day.
 * Sends: in-app notification + Web Push (if subscribed).
 *
 * Auth: Authorization: Bearer <CRON_SECRET>  OR  ?secret=<CRON_SECRET>
 * Vercel Cron sends Authorization automatically when CRON_SECRET is set.
 *
 * Env required on Vercel:
 *   SUPABASE_URL or VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (preferred) or VITE_SUPABASE_ANON_KEY
 *   VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY  (for push; in-app still works without)
 *   CRON_SECRET (recommended)
 *   VAPID_SUBJECT optional (mailto:…)
 */
import webpush from 'web-push';
import { supabaseRest } from '../_lib/supabaseAdmin.js';
import {
  getNextContributionDueDate,
  getSuggestedAmount,
  daysUntilDue,
  isInPaymentReminderWindow,
  ymd,
  currentSlotKey,
  REMINDER_DAYS_BEFORE,
} from '../_lib/contributionDue.js';

const FALLBACK_PUBLIC =
  'BB8fYXKhcye-zTVEmMM_rI9jZ_rwlaqcao-3oWO790QZBh91Yg9L9CSc3Ui_B4HemKeuQp0mQsgo2MorpSlx9lY';

function authorize(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // allow if not configured (dev)
  const auth = req.headers.authorization || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const q = (req.query && req.query.secret) || '';
  return bearer === secret || q === secret;
}

function configureWebPush() {
  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY || FALLBACK_PUBLIC;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!privateKey) return null;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:support@jewellbox.club',
    publicKey,
    privateKey
  );
  return { publicKey };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!authorize(req)) {
    return res.status(401).json({ error: 'Unauthorized — set CRON_SECRET' });
  }

  const now = new Date();
  const slot = currentSlotKey(now);
  const pushReady = configureWebPush();

  const summary = {
    slot,
    checked: 0,
    inWindow: 0,
    notified: 0,
    pushed: 0,
    skipped: 0,
    errors: [],
  };

  try {
    const members = await supabaseRest(
      'members?select=id,name,mobile,join_date,role&role=neq.admin&role=neq.individual&limit=5000'
    );
    const list = Array.isArray(members) ? members : [];

    for (const m of list) {
      summary.checked += 1;
      try {
        const invs = await supabaseRest(
          `investments?user_id=eq.${encodeURIComponent(m.id)}&select=id,amount,date&order=date.desc&limit=50`
        );
        const investments = Array.isArray(invs) ? invs : [];
        const due = getNextContributionDueDate({
          joinDate: m.join_date,
          investments,
          now,
        });
        if (!isInPaymentReminderWindow(due, now)) continue;
        summary.inWindow += 1;

        const dueDate = ymd(due);
        const amount = getSuggestedAmount(investments);
        const daysLeft = daysUntilDue(due, now);

        // Dedupe this 6h slot
        const logId = `pr_${m.id}_${dueDate}_${slot}`.slice(0, 80);
        try {
          await supabaseRest('payment_reminder_log', {
            method: 'POST',
            body: [
              {
                id: logId,
                user_id: m.id,
                due_date: dueDate,
                slot_key: slot,
                created_at: now.toISOString(),
              },
            ],
            headers: { Prefer: 'return=minimal' },
          });
        } catch (e) {
          // unique violation → already sent this slot
          if (/duplicate|unique|23505/i.test(String(e?.message || e?.data || ''))) {
            summary.skipped += 1;
            continue;
          }
          // table missing — still try notify, but don't crash loop
          if (/Could not find|PGRST|relation|404/i.test(String(e?.message || ''))) {
            /* continue without dedupe */
          } else {
            throw e;
          }
        }

        const title =
          daysLeft === 0
            ? 'Monthly contribution due today'
            : `Contribution due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;
        const message = `Pay ₹${Number(amount).toLocaleString('en-IN')} by ${dueDate}. Open Contributions to pay. Reminder window: ${REMINDER_DAYS_BEFORE} days before due (every 6 hours).`;

        const ntfId = `ntf_pay_${m.id}_${dueDate}_${slot}`.slice(0, 80);
        try {
          await supabaseRest('notifications', {
            method: 'POST',
            body: [
              {
                id: ntfId,
                audience: 'user',
                user_id: m.id,
                type: 'payment_reminder',
                title,
                message,
                meta: {
                  dueDate,
                  amount,
                  daysLeft,
                  slot,
                },
                read: false,
                created_at: now.toISOString(),
              },
            ],
          });
          summary.notified += 1;
        } catch (e) {
          summary.errors.push({ userId: m.id, step: 'notification', error: e.message });
        }

        if (pushReady) {
          let subs = [];
          try {
            subs = await supabaseRest(
              `push_subscriptions?user_id=eq.${encodeURIComponent(m.id)}&select=*`
            );
          } catch {
            subs = [];
          }
          if (!Array.isArray(subs)) subs = [];

          for (const s of subs) {
            try {
              await webpush.sendNotification(
                {
                  endpoint: s.endpoint,
                  keys: { p256dh: s.p256dh, auth: s.auth },
                },
                JSON.stringify({
                  title,
                  body: message,
                  url: '/contributions',
                  tag: `pay-${dueDate}`,
                })
              );
              summary.pushed += 1;
            } catch (pe) {
              const status = pe?.statusCode || pe?.status;
              if (status === 404 || status === 410) {
                try {
                  await supabaseRest(
                    `push_subscriptions?endpoint=eq.${encodeURIComponent(s.endpoint)}`,
                    { method: 'DELETE' }
                  );
                } catch {
                  /* ignore */
                }
              } else {
                summary.errors.push({
                  userId: m.id,
                  step: 'push',
                  error: pe?.message || String(pe),
                });
              }
            }
          }
        }
      } catch (e) {
        summary.errors.push({ userId: m.id, step: 'member', error: e.message });
      }
    }

    return res.status(200).json({
      ok: true,
      pushConfigured: Boolean(pushReady),
      reminderDaysBefore: REMINDER_DAYS_BEFORE,
      ...summary,
    });
  } catch (e) {
    console.error('payment-reminders cron', e);
    return res.status(500).json({
      error: e?.message || 'Cron failed',
      hint: 'Run supabase/push_reminders_migration.sql and set Supabase + VAPID env on Vercel.',
      ...summary,
    });
  }
}
