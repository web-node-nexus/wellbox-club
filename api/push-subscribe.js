/**
 * Save / remove Web Push subscription for a logged-in member.
 * POST { userId, subscription } | DELETE { userId, endpoint }
 */
import { supabaseRest } from './_lib/supabaseAdmin.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    if (req.method === 'DELETE') {
      const endpoint = body.endpoint;
      if (!endpoint) return res.status(400).json({ error: 'endpoint required' });
      await supabaseRest(`push_subscriptions?endpoint=eq.${encodeURIComponent(endpoint)}`, {
        method: 'DELETE',
      });
      return res.status(200).json({ ok: true });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const userId = String(body.userId || '').trim();
    const sub = body.subscription;
    if (!userId || !sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return res.status(400).json({ error: 'userId and subscription.keys required' });
    }

    const id = `ps_${Buffer.from(sub.endpoint).toString('base64url').slice(0, 40)}_${userId.slice(-6)}`;
    const row = {
      id,
      user_id: userId,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
      user_agent: String(body.userAgent || '').slice(0, 300),
      updated_at: new Date().toISOString(),
    };

    // Upsert by endpoint: delete old then insert (anon-friendly)
    try {
      await supabaseRest(`push_subscriptions?endpoint=eq.${encodeURIComponent(sub.endpoint)}`, {
        method: 'DELETE',
      });
    } catch {
      /* ok */
    }

    await supabaseRest('push_subscriptions', {
      method: 'POST',
      body: [{ ...row, created_at: new Date().toISOString() }],
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    });

    return res.status(200).json({ ok: true, id });
  } catch (e) {
    console.error('push-subscribe', e);
    return res.status(500).json({
      error: e?.message || 'Failed to save push subscription',
      hint: 'Run supabase/push_reminders_migration.sql in Supabase SQL Editor.',
    });
  }
}
