// Razorpay Payment Integration — Checkout with server-created order_id

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
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

/** Create order on Vercel API (needs RAZORPAY_KEY_SECRET server env) */
export async function createRazorpayOrder(amountInr: number, description?: string) {
  const res = await fetch('/api/create-razorpay-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountInr, description }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Could not create payment order');
  }
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
  const data = await res.json();
  if (!res.ok || !data.verified) {
    throw new Error(data?.error || 'Payment verification failed');
  }
  return data;
}

export const initiatePayment = async (options: PaymentOptions) => {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) throw new Error('Failed to load Razorpay SDK');

    // REQUIRED for live capture + reliable UPI QR close
    const order = await createRazorpayOrder(options.amount, options.description);

    const contact = (options.prefill?.contact || '').replace(/\D/g, '').slice(-10);

    const razorpayOptions = {
      key: order.keyId || RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Jewellbox Club',
      description: options.description || 'Payment for Jewellbox Club',
      order_id: order.id,
      handler: async function (response: any) {
        try {
          if (response?.razorpay_signature) {
            await verifyRazorpayPayment(response);
          }
          options.onSuccess(response);
        } catch (err) {
          console.error('Verify failed', err);
          options.onFailure(err);
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
          console.log('Razorpay checkout dismissed');
        },
        confirm_close: true,
      },
      retry: { enabled: true, max_count: 3 },
    };

    const rzp = new window.Razorpay(razorpayOptions);

    rzp.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response?.error);
      options.onFailure(response?.error || response);
    });

    rzp.open();
    return rzp;
  } catch (error) {
    console.error('Error initiating payment:', error);
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
