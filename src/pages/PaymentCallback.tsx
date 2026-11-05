import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addInvestment } from '../services/investmentService';
import { verifyRazorpayPayment, fetchRazorpayOrderStatus } from '../services/razorpayService';
import {
  clearPendingPayment,
  loadPendingPayment,
} from '../services/paymentPending';

/**
 * Razorpay redirect lands here after successful pay — completes join/invest automatically.
 */
export default function PaymentCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [status, setStatus] = useState<'working' | 'ok' | 'error'>('working');
  const [message, setMessage] = useState('Confirming your payment…');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const paymentId = params.get('razorpay_payment_id') || '';
        const orderId =
          params.get('razorpay_order_id') ||
          sessionStorage.getItem('jb_rzp_order_id') ||
          '';
        const signature = params.get('razorpay_signature') || '';

        if (!paymentId && !orderId) {
          throw new Error('Payment details missing. Please try again from Join.');
        }

        // Prefer signature verify; else confirm order is paid on Razorpay
        if (paymentId && orderId && signature) {
          await verifyRazorpayPayment({
            razorpay_payment_id: paymentId,
            razorpay_order_id: orderId,
            razorpay_signature: signature,
          });
        } else if (orderId) {
          const st = await fetchRazorpayOrderStatus(orderId);
          if (!st.paid) {
            throw new Error('Payment not completed yet. If money was deducted, contact support.');
          }
        }

        const pending = loadPendingPayment();
        if (!pending) {
          // Payment ok but no pending action — send to dashboard/login
          if (!cancelled) {
            setStatus('ok');
            setMessage('Payment successful!');
            setTimeout(() => navigate('/login'), 1200);
          }
          return;
        }

        const payRef = paymentId || orderId;

        if (pending.kind === 'join' || pending.kind === 'register') {
          const role = pending.kind === 'join' ? pending.role : 'member';
          const result = await register({
            name: pending.name,
            mobile: pending.mobile,
            referralCode: pending.referralCode,
            city: pending.kind === 'join' ? pending.city : undefined,
            role,
          });
          if (!result.success || !result.user) {
            throw new Error(result.message || 'Registration failed after payment');
          }
          if (role === 'member' && pending.amount > 0) {
            await addInvestment(
              result.user.id,
              pending.amount,
              payRef,
              pending.mobile
            );
          }
          await login(pending.mobile);
          clearPendingPayment();
          sessionStorage.removeItem('jb_rzp_order_id');
          if (!cancelled) {
            setStatus('ok');
            setMessage('Payment successful! Opening your dashboard…');
            setTimeout(() => {
              navigate(role === 'individual' ? '/individual-dashboard' : '/dashboard');
            }, 1000);
          }
          return;
        }

        if (pending.kind === 'invest') {
          await addInvestment(
            pending.userId,
            pending.amount,
            payRef,
            pending.mobile
          );
          clearPendingPayment();
          sessionStorage.removeItem('jb_rzp_order_id');
          if (!cancelled) {
            setStatus('ok');
            setMessage('Investment added successfully!');
            setTimeout(() => navigate(pending.returnTo || '/contributions'), 1000);
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          setStatus('error');
          setMessage(e?.message || 'Could not complete after payment');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
        {status === 'working' && (
          <>
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900">Processing payment</h1>
            <p className="text-gray-500 mt-2 text-sm">{message}</p>
          </>
        )}
        {status === 'ok' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900">Success</h1>
            <p className="text-gray-500 mt-2 text-sm">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900">Something went wrong</h1>
            <p className="text-gray-600 mt-2 text-sm">{message}</p>
            <p className="text-xs text-gray-400 mt-3">
              If money was deducted, it will reflect / refund per Razorpay. You can login or contact support.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold text-sm"
              >
                Go to Login
              </Link>
              <Link
                to="/"
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium"
              >
                Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
