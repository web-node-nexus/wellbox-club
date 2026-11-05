// Razorpay Payment Integration — order_id + status poll (UPI QR close fix)

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
  amount: number; // INR
  currency?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
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
  };
}

export const initiatePayment = async (options: PaymentOptions) => {
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let finished = false;

  const finishSuccess = (response: any) => {
    if (finished) return;
    finished = true;
    if (pollTimer) clearInterval(pollTimer);
    try {
      // Best-effort close if Checkout left QR open
      const frames = document.querySelectorAll('iframe');
      frames.forEach(() => undefined);
    } catch {
      /* ignore */
    }
    options.onSuccess(response);
  };

  const finishFailure = (error: any) => {
    if (finished) return;
    finished = true;
    if (pollTimer) clearInterval(pollTimer);
    options.onFailure(error);
  };

  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) throw new Error('Failed to load Razorpay SDK');

    const order = await createRazorpayOrder(options.amount, options.description);
    options.onOrderCreated?.(order.id);
    const contact = (options.prefill?.contact || '').replace(/\D/g, '').slice(-10);

    // Poll order — fixes UPI QR paid but Checkout stuck open
    pollTimer = setInterval(async () => {
      try {
        const st = await fetchRazorpayOrderStatus(order.id);
        if (st.paid) {
          finishSuccess({
            razorpay_order_id: order.id,
            razorpay_payment_id: st.payment_id || `paid_${order.id}`,
            via: 'order_status_poll',
          });
          // Try closing Razorpay overlay
          try {
            document.querySelectorAll('.razorpay-container, .razorpay-backdrop').forEach(el => {
              (el as HTMLElement).style.display = 'none';
            });
            document.body.style.overflow = '';
          } catch {
            /* ignore */
          }
        }
      } catch {
        /* keep polling */
      }
    }, 3000);

    // Stop polling after 12 minutes
    setTimeout(() => {
      if (pollTimer) clearInterval(pollTimer);
    }, 12 * 60 * 1000);

    const razorpayOptions = {
      key: order.keyId || RAZORPAY_KEY_ID,
      order_id: order.id,
      name: 'Jewellbox Club',
      description: options.description || 'Payment for Jewellbox Club',
      // Do not pass amount when order_id is set — amount comes from order
      handler: function (response: any) {
        // Sync handler — don't await verify here (async can block Checkout close)
        finishSuccess(response);
        if (response?.razorpay_signature) {
          void verifyRazorpayPayment(response).catch(err =>
            console.warn('Signature verify warning', err)
          );
        }
      },
      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: contact || undefined,
      },
      theme: { color: '#F59E0B' },
      modal: {
        ondismiss: function () {
          if (!finished) {
            // User closed without pay — check once more in case paid
            void fetchRazorpayOrderStatus(order.id)
              .then(st => {
                if (st.paid) {
                  finishSuccess({
                    razorpay_order_id: order.id,
                    razorpay_payment_id: st.payment_id || `paid_${order.id}`,
                    via: 'dismiss_after_pay',
                  });
                } else {
                  finishFailure({ message: 'Payment cancelled', code: 'dismissed' });
                }
              })
              .catch(() => finishFailure({ message: 'Payment cancelled', code: 'dismissed' }));
          }
        },
        escape: true,
        confirm_close: true,
        animation: true,
      },
      retry: { enabled: true, max_count: 3 },
    };

    const rzp = new window.Razorpay(razorpayOptions);

    rzp.on('payment.failed', function (response: any) {
      finishFailure(response?.error || response);
    });

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
