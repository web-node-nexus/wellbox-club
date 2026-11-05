/**
 * Razorpay Standard Checkout with redirect — same UX as most sites:
 * pay success → Razorpay closes / redirects automatically (no "I have paid" button).
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
  /** Only used if Checkout returns via handler (rare with redirect) */
  onSuccess?: (response: any) => void;
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
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) throw new Error('Failed to load Razorpay SDK');

    const order = await createRazorpayOrder(options.amount, options.description);
    options.onOrderCreated?.(order.id);

    // So callback page can match order if needed
    sessionStorage.setItem('jb_rzp_order_id', order.id);

    const contact = (options.prefill?.contact || '').replace(/\D/g, '').slice(-10);
    const callbackUrl = `${window.location.origin}/payment/callback`;

    const razorpayOptions = {
      key: order.keyId || RAZORPAY_KEY_ID,
      order_id: order.id,
      name: 'Jewellbox Club',
      description: options.description || 'Payment for Jewellbox Club',
      // Redirect mode = auto leave Checkout after pay (like other platforms)
      callback_url: callbackUrl,
      redirect: true,
      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: contact || undefined,
      },
      theme: { color: '#F59E0B' },
      // Backup if Razorpay still fires handler without redirect
      handler: function (response: any) {
        if (options.onSuccess) {
          options.onSuccess(response);
          return;
        }
        const q = new URLSearchParams({
          razorpay_payment_id: response.razorpay_payment_id || '',
          razorpay_order_id: response.razorpay_order_id || order.id,
          razorpay_signature: response.razorpay_signature || '',
        });
        window.location.href = `${callbackUrl}?${q.toString()}`;
      },
      modal: {
        ondismiss: function () {
          options.onFailure({ message: 'Payment cancelled', code: 'dismissed' });
        },
        escape: true,
        confirm_close: false,
      },
      retry: { enabled: true, max_count: 3 },
    };

    const rzp = new window.Razorpay(razorpayOptions);
    rzp.on('payment.failed', function (response: any) {
      options.onFailure(response?.error || response);
    });
    rzp.open();
    return rzp;
  } catch (error) {
    options.onFailure(error);
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
