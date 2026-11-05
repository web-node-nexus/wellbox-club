/**
 * Razorpay Standard Checkout (handler) + silent order poll.
 * When UPI succeeds, Checkout closes itself OR we close it after order shows paid.
 * No "I have paid" button.
 */

const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TwScjdiSaPmJyT';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise(resolve => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface PaymentOptions {
  amount: number;
  currency?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onOrderCreated?: (orderId: string) => void;
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

export async function createRazorpayOrder(amountInr: number, description?: string) {
  const res = await fetch('/api/create-razorpay-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountInr, description }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Could not create payment order (${res.status})`);
  }
  if (!data?.id) throw new Error('Invalid order response from server');
  return data as { id: string; amount: number; currency: string; keyId?: string };
}

export async function verifyRazorpayPayment(paymentDetails: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  const res = await fetch('/api/verify-razorpay-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentDetails),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.verified) {
    throw new Error(data?.error || 'Payment verification failed');
  }
  return data;
}

export async function fetchRazorpayOrderStatus(orderId: string) {
  const res = await fetch(
    `/api/razorpay-order-status?order_id=${encodeURIComponent(orderId)}`
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Status check failed');
  return data as {
    id: string;
    status: string;
    paid: boolean;
    payment_id?: string | null;
    payment_status?: string | null;
  };
}

/** Keep checking until Razorpay marks order paid (UPI lag). */
export async function waitUntilOrderPaid(
  orderId: string,
  opts?: { attempts?: number; gapMs?: number; signal?: { stopped: boolean } }
) {
  const attempts = opts?.attempts ?? 40;
  const gapMs = opts?.gapMs ?? 2000;
  let last: Awaited<ReturnType<typeof fetchRazorpayOrderStatus>> | null = null;

  for (let i = 0; i < attempts; i++) {
    if (opts?.signal?.stopped) break;
    try {
      last = await fetchRazorpayOrderStatus(orderId);
      if (last.paid) return last;
    } catch {
      // keep trying — network blips during UPI return
    }
    await new Promise(r => setTimeout(r, gapMs));
  }
  return last;
}

export const initiatePayment = async (options: PaymentOptions) => {
  let settled = false;
  const signal = { stopped: false };
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let rzp: any = null;

  const cleanup = () => {
    signal.stopped = true;
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    document.removeEventListener('visibilitychange', onVisible);
    window.removeEventListener('focus', onVisible);
  };

  const finishSuccess = (response: any) => {
    if (settled) return;
    settled = true;
    cleanup();
    try {
      rzp?.close?.();
    } catch {
      /* already closed */
    }
    options.onSuccess(response);
  };

  const finishFailure = (error: any) => {
    if (settled) return;
    settled = true;
    cleanup();
    options.onFailure(error);
  };

  const checkPaidAndClose = async (orderId: string) => {
    if (settled) return;
    try {
      const st = await fetchRazorpayOrderStatus(orderId);
      if (st.paid) {
        finishSuccess({
          razorpay_payment_id: st.payment_id || `paid_${orderId}`,
          razorpay_order_id: orderId,
          razorpay_signature: '',
          auto_detected: true,
        });
      }
    } catch {
      /* ignore, next poll */
    }
  };

  const onVisible = () => {
    if (document.visibilityState === 'hidden') return;
    const orderId = sessionStorage.getItem('jb_rzp_order_id');
    if (orderId) void checkPaidAndClose(orderId);
  };

  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) throw new Error('Failed to load Razorpay SDK');

    const order = await createRazorpayOrder(options.amount, options.description);
    options.onOrderCreated?.(order.id);
    sessionStorage.setItem('jb_rzp_order_id', order.id);

    const contact = (options.prefill?.contact || '').replace(/\D/g, '').slice(-10);

    const razorpayOptions = {
      key: order.keyId || RAZORPAY_KEY_ID,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Jewellbox Club',
      description: options.description || 'Payment for Jewellbox Club',
      // Handler = Checkout auto-closes when Razorpay confirms (same as other sites)
      handler: function (response: any) {
        finishSuccess(response);
      },
      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: contact || undefined,
      },
      theme: { color: '#F59E0B' },
      modal: {
        ondismiss: function () {
          // User closed — but money may already be deducted; check once more
          void (async () => {
            try {
              const st = await fetchRazorpayOrderStatus(order.id);
              if (st.paid) {
                finishSuccess({
                  razorpay_payment_id: st.payment_id || `paid_${order.id}`,
                  razorpay_order_id: order.id,
                  razorpay_signature: '',
                  auto_detected: true,
                });
                return;
              }
            } catch {
              /* fall through */
            }
            finishFailure({ message: 'Payment cancelled', code: 'dismissed' });
          })();
        },
        escape: true,
        confirm_close: false,
      },
      retry: { enabled: true, max_count: 3 },
    };

    rzp = new window.Razorpay(razorpayOptions);
    rzp.on('payment.failed', function (response: any) {
      finishFailure(response?.error || response);
    });

    // Silent poll — closes Checkout as soon as order is paid (fixes stuck UPI QR)
    pollTimer = setInterval(() => {
      void checkPaidAndClose(order.id);
    }, 2500);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);

    // Safety stop after 8 minutes
    setTimeout(() => {
      signal.stopped = true;
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    }, 8 * 60 * 1000);

    rzp.open();
    return rzp;
  } catch (error) {
    finishFailure(error);
    throw error;
  }
};

export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const isRazorpayAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined';
};
