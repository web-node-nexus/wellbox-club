// Razorpay Checkout — close on: success | X | Close button | 5 min timeout

const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TwScjdiSaPmJyT';

/** Auto-close unpaid checkout after this many ms */
const CHECKOUT_IDLE_TIMEOUT_MS = 5 * 60 * 1000;

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

function forceCloseRazorpayDom() {
  try {
    document.querySelectorAll('.razorpay-container').forEach(n => n.remove());
    document.querySelectorAll('.razorpay-backdrop').forEach(n => n.remove());
    document.querySelectorAll('[class*="razorpay"]').forEach(n => {
      const c = n as HTMLElement;
      if (c.className?.toString?.().includes('razorpay')) {
        try {
          c.remove();
        } catch {
          c.style.display = 'none';
        }
      }
    });
    document
      .querySelectorAll('iframe[src*="razorpay"], iframe[src*="api.razorpay"]')
      .forEach(n => {
        n.parentElement?.remove();
        n.remove();
      });
    document.body.style.overflow = '';
  } catch {
    /* ignore */
  }
}

/** Buttons ABOVE Razorpay iframe so user can always exit */
function showOverlayHelper(opts: {
  orderId: string;
  onConfirmPaid: () => void;
  onCloseWindow: () => void;
}) {
  removeOverlayHelper();
  const el = document.createElement('div');
  el.id = 'jb-rzp-paid-helper';
  el.style.cssText = [
    'position:fixed',
    'left:50%',
    'bottom:20px',
    'transform:translateX(-50%)',
    'z-index:2147483647',
    'display:flex',
    'flex-direction:column',
    'gap:10px',
    'align-items:stretch',
    'font-family:system-ui,sans-serif',
    'width:min(360px,92vw)',
    'pointer-events:auto',
  ].join(';');

  const tip = document.createElement('div');
  tip.textContent = 'Payment window open · closes on pay, Close, or after 5 min';
  tip.style.cssText =
    'background:#111827;color:#fde68a;padding:8px 12px;border-radius:10px;font-size:12px;text-align:center';

  const paidBtn = document.createElement('button');
  paidBtn.type = 'button';
  paidBtn.textContent = 'I have paid — continue';
  paidBtn.style.cssText = [
    'background:linear-gradient(90deg,#22c55e,#16a34a)',
    'color:#fff',
    'border:none',
    'padding:14px 18px',
    'border-radius:12px',
    'font-weight:700',
    'font-size:15px',
    'cursor:pointer',
    'box-shadow:0 8px 24px rgba(0,0,0,.35)',
  ].join(';');

  paidBtn.onclick = async () => {
    paidBtn.disabled = true;
    paidBtn.textContent = 'Checking…';
    try {
      const st = await fetchRazorpayOrderStatus(opts.orderId);
      if (st.paid) {
        opts.onConfirmPaid();
      } else {
        paidBtn.disabled = false;
        paidBtn.textContent = 'Not paid yet — try again';
        tip.textContent =
          'Razorpay me payment abhi captured nahi hai. Thoda wait karke phir dabao, ya Close.';
      }
    } catch {
      paidBtn.disabled = false;
      paidBtn.textContent = 'Check failed — try again';
    }
  };

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = 'Close payment window';
  closeBtn.style.cssText = [
    'background:#fff',
    'color:#111',
    'border:2px solid #e5e7eb',
    'padding:12px 18px',
    'border-radius:12px',
    'font-weight:700',
    'font-size:14px',
    'cursor:pointer',
  ].join(';');
  closeBtn.onclick = () => opts.onCloseWindow();

  el.appendChild(tip);
  el.appendChild(paidBtn);
  el.appendChild(closeBtn);
  document.body.appendChild(el);
}

export const initiatePayment = async (options: PaymentOptions) => {
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let finished = false;
  let rzp: any = null;

  const cleanupTimers = () => {
    if (pollTimer) clearInterval(pollTimer);
    if (idleTimer) clearTimeout(idleTimer);
    pollTimer = null;
    idleTimer = null;
  };

  const hardCloseCheckout = () => {
    try {
      rzp?.close?.();
    } catch {
      /* ignore */
    }
    forceCloseRazorpayDom();
    removeOverlayHelper();
  };

  const finishSuccess = (response: any) => {
    if (finished) return;
    finished = true;
    cleanupTimers();
    hardCloseCheckout();
    options.onSuccess(response);
  };

  const finishFailure = (error: any) => {
    if (finished) return;
    finished = true;
    cleanupTimers();
    hardCloseCheckout();
    options.onFailure(error);
  };

  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) throw new Error('Failed to load Razorpay SDK');

    const order = await createRazorpayOrder(options.amount, options.description);
    options.onOrderCreated?.(order.id);
    const contact = (options.prefill?.contact || '').replace(/\D/g, '').slice(-10);

    const mountHelper = () => {
      if (finished) return;
      showOverlayHelper({
        orderId: order.id,
        onConfirmPaid: () => {
          void fetchRazorpayOrderStatus(order.id).then(st => {
            finishSuccess({
              razorpay_order_id: order.id,
              razorpay_payment_id: st.payment_id || `paid_${order.id}`,
              via: 'overlay_paid',
            });
          });
        },
        onCloseWindow: () => {
          void fetchRazorpayOrderStatus(order.id)
            .then(st => {
              if (st.paid) {
                finishSuccess({
                  razorpay_order_id: order.id,
                  razorpay_payment_id: st.payment_id || `paid_${order.id}`,
                  via: 'close_after_pay',
                });
              } else {
                finishFailure({ message: 'Payment window closed', code: 'dismissed' });
              }
            })
            .catch(() =>
              finishFailure({ message: 'Payment window closed', code: 'dismissed' })
            );
        },
      });
    };

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

    // NEVER leave Razorpay open forever — auto close after 5 minutes
    idleTimer = setTimeout(() => {
      if (!finished) {
        finishFailure({
          message: 'Payment timed out after 5 minutes',
          code: 'timeout',
        });
      }
    }, CHECKOUT_IDLE_TIMEOUT_MS);

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
      modal: {
        ondismiss: function () {
          if (finished) return;
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
        },
        escape: true,
        // Allow closing without extra confirm dialog stuck
        confirm_close: false,
        animation: true,
      },
      retry: { enabled: true, max_count: 3 },
    };

    rzp = new window.Razorpay(razorpayOptions);
    rzp.on('payment.failed', function (response: any) {
      finishFailure(response?.error || response);
    });

    rzp.open();
    mountHelper();
    setTimeout(mountHelper, 600);
    setTimeout(mountHelper, 1500);

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
