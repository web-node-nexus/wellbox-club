/**
 * Public VAPID key for client Web Push subscribe.
 * Set VAPID_PUBLIC_KEY or VITE_VAPID_PUBLIC_KEY on Vercel.
 */
const FALLBACK_PUBLIC =
  'BB8fYXKhcye-zTVEmMM_rI9jZ_rwlaqcao-3oWO790QZBh91Yg9L9CSc3Ui_B4HemKeuQp0mQsgo2MorpSlx9lY';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const publicKey =
    process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY || FALLBACK_PUBLIC;

  return res.status(200).json({ publicKey });
}
