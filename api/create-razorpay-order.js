/**
 * Vercel Serverless — create Razorpay Order (required for live capture + Checkout close).
 * Env (Vercel, NOT VITE_): RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({
      error:
        'Razorpay server keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on Vercel (not VITE_).',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const amountInr = Number(body.amount);
    if (!amountInr || amountInr < 1) {
      return res.status(400).json({ error: 'Amount must be at least ₹1' });
    }

    const amountPaise = Math.round(amountInr * 100);
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: body.currency || 'INR',
        receipt: `jb_${Date.now()}`.slice(0, 40),
        notes: {
          source: 'jewellbox-club',
          description: String(body.description || '').slice(0, 100),
        },
      }),
    });

    const data = await rzpRes.json();
    if (!rzpRes.ok) {
      console.error('Razorpay order error', data);
      return res.status(rzpRes.status).json({
        error: data?.error?.description || 'Could not create Razorpay order',
      });
    }

    return res.status(200).json({
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e?.message || 'Order creation failed' });
  }
}
