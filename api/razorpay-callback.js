/**
 * Razorpay Checkout POSTs here on success when redirect:true.
 * Convert to a GET redirect so the SPA can finish join/invest.
 */
export default async function handler(req, res) {
  const pick = (obj = {}) => ({
    razorpay_payment_id: obj.razorpay_payment_id || obj.razorpayPaymentId || '',
    razorpay_order_id: obj.razorpay_order_id || obj.razorpayOrderId || '',
    razorpay_signature: obj.razorpay_signature || obj.razorpaySignature || '',
  });

  let fields = { razorpay_payment_id: '', razorpay_order_id: '', razorpay_signature: '' };

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? (() => {
      try {
        return JSON.parse(req.body || '{}');
      } catch {
        // application/x-www-form-urlencoded style already parsed by Vercel sometimes
        return {};
      }
    })() : req.body || {};

    // Also support raw urlencoded if body is empty but query has data
    fields = pick({ ...req.query, ...body });
  } else if (req.method === 'GET') {
    fields = pick(req.query || {});
  } else {
    return res.status(405).send('Method not allowed');
  }

  const q = new URLSearchParams();
  if (fields.razorpay_payment_id) q.set('razorpay_payment_id', fields.razorpay_payment_id);
  if (fields.razorpay_order_id) q.set('razorpay_order_id', fields.razorpay_order_id);
  if (fields.razorpay_signature) q.set('razorpay_signature', fields.razorpay_signature);

  const dest = `/payment/callback${q.toString() ? `?${q.toString()}` : ''}`;
  res.statusCode = 302;
  res.setHeader('Location', dest);
  res.end();
}
