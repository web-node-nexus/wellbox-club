// Razorpay — order_id + poll + force-close stuck UPI QR

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

function removeOverlayHelper() {
  document.getElementById('jb-rzp-paid-helper')?.remove();
}

/** Floating button above Razorpay iframe (z-index max) */
function showOverlayHelper(orderId: string, onPaid: () => void) {
  removeOverlayHelper();
  const el = document.createElement('div');
  el.id = 'jb-rzp-paid-helper';
  el.style.cssText = [
    'position:fixed',
    'left:50%',
    'bottom:24px',
    'transform:translateX(-50%)',
    'z-index:2147483647',
    'display:flex',
    'flex-direction:column',
    'gap:8px',
    'align-items:center',
    'font-family:system-ui,sans-serif',
    'max-width:92vw',
  ].join(';');

  const tip = document.createElement('div');
  tip.textContent = 'Paid on UPI but window stuck? Tap below';
  tip.style.cssText =
    'background:#111827;color:#fde68a;padding:8px 12px;border-radius:10px;font-size:12px;text-align:center';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'I have paid — continue';
  btn.style.cssText = [
    'background:linear-gradient(90deg,#22c55e,#16a34a)',
    'color:#fff',
    'border:none',
    'padding:14px 22px',
    'border-radius:12px',
    'font-weight:700',
    'font-size:15px',
    'cursor:pointer',
    'box-shadow:0 8px 24px rgba(0,0,0,.35)',
  ].join(';');

  btn.onclick = async () => {
    btn.disabled = true;
    btn.textContent = 'Checking payment…';
    try {
      const st = await fetchRazorpayOrderStatus(orderId);
      if (st.paid) {
        onPaid();
      } else {
        btn.disabled = false;
        btn.textContent = 'Not captured yet — tap again';
        tip.textContent =
          'Razorpay me abhi paid nahi mila. 15 sec wait karke phir dabao. Ya Razorpay X se band karke dubara try.';
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Check failed — tap again';
    }
  };

  el.appendChild(tip);
  el.appendChild(btn);
  document.body.appendChild(el);
}

function forceCloseRazorpayDom() {
  try {
    document.querySelectorAll('.razorpay-container').forEach(n => n.remove());
    document.querySelectorAll('.razorpay-backdrop').forEach(n => n.remove());
    document
      .querySelectorAll('iframe[src*="razorpay"], iframe[src*="api.razorpay"]')
      .forEach(n => n.parentElement?.remove());
    document.body.style.overflow = '';
  } catch {
    /* ignore */
  }
}

export const initiatePayment = async (options: PaymentOptions) => {
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let finished = false;
  let rzp: any = null;

  const finishSuccess = (response: any) => {
    if (finished) return;
    finished = true;
    if (pollTimer) clearInterval(pollTimer);
    removeOverlayHelper();
    try {
      rzp?.close?.();
    } catch {
      /* ignore */
    }
    forceCloseRazorpayDom();
    options.onSuccess(response);
  };

  const finishFailure = (error: any) => {
    if (finished) return;
    finished = true;
    if (pollTimer) clearInterval(pollTimer);
    removeOverlayHelper();
    options.onFailure(error);
  };

  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) throw new Error('Failed to load Razorpay SDK');

    const order = await createRazorpayOrder(options.amount, options.description);
    options.onOrderCreated?.(order.id);
    const contact = (options.prefill?.contact || '').replace(/\D/g, '').slice(-10);

    const onPaidFromHelper = () => {
      finishSuccess({
        razorpay_order_id: order.id,
        razorpay_payment_id: `paid_${order.id}`,
        via: 'overlay_helper',
      });
    };

    showOverlayHelper(order.id, () => {
      void fetchRazorpayOrderStatus(order.id).then(st => {
        finishSuccess({
          razorpay_order_id: order.id,
          razorpay_payment_id: st.payment_id || `paid_${order.id}`,
          via: 'overlay_helper',
        });
      });
    });

    pollTimer = setInterval(async () => {
      try {
        const st = await fetchRazorpayOrderStatus(order.id);
        if (st.paid) {
          finishSuccess({
            razorpay_order_id: order.id,
            razorpay_payment_id: st.payment_id || `paid_${order.id}`,
            via: 'order_status_poll',
          });
        }
      } catch {
        /* keep polling */
      }
    }, 2500);

    setTimeout(() => {
      if (pollTimer) clearInterval(pollTimer);
    }, 12 * 60 * 1000);

    const razorpayOptions = {
      key: order.keyId || RAZORPAY_KEY_ID,
      order_id: order.id,
      name: 'Jewellbox Club',
      description: options.description || 'Payment for Jewellbox Club',
      handler: function (response: any) {
        finishSuccess(response);
        if (response?.razorpay_signature) {
          void verifyRazorpayPayment(response).catch(() => undefined);
        }
      },
      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: contact || undefined,
      },
      theme: { color: '#F59E0B' },
      // Prefer UPI apps / collect over stuck QR where possible
      config: {
        display: {
          preferences: {
            show_default_blocks: true,
          },
        },
      },
      modal: {
        ondismiss: function () {
          removeOverlayHelper();
          if (!finished) {
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

    rzp = new window.Razorpay(razorpayOptions);
    rzp.on('payment.failed', function (response: any) {
      removeOverlayHelper();
      finishFailure(response?.error || response);
    });

    rzp.open();

    // Re-show helper after open (Razorpay may steal focus)
    setTimeout(() => {
      if (!finished) showOverlayHelper(order.id, onPaidFromHelper);
    }, 800);

    return rzp;
  } catch (error) {
    removeOverlayHelper();
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
