/**
 * Fetch Razorpay order + payments. Client polls this while Checkout is open.
 * Env: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Razorpay server keys missing' });
  }

  const orderId = req.query?.order_id || req.query?.orderId;
  if (!orderId || typeof orderId !== 'string') {
    return res.status(400).json({ error: 'order_id required' });
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const headers = { Authorization: `Basic ${auth}` };

    const [orderRes, payRes] = await Promise.all([
      fetch(`https://api.razorpay.com/v1/orders/${orderId}`, { headers }),
      fetch(`https://api.razorpay.com/v1/orders/${orderId}/payments`, { headers }),
    ]);

    const order = await orderRes.json();
    if (!orderRes.ok) {
      return res.status(orderRes.status).json({
        error: order?.error?.description || 'Could not fetch order',
      });
    }

    const pays = payRes.ok ? await payRes.json() : { items: [] };
    const items = pays?.items || [];
    const successPay = items.find(
      p => p.status === 'captured' || p.status === 'authorized'
    );
    const anyPayment = successPay || items[0] || null;
    const paid =
      order.status === 'paid' ||
      Number(order.amount_paid) > 0 ||
      Boolean(successPay);

    return res.status(200).json({
      id: order.id,
      status: order.status,
      amount: order.amount,
      amount_paid: order.amount_paid,
      payment_id: anyPayment?.id || null,
      payment_status: anyPayment?.status || null,
      paid,
      payments_count: items.length,
      payments: items.map(p => ({ id: p.id, status: p.status, amount: p.amount })),
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Status check failed' });
  }
}
