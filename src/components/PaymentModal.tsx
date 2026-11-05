import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
  initiatePayment,
  formatAmount,
  fetchRazorpayOrderStatus,
} from '../services/razorpayService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  /** Allow checkout before login (member join flow) */
  guest?: { name: string; mobile: string };
  /** Demo/simulate pay when Razorpay unavailable */
  allowDemoPay?: boolean;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  description,
  guest,
  allowDemoPay = false,
  onSuccess,
  onFailure,
}: PaymentModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'checkout' | 'success' | 'failure'>(
    'idle'
  );
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [checkingPaid, setCheckingPaid] = useState(false);

  const payer = user
    ? { name: user.name, mobile: user.mobile }
    : guest;

  const completeSuccess = (response: any) => {
    setPaymentStatus('success');
    setIsProcessing(false);
    setActiveOrderId(null);
    showToast('success', `Payment of ${formatAmount(amount)} successful!`, 'Success');
    onSuccess?.(response);
    setTimeout(() => {
      onClose();
      setPaymentStatus('idle');
    }, 1200);
  };

  const confirmPaidManually = async () => {
    if (!activeOrderId) {
      showToast('error', 'No active payment order. Open Pay again.', 'Error');
      return;
    }
    setCheckingPaid(true);
    try {
      const st = await fetchRazorpayOrderStatus(activeOrderId);
      if (st.paid) {
        completeSuccess({
          razorpay_order_id: activeOrderId,
          razorpay_payment_id: st.payment_id || `paid_${activeOrderId}`,
          via: 'manual_confirm',
        });
      } else {
        showToast(
          'info',
          'Razorpay me abhi paid nahi dikha. 10 sec wait karke phir try karo, ya UPI app me success check karo.',
          'Not captured yet'
        );
      }
    } catch (e: any) {
      showToast('error', e?.message || 'Could not check payment status', 'Error');
    } finally {
      setCheckingPaid(false);
    }
  };

  const handleDemoPay = () => {
    if (!payer) {
      showToast('error', 'Missing payer details', 'Error');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      completeSuccess({
        razorpay_payment_id: `demo_${Date.now()}`,
        demo: true,
      });
    }, 800);
  };

  const handlePayment = async () => {
    if (!payer) {
      showToast('error', 'Please login or complete signup details first', 'Error');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('idle');
    setActiveOrderId(null);

    try {
      await initiatePayment({
        amount: amount,
        description: description,
        prefill: {
          name: payer.name,
          contact: payer.mobile,
        },
        onOrderCreated: orderId => setActiveOrderId(orderId),
        onSuccess: (response) => {
          if (response?.razorpay_order_id) setActiveOrderId(response.razorpay_order_id);
          completeSuccess(response);
        },
        onFailure: (error: any) => {
          console.error('Payment failed:', error);
          if (error?.code === 'dismissed') {
            setPaymentStatus('checkout');
            setIsProcessing(false);
            showToast('info', 'Checkout closed. If you already paid, tap “I have paid”.', 'Info');
            return;
          }
          setPaymentStatus('failure');
          setIsProcessing(false);
          const msg =
            error?.message ||
            error?.description ||
            'Payment failed. Please try again.';
          showToast('error', msg, 'Error');
          onFailure?.(error);
        },
      });
      setPaymentStatus('checkout');
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failure');
      setIsProcessing(false);
      showToast(
        'error',
        error?.message ||
          'Failed to start payment. Add RAZORPAY_KEY_SECRET on Vercel and Redeploy.',
        'Error'
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-b from-slate-900 to-purple-950 rounded-2xl max-w-md w-full p-6 border border-amber-500/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Payment</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                disabled={isProcessing}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Payment Status */}
            {paymentStatus === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Payment Successful!</h4>
                <p className="text-sm text-white/60">
                  Your payment of {formatAmount(amount)} has been processed successfully.
                </p>
              </motion.div>
            )}

            {paymentStatus === 'failure' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30">
                  <AlertCircle className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Payment Failed</h4>
                <p className="text-sm text-white/60 mb-4">
                  Your payment could not be processed. Please try again.
                </p>
                <button
                  onClick={() => setPaymentStatus('idle')}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {(paymentStatus === 'idle' || paymentStatus === 'checkout') && (
              <>
                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white/60">Amount</span>
                    <span className="text-2xl font-bold text-amber-400">
                      {formatAmount(amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Description</span>
                    <span className="text-sm text-white/80">{description}</span>
                  </div>
                </div>

                {paymentStatus === 'checkout' && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4 text-xs text-amber-100 space-y-2">
                    <p>
                      Razorpay window open hai. UPI se pay karo. Agar paisa kat gaya lekin window
                      band nahi hui — neeche <strong>I have paid</strong> dabao.
                    </p>
                    <button
                      type="button"
                      onClick={() => void confirmPaidManually()}
                      disabled={checkingPaid || !activeOrderId}
                      className="w-full py-3 bg-green-500/20 border border-green-400/40 text-green-200 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {checkingPaid ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      I have paid — continue
                    </button>
                  </div>
                )}

                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-green-300">
                      Secure checkout via Razorpay. Keep this tab open until success.
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing || amount < 1}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Opening Razorpay…</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>
                        {paymentStatus === 'checkout'
                          ? `Pay again ${formatAmount(amount)}`
                          : `Pay ${formatAmount(amount)}`}
                      </span>
                    </>
                  )}
                </motion.button>

                {allowDemoPay && (
                  <button
                    type="button"
                    onClick={handleDemoPay}
                    disabled={isProcessing}
                    className="w-full mt-3 py-3 text-sm text-amber-300/80 hover:text-amber-200 border border-amber-500/20 rounded-xl"
                  >
                    Simulate payment (demo)
                  </button>
                )}

                <p className="text-xs text-white/40 text-center mt-4">
                  By proceeding, you agree to our Terms & Conditions
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
