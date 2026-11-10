import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Crown, User, Phone, MapPin, Tag, CheckCircle, Loader2, Sparkles, ShoppingBag,
  ArrowRight, ArrowLeft, CreditCard, IndianRupee,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMembershipByMobileAsync } from '../services/userStore';
import { sendOTP, verifyOTP, generateDemoOTP, storeDemoOTP, verifyDemoOTP, clearDemoOTP, isAdminMobile } from '../services/otpService';
import { addInvestment } from '../services/investmentService';
import { BUSINESS_RULES } from '../data/businessRules';
import { clearPendingPayment, savePendingPayment } from '../services/paymentPending';
import {
  otpInputProps,
  readOtpFromClipboard,
  useSmsOtpAutofill,
} from '../hooks/useSmsOtpAutofill';
import PaymentModal from './PaymentModal';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'member' | 'leader' | 'individual';
}

export default function JoinModal({ isOpen, onClose, initialTab = 'member' }: JoinModalProps) {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'member' | 'leader' | 'individual'>(initialTab);
  const [step, setStep] = useState<'form' | 'otp' | 'payment' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    referralCode: '',
    city: '',
    investmentAmount: String(BUSINESS_RULES.defaultJoinInvestment),
  });
  const [otp, setOtp] = useState('');
  const [otpFieldKey, setOtpFieldKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPayment, setShowPayment] = useState(false);

  useSmsOtpAutofill(isOpen && step === 'otp' && !loading, code => setOtp(code));

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = 'Enter valid 10-digit mobile';
    if ((activeTab === 'leader' || activeTab === 'individual') && !formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    // Member + Leader path: same investment amount rules
    if (activeTab === 'member' || activeTab === 'leader') {
      const amt = Number(formData.investmentAmount);
      if (!amt || amt < BUSINESS_RULES.minJoinInvestment) {
        newErrors.investmentAmount = `Minimum first investment is ₹${BUSINESS_RULES.minJoinInvestment}`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSendingOTP(true);
    setErrors({});

    try {
      if (isAdminMobile(formData.mobile)) {
        setErrors({ mobile: 'This is the admin number — use Login with OTP.' });
        setSendingOTP(false);
        return;
      }

      // Same number cannot join again — check Supabase
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
        setErrors({
          mobile: `This number is already registered as ${label}. Please use Login with OTP.`,
        });
        setSendingOTP(false);
        return;
      }

      try {
        await sendOTP(formData.mobile);
      } catch {
        const demoOTP = generateDemoOTP();
        storeDemoOTP(formData.mobile, demoOTP);
        console.info('2Factor unavailable — demo OTP:', demoOTP);
      }
      setOtp('');
      setOtpFieldKey(k => k + 1);
      setStep('otp');
    } catch {
      setErrors({ mobile: 'Failed to send OTP. Please try again.' });
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrors({ otp: 'Enter the 6-digit OTP' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let verified = false;
      try {
        await verifyOTP(formData.mobile, otp);
        verified = true;
      } catch {
        verified = verifyDemoOTP(formData.mobile, otp);
      }

      if (!verified) {
        setErrors({ otp: 'Invalid OTP. Please try again.' });
        setLoading(false);
        return;
      }

      clearDemoOTP(formData.mobile);

      // Member + Leader must pay before account is created
      if (activeTab === 'member' || activeTab === 'leader') {
        setStep('payment');
        setLoading(false);
        return;
      }

      // Buyer only: register after OTP (no investment)
      finishRegistration();
    } catch {
      setErrors({ otp: 'Verification failed. Please try again.' });
      setLoading(false);
    }
  };

  /** Leader only if they joined via Leader form; Member form stays member forever */
  const registerRole: 'member' | 'leader' | 'individual' =
    activeTab === 'individual' ? 'individual' : activeTab === 'leader' ? 'leader' : 'member';

  const goDashboard = (role: 'member' | 'leader' | 'individual') => {
    const path = role === 'individual' ? '/individual-dashboard' : '/dashboard';
    handleClose();
    // Hard navigate so dashboard always opens after pay (SPA navigate can miss)
    window.location.assign(path);
  };

  const finishRegistration = async (paymentId?: string) => {
    setLoading(true);
    try {
      const result = await register({
        name: formData.name,
        mobile: formData.mobile,
        referralCode: formData.referralCode,
        city: formData.city,
        role: registerRole,
      });

      // Already registered (retry after paid) → just login + dashboard
      if (!result.success || !result.user) {
        const already = /already registered/i.test(result.message || '');
        if (already) {
          const logged = await login(formData.mobile);
          if (logged.success) {
            setStep('success');
            goDashboard(registerRole);
            return;
          }
        }
        setErrors({ otp: result.message });
        setLoading(false);
        return;
      }

      if (registerRole === 'member') {
        await addInvestment(
          result.user.id,
          Number(formData.investmentAmount),
          paymentId,
          formData.mobile
        );
      }

      await login(formData.mobile);
      setStep('success');
      setLoading(false);
      goDashboard(registerRole);
    } catch (e: any) {
      setErrors({ otp: e?.message || 'Registration failed' });
      setLoading(false);
    }
  };

  const openRazorpayCheckout = () => {
    savePendingPayment({
      kind: 'join',
      name: formData.name,
      mobile: formData.mobile,
      referralCode: formData.referralCode,
      city: formData.city,
      role: registerRole === 'individual' ? 'member' : registerRole,
      amount: Number(formData.investmentAmount) || 0,
    });
    setShowPayment(true);
  };

  const handlePaymentSuccess = (response: any) => {
    clearPendingPayment();
    setShowPayment(false);
    void finishRegistration(response?.razorpay_payment_id);
  };

  const handleResendOTP = async () => {
    setOtp('');
    setOtpFieldKey(k => k + 1);
    setErrors({});
    try {
      await sendOTP(formData.mobile);
    } catch {
      const demoOTP = generateDemoOTP();
      storeDemoOTP(formData.mobile, demoOTP);
      console.info('Demo OTP:', demoOTP);
    }
  };

  const handleClose = () => {
    setStep('form');
    setFormData({
      name: '',
      mobile: '',
      referralCode: '',
      city: '',
      investmentAmount: String(BUSINESS_RULES.defaultJoinInvestment),
    });
    setOtp('');
    setErrors({});
    setShowPayment(false);
    onClose();
  };

  const resetTab = (tab: 'member' | 'leader' | 'individual') => {
    setActiveTab(tab);
    setStep('form');
    setOtp('');
    setErrors({});
    setShowPayment(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-md bg-gradient-to-b from-purple-950 to-[#0f0520] rounded-3xl border border-amber-500/20 shadow-2xl shadow-amber-500/10 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 p-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-purple-900" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-[var(--font-heading)] text-white">Join Jewellbox Club</h2>
                  <p className="text-xs text-amber-300/70">OTP signup — no password needed</p>
                </div>
              </div>
              <div className="flex gap-2 bg-black/30 rounded-xl p-1">
                <button type="button" onClick={() => resetTab('member')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'member' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 shadow-lg' : 'text-white/60 hover:text-white'}`}>
                  <User className="w-4 h-4 inline mr-1" /> Member
                </button>
                <button type="button" onClick={() => resetTab('leader')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'leader' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}>
                  <Crown className="w-4 h-4 inline mr-1" /> Leader
                </button>
                <button type="button" onClick={() => resetTab('individual')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'individual' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}>
                  <ShoppingBag className="w-4 h-4 inline mr-1" /> Buyer
                </button>
              </div>
            </div>

            <div className="p-6">
              {step === 'form' && (
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Enter your full name" className={`w-full pl-10 pr-4 py-3.5 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 text-base`} />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-white/40">+91</span>
                      <input type="tel" value={formData.mobile} onChange={e => setFormData(p => ({ ...p, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))} placeholder="9876543210" className={`w-full pl-20 pr-4 py-3.5 bg-white/5 border ${errors.mobile ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 text-base`} />
                    </div>
                    {errors.mobile && <p className="text-xs text-red-400 mt-1">{errors.mobile}</p>}
                  </div>

                  {(activeTab === 'member' || activeTab === 'leader') && (
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">First Investment (₹) *</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="number"
                          min={BUSINESS_RULES.minJoinInvestment}
                          value={formData.investmentAmount}
                          onChange={e => setFormData(p => ({ ...p, investmentAmount: e.target.value }))}
                          placeholder={`Minimum ₹${BUSINESS_RULES.minJoinInvestment}`}
                          className={`w-full pl-10 pr-4 py-3.5 bg-white/5 border ${errors.investmentAmount ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 text-base`}
                        />
                      </div>
                      {errors.investmentAmount && <p className="text-xs text-red-400 mt-1">{errors.investmentAmount}</p>}
                      <p className="text-[11px] text-amber-300/70 mt-1.5">
                        {activeTab === 'leader'
                          ? `You join as a Leader (L1/L2 same as members). Leader ${BUSINESS_RULES.leaderPercent}% team income unlocks at ${BUSINESS_RULES.leaderTeamRequirement} team members. `
                          : 'You join as a Member — Leader status is only for those who register via the Leader form. '}
                        Min ₹{BUSINESS_RULES.minJoinInvestment}, no maximum. Locks 12 months — then redeem as gold. Withdraw only level income.
                      </p>
                    </div>
                  )}

                  {(activeTab === 'leader' || activeTab === 'individual') && (
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">City *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input type="text" value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} placeholder="Your city" className={`w-full pl-10 pr-4 py-3.5 bg-white/5 border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 text-base`} />
                      </div>
                      {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
                    </div>
                  )}

                  {(activeTab === 'member' || activeTab === 'leader') && (
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Referral Code (Optional)</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input type="text" value={formData.referralCode} onChange={e => setFormData(p => ({ ...p, referralCode: e.target.value.toUpperCase() }))} placeholder="Enter referral code" className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 text-base uppercase" />
                      </div>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={sendingOTP}
                    className={`w-full py-4 rounded-xl font-semibold text-base shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
                      activeTab === 'member' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 shadow-amber-500/30' :
                      activeTab === 'leader' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/30' :
                      'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/30'
                    }`}
                  >
                    {sendingOTP ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Send OTP
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                  <p className="text-center text-xs text-white/40">By joining, you agree to our Terms & Privacy Policy</p>
                </motion.form>
              )}

              {step === 'otp' && (
                <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleVerifyOTP} className="space-y-4" autoComplete="one-time-code">
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <p className="text-sm text-green-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      OTP sent to +91 {formData.mobile}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Enter OTP</label>
                    <input
                      key={otpFieldKey}
                      {...otpInputProps}
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit OTP"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl font-mono tracking-widest focus:border-amber-500/50"
                      autoFocus
                      disabled={loading}
                    />
                    {errors.otp && <p className="text-xs text-red-400 mt-1">{errors.otp}</p>}
                    <p className="text-[11px] text-white/40 mt-2">
                      Copy the OTP from SMS, then tap Paste OTP (browsers cannot read SMS automatically).
                    </p>
                    <button
                      type="button"
                      onClick={async () => {
                        const code = await readOtpFromClipboard();
                        if (code) setOtp(code);
                        else setErrors({ otp: 'Copy the OTP from SMS first, then tap Paste OTP' });
                      }}
                      className="mt-2 w-full py-2.5 rounded-xl border border-amber-500/30 text-amber-300 text-sm font-semibold"
                    >
                      Paste OTP from SMS
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {activeTab === 'member' || activeTab === 'leader'
                          ? 'Verify & Continue to Pay'
                          : 'Verify & Join'}
                      </>
                    )}
                  </motion.button>

                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => { setStep('form'); setOtp(''); setErrors({}); }} className="text-sm text-white/50 hover:text-white flex items-center gap-1">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="button" onClick={handleResendOTP} className="text-sm text-amber-400 hover:text-amber-300 font-medium">
                      Resend OTP
                    </button>
                  </div>
                </motion.form>
              )}

              {step === 'payment' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <p className="text-sm text-amber-200 font-semibold mb-1">
                      {activeTab === 'leader'
                        ? 'Payment required to join as a Leader'
                        : 'Payment required to become a member'}
                    </p>
                    <p className="text-xs text-amber-200/70">
                      Without this payment you will not be registered. Amount is held 12 months for gold redemption.
                      {activeTab === 'leader'
                        ? ` L1 (${BUSINESS_RULES.level1Percent}%) & L2 (${BUSINESS_RULES.level2Percent}%) work the same as for members. Leader ${BUSINESS_RULES.leaderPercent}% after ${BUSINESS_RULES.leaderTeamRequirement} team.`
                        : ''}
                    </p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl space-y-2 text-sm">
                    <div className="flex justify-between text-white/70">
                      <span>Name</span>
                      <span className="text-white font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Mobile</span>
                      <span className="text-white font-medium">+91 {formData.mobile}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Investment</span>
                      <span className="text-amber-400 font-bold">₹{Number(formData.investmentAmount).toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Adjust amount (min ₹{BUSINESS_RULES.minJoinInvestment})
                    </label>
                    <input
                      type="number"
                      min={BUSINESS_RULES.minJoinInvestment}
                      value={formData.investmentAmount}
                      onChange={e => setFormData(p => ({ ...p, investmentAmount: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-amber-500/50"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={Number(formData.investmentAmount) < BUSINESS_RULES.minJoinInvestment}
                    onClick={openRazorpayCheckout}
                    className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Pay ₹{Number(formData.investmentAmount || 0).toLocaleString()} & Join
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep('otp'); setErrors({}); }}
                    className="w-full text-sm text-white/50 hover:text-white flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <p className="text-center text-[11px] text-red-300/80">
                    Closing without payment = you will NOT be registered.
                  </p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Welcome to Jewellbox Club!</h3>
                  <p className="text-sm text-white/60 mb-2">
                    {activeTab === 'leader'
                      ? `₹${Number(formData.investmentAmount).toLocaleString()} invested as Leader — opening your dashboard…`
                      : activeTab === 'member'
                        ? `₹${Number(formData.investmentAmount).toLocaleString()} invested as member — opening your dashboard…`
                        : 'Redirecting…'}
                  </p>
                  {activeTab === 'leader' && (
                    <p className="text-xs text-amber-300/80">
                      Grow your team to {BUSINESS_RULES.leaderTeamRequirement} to unlock Leader {BUSINESS_RULES.leaderPercent}% income.
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>

          <PaymentModal
            isOpen={showPayment}
            onClose={() => setShowPayment(false)}
            amount={Number(formData.investmentAmount) || 0}
            description="First investment — Jewellbox Club membership"
            guest={{ name: formData.name, mobile: formData.mobile }}
            onSuccess={handlePaymentSuccess}
            onFailure={() => setErrors({ otp: 'Payment failed. Member not created.' })}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
