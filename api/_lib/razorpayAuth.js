/** Shared Razorpay Basic auth for serverless APIs */
export function getRazorpayAuth() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    const err = new Error(
      'Razorpay server keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on Vercel.'
    );
    err.status = 500;
    throw err;
  }
  return {
    keyId,
    keySecret,
    header: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
  };
}

export async function razorpayFetch(path, { method = 'GET', body } = {}) {
  const { header, keyId } = getRazorpayAuth();
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    method,
    headers: {
      Authorization: header,
      'Content-Type': 'application/json',
    },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(
      data?.error?.description || data?.error?.reason || `Razorpay ${res.status}`
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return { data, keyId };
}
