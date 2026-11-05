import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, User, Phone, Tag, AlertCircle, CheckCircle, Loader2, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import { sendOTP, verifyOTP, generateDemoOTP, storeDemoOTP, verifyDemoOTP, clearDemoOTP, isAdminMobile } from '../services/otpService';
import { addInvestment } from '../services/investmentService';
import { getMembershipByMobileAsync } from '../services/userStore';
import { BUSINESS_RULES } from '../data/businessRules';
import { clearPendingPayment, savePendingPayment } from '../services/paymentPending';
import PaymentModal from '../components/PaymentModal';

export default function Register() {
  const { referralCode } = useParams();
  const [step, setStep] = useState<'details' | 'otp' | 'payment' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    referralCode: referralCode || '',
    investmentAmount: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { register, login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (isAdminMobile(formData.mobile)) {
      setError('This is the admin number — use Login with OTP.');
      return;
    }
    if (
      !formData.investmentAmount ||
      Number(formData.investmentAmount) < BUSINESS_RULES.minJoinInvestment
    ) {
      setError(`First installment must be at least ₹${BUSINESS_RULES.minJoinInvestment}`);
      return;
    }

    setSendingOTP(true);

    try {
      const existing = await getMembershipByMobileAsync(formData.mobile);
      if (existing) {
        const label =
          existing.role === 'leader' || existing.isLeader
            ? 'Leader'
            : existing.role === 'admin'
              ? 'Admin'
              : existing.role === 'individual'
                ? 'Buyer'
                : 'Member';
        setError(`This number is already registered as ${label}. Please use Login with OTP.`);
        setSendingOTP(false);
        return;
      }

      try {
        await sendOTP(formData.mobile);
        showToast('success', `OTP sent to +91 ${formData.mobile}`, 'OTP Sent');
      } catch {
        const demoOTP = generateDemoOTP();
        storeDemoOTP(formData.mobile, demoOTP);
        showToast('info', `Demo OTP: ${demoOTP}`, 'Demo Mode');
      }
      setStep('otp');
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let verified = false;
      try {
        await verifyOTP(formData.mobile, otp);
        verified = true;
      } catch {
        verified = verifyDemoOTP(formData.mobile, otp);
      }

      if (!verified) {
        setError('Invalid OTP. Please try again.');
        setLoading(false);
        return;
      }

      clearDemoOTP(formData.mobile);
      showToast('success', 'OTP verified successfully!', 'Verified');
      setStep('payment');
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response?: any) => {
    // Payment required — without pay, user is NOT a member
    clearPendingPayment();
    setLoading(true);
    setError('');
    try {
      const result = await register({
        name: formData.name,
        mobile: formData.mobile,
        referralCode: formData.referralCode,
        role: 'member',
      });

      if (result.success && result.user) {
        await addInvestment(
          result.user.id,
          Number(formData.investmentAmount),
          response?.razorpay_payment_id,
          formData.mobile
        );
        await login(formData.mobile);
        setStep('success');
        window.location.assign('/dashboard');
        return;
      }

      // Paid but number already exists → login and open dashboard
      if (/already registered/i.test(result.message || '')) {
        const logged = await login(formData.mobile);
        if (logged.success) {
          window.location.assign('/dashboard');
          return;
        }
      }
      setError(result.message || 'Registration failed');
    } catch (e: any) {
      setError(e?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    setError('');
    try {
      await sendOTP(formData.mobile);
      showToast('success', 'OTP resent successfully', 'OTP Resent');
    } catch {
      const demoOTP = generateDemoOTP();
      storeDemoOTP(formData.mobile, demoOTP);
      showToast('info', `New Demo OTP: ${demoOTP}`, 'Demo Mode');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-4 pt-28 sm:pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-6 relative z-0">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <Crown className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Join Jewellbox Club</h1>
          <p className="text-gray-500 mt-1">Register with OTP — no password needed</p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 'details' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
            }`}>
              {step === 'details' ? '1' : <CheckCircle className="w-5 h-5" />}
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded">
              <div className={`h-full rounded transition-all ${
                step === 'otp' || step === 'payment' || step === 'success' ? 'bg-green-500 w-full' : 'w-0'
              }`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 'otp' ? 'bg-amber-500 text-white' : step === 'payment' || step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step === 'otp' ? '2' : step === 'payment' || step === 'success' ? <CheckCircle className="w-5 h-5" /> : '2'}
            </div>
            <div className="w-8 h-1 bg-gray-200 rounded">
              <div className={`h-full rounded transition-all ${
                step === 'payment' || step === 'success' ? 'bg-green-500 w-full' : 'w-0'
              }`} />
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              step === 'payment' ? 'bg-amber-500 text-white' : step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step === 'payment' ? '3' : step === 'success' ? <CheckCircle className="w-5 h-5" /> : '3'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.form
                key="details"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOTP}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-500">+91</span>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="9876543210"
                      className="w-full pl-20 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Referral Code (Optional)</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.referralCode}
                      onChange={e => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
                      placeholder="Enter referral code"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Investment Amount (₹) *</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.investmentAmount}
                      onChange={e => setFormData({ ...formData, investmentAmount: e.target.value })}
                      placeholder={`Minimum ₹${BUSINESS_RULES.minJoinInvestment}`}
                      min={BUSINESS_RULES.minJoinInvestment}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum ₹{BUSINESS_RULES.minJoinInvestment} required. Locked for 12 months for gold purchase.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={sendingOTP}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sendingOTP ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {step === 'otp' && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyOTP}
                className="space-y-4"
              >
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    OTP sent to +91 {formData.mobile}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-center text-2xl font-mono tracking-widest"
                    required
                    maxLength={6}
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-2">OTP expires in 5 minutes</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('details');
                      setOtp('');
                      setError('');
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Resend OTP
                  </button>
                </div>
              </motion.form>
            )}

            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-800 font-semibold mb-2">Complete Your Registration</p>
                  <p className="text-xs text-amber-700">
                    Pay your first investment of <strong>₹{Number(formData.investmentAmount).toLocaleString()}</strong> to complete registration.
                    This amount will be locked for 12 months and can be used to purchase gold.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Mobile:</span>
                    <span className="font-medium">+91 {formData.mobile}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Investment Amount:</span>
                    <span className="font-bold text-amber-600">₹{Number(formData.investmentAmount).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    savePendingPayment({
                      kind: 'register',
                      name: formData.name,
                      mobile: formData.mobile,
                      referralCode: formData.referralCode,
                      amount: Number(formData.investmentAmount) || 0,
                    });
                    setShowPayment(true);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay ₹{Number(formData.investmentAmount).toLocaleString()}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('otp');
                    setError('');
                  }}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Successful! 🎉</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Welcome to Jewellbox Club! Your investment is locked for 12 months.
                </p>
                <p className="text-xs text-gray-500">
                  Opening your dashboard...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already a member?{' '}
              <Link to="/login" className="text-amber-600 font-medium hover:text-amber-700">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={Number(formData.investmentAmount)}
        description="First Investment - Jewellbox Club Membership"
        guest={{ name: formData.name, mobile: formData.mobile }}
        onSuccess={(response) => {
          setShowPayment(false);
          handlePaymentSuccess(response);
        }}
        onFailure={() => {
          setError('Payment failed. You are not a member until payment succeeds.');
        }}
      />
    </div>
  );
}
