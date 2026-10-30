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
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  description,
  onSuccess,
  onFailure,
}: PaymentModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failure'>('idle');

  const handlePayment = async () => {
    if (!user) {
      showToast('error', 'Please login to make payment', 'Error');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('idle');

    try {
      await initiatePayment({
        amount: amount,
        description: description,
        prefill: {
          name: user.name,
          contact: user.mobile,
        },
        onSuccess: (response) => {
          console.log('Payment successful:', response);
          setPaymentStatus('success');
          setIsProcessing(false);
          showToast('success', `Payment of ${formatAmount(amount)} successful!`, 'Success');
          
          // Call the onSuccess callback if provided
          if (onSuccess) {
            onSuccess(response);
          }

          // Close modal after 2 seconds
          setTimeout(() => {
            onClose();
            setPaymentStatus('idle');
          }, 2000);
        },
        onFailure: (error) => {
          console.error('Payment failed:', error);
          setPaymentStatus('failure');
          setIsProcessing(false);
          showToast('error', 'Payment failed. Please try again.', 'Error');
          
          // Call the onFailure callback if provided
          if (onFailure) {
            onFailure(error);
          }
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failure');
      setIsProcessing(false);
      showToast('error', 'Failed to initiate payment. Please try again.', 'Error');
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

            {paymentStatus === 'idle' && (
              <>
                {/* Payment Details */}
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

                {/* Payment Methods */}
                <div className="mb-6">
                  <p className="text-sm text-white/60 mb-3">Payment Methods</p>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white/5 rounded-lg p-2 flex items-center justify-center border border-white/10">
                      <span className="text-xs text-white/80">UPI</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 flex items-center justify-center border border-white/10">
                      <span className="text-xs text-white/80">Cards</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 flex items-center justify-center border border-white/10">
                      <span className="text-xs text-white/80">Net Banking</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 flex items-center justify-center border border-white/10">
                      <span className="text-xs text-white/80">Wallets</span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-green-300">
                      Your payment is secure and encrypted. Powered by Razorpay.
                    </p>
                  </div>
                </div>

                {/* Pay Button */}
                <motion.button
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay {formatAmount(amount)}</span>
                    </>
                  )}
                </motion.button>

                {/* Footer */}
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
