/**
 * Verify Razorpay Subscription auth payment signature.
 * Signature = HMAC_SHA256(razorpay_payment_id + "|" + subscription_id, key_secret)
 */
import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(500).json({ error: 'RAZORPAY_KEY_SECRET not configured', verified: false });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const paymentId = body.razorpay_payment_id;
    const subscriptionId =
      body.razorpay_subscription_id || body.subscription_id || body.subscriptionId;
    const signature = body.razorpay_signature;

    if (!paymentId || !subscriptionId || !signature) {
      return res.status(400).json({
        verified: false,
        error: 'Missing razorpay_payment_id / subscription_id / signature',
      });
    }

    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${paymentId}|${subscriptionId}`)
      .digest('hex');

    const verified = expected === signature;
    if (!verified) {
      return res.status(400).json({ verified: false, error: 'Invalid subscription signature' });
    }

    return res.status(200).json({
      verified: true,
      razorpay_payment_id: paymentId,
      razorpay_subscription_id: subscriptionId,
    });
  } catch (e) {
    return res.status(500).json({ verified: false, error: e?.message || 'Verify failed' });
  }
}
