// Razorpay Payment Integration Service

// Razorpay API Key (Public key - safe to expose in frontend)
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Ttz1VV7B9WjAtO';

// Load Razorpay script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
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

// Payment options interface
interface PaymentOptions {
  amount: number; // Amount in paise (1 rupee = 100 paise)
  currency?: string;
  receipt?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

// Initialize Razorpay payment
export const initiatePayment = async (options: PaymentOptions) => {
  try {
    // Load Razorpay script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    // Convert amount to paise (Razorpay expects amount in paise)
    const amountInPaise = Math.round(options.amount * 100);

    // Razorpay options
    const razorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: options.currency || 'INR',
      name: 'Jewellbox Club',
      description: options.description || 'Payment for Jewellbox Club',
      image: 'https://your-domain.com/logo.png', // Add your logo URL
      handler: function (response: any) {
        // Payment successful
        console.log('Payment successful:', response);
        options.onSuccess(response);
      },
      prefill: options.prefill || {},
      theme: {
        color: '#F59E0B', // Amber color matching your brand
      },
      modal: {
        ondismiss: function () {
          console.log('Payment modal closed');
        },
      },
    };

    // Create Razorpay instance
    const rzp = new window.Razorpay(razorpayOptions);

    // Handle payment failure
    rzp.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      options.onFailure(response.error);
    });

    // Open Razorpay modal
    rzp.open();

    return rzp;
  } catch (error) {
    console.error('Error initiating payment:', error);
    options.onFailure(error);
    throw error;
  }
};

// Verify payment (should be done on backend with secret key)
export const verifyPayment = async (paymentDetails: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) => {
  // In production, this should call your backend API
  // Backend will use the secret key to verify the signature
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentDetails),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

// Create order (should be done on backend)
export const createOrder = async (amount: number, currency: string = 'INR') => {
  // In production, this should call your backend API
  // Backend will use the secret key to create the order
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Order creation error:', error);
    throw error;
  }
};

// Helper function to format amount
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Check if Razorpay is available
export const isRazorpayAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.Razorpay !== 'undefined';
};
