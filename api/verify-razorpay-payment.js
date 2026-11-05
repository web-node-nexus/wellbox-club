import crypto from 'crypto';

/**
 * Verify Razorpay Checkout signature (server-side).
 * Env: RAZORPAY_KEY_SECRET
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(500).json({ error: 'RAZORPAY_KEY_SECRET not configured' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment fields', verified: false });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', keySecret).update(payload).digest('hex');
    const verified = expected === razorpay_signature;

    if (!verified) {
      return res.status(400).json({ verified: false, error: 'Invalid payment signature' });
    }

    return res.status(200).json({ verified: true, razorpay_payment_id, razorpay_order_id });
  } catch (e) {
    return res.status(500).json({ verified: false, error: e?.message || 'Verify failed' });
  }
}
