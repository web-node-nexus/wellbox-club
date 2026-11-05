import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { initiatePayment, formatAmount } from '../services/razorpayService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  guest?: { name: string; mobile: string };
  allowDemoPay?: boolean;
  /** Called only for demo pay or rare non-redirect handler */
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
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failure'>('idle');

  const payer = user ? { name: user.name, mobile: user.mobile } : guest;

  const completeSuccess = (response: any) => {
    setPaymentStatus('success');
    setIsProcessing(false);
    showToast('success', `Payment of ${formatAmount(amount)} successful!`, 'Success');
    onSuccess?.(response);
    setTimeout(() => {
      onClose();
      setPaymentStatus('idle');
    }, 1000);
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
    }, 600);
  };

  const handlePayment = async () => {
    if (!payer) {
      showToast('error', 'Please login or complete signup details first', 'Error');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('idle');

    try {
      await initiatePayment({
        amount,
        description,
        prefill: {
          name: payer.name,
          contact: payer.mobile,
        },
        onSuccess: response => {
          // Rare: handler without redirect
          completeSuccess(response);
        },
        onFailure: (error: any) => {
          setIsProcessing(false);
          if (error?.code === 'dismissed') {
            showToast('info', 'Payment cancelled', 'Cancelled');
            return;
          }
          setPaymentStatus('failure');
          showToast(
            'error',
            error?.message || error?.description || 'Payment failed',
            'Error'
          );
          onFailure?.(error);
        },
      });
      // Redirect mode: browser will leave this page on success
      setIsProcessing(false);
    } catch (error: any) {
      setPaymentStatus('failure');
      setIsProcessing(false);
      showToast(
        'error',
        error?.message || 'Failed to start payment. Check Razorpay keys on Vercel.',
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
            onClick={e => e.stopPropagation()}
          >
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

            {paymentStatus === 'success' && (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-white">Payment Successful!</h4>
              </div>
            )}

            {paymentStatus === 'failure' && (
              <div className="text-center py-6">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-3" />
                <h4 className="text-xl font-bold text-white mb-2">Payment Failed</h4>
                <button
                  onClick={() => setPaymentStatus('idle')}
                  className="px-6 py-2 bg-white/10 rounded-xl text-white text-sm"
                >
                  Try Again
                </button>
              </div>
            )}

            {paymentStatus === 'idle' && (
              <>
                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-white/60">Amount</span>
                    <span className="text-2xl font-bold text-amber-400">
                      {formatAmount(amount)}
                    </span>
                  </div>
                  <p className="text-xs text-white/50">{description}</p>
                </div>

                <p className="text-xs text-white/50 mb-4 text-center">
                  Pay on Razorpay / UPI. Window closes automatically when payment is confirmed — no extra button.
                </p>

                <button
                  type="button"
                  onClick={() => void handlePayment()}
                  disabled={isProcessing || amount < 1}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Opening Razorpay…
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay {formatAmount(amount)}
                    </>
                  )}
                </button>

                {allowDemoPay && (
                  <button
                    type="button"
                    onClick={handleDemoPay}
                    disabled={isProcessing}
                    className="w-full mt-3 py-3 text-sm text-amber-300/80 border border-amber-500/20 rounded-xl"
                  >
                    Simulate payment (demo)
                  </button>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
