import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { Crown, Phone, Lock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { sendOTP, verifyOTP, generateDemoOTP, storeDemoOTP, verifyDemoOTP } from '../services/otpService';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const { login } = useAuth();
  const { translate } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setSendingOTP(true);
    
    try {
      // Generate demo OTP for testing
      const demoOTP = generateDemoOTP();
      storeDemoOTP(mobile, demoOTP);
      
      // Try to send real OTP via 2Factor API
      try {
        await sendOTP(mobile);
        showToast('success', `OTP sent to +91 ${mobile}`, 'OTP Sent');
        console.log('Demo OTP for testing:', demoOTP);
      } catch (apiError) {
        // If API fails, use demo OTP
        console.log('Using demo OTP:', demoOTP);
        showToast('info', `Demo OTP: ${demoOTP} (API unavailable)`, 'Demo Mode');
      }
      
      setOtpSent(true);
    } catch (err) {
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
      // Verify OTP (demo or real)
      const isValid = verifyDemoOTP(mobile, otp);
      
      if (!isValid) {
        try {
          await verifyOTP(mobile, otp);
        } catch (err) {
          setError('Invalid OTP. Please try again.');
          setLoading(false);
          return;
        }
      }
      
      // OTP verified, now login user
      const result = login(mobile, otp);
      if (result.success) {
        showToast('success', 'Login successful!', 'Welcome');
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    setError('');
    const demoOTP = generateDemoOTP();
    storeDemoOTP(mobile, demoOTP);
    
    try {
      await sendOTP(mobile);
      showToast('success', 'OTP resent successfully', 'OTP Resent');
      console.log('New Demo OTP:', demoOTP);
    } catch (err) {
      showToast('info', `New Demo OTP: ${demoOTP}`, 'Demo Mode');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{translate('login.welcomeBack')}</h1>
          <p className="text-gray-500 mt-1">{translate('login.signInAccount')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          {!otpSent ? (
            // Step 1: Enter Mobile Number
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{translate('login.mobileNumber')}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-gray-500">+91</span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder={translate('login.enterMobile')}
                    className="w-full pl-20 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    required
                    disabled={sendingOTP}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sendingOTP || mobile.length !== 10}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sendingOTP ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Send OTP
                  </>
                )}
              </button>
            </form>
          ) : (
            // Step 2: Enter OTP
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  OTP sent to +91 {mobile}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-center text-2xl font-mono tracking-widest"
                    required
                    maxLength={6}
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  OTP expires in 5 minutes
                </p>
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
                    <CheckCircle className="w-5 h-5" />
                    Verify & Login
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Didn't receive OTP? Resend
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setError('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Change mobile number
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {translate('login.dontHaveAccount')}{' '}
              <Link to="/register" className="text-amber-600 font-medium hover:text-amber-700">{translate('common.joinNow')}</Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs font-medium text-amber-700 mb-2">Demo Accounts (Use OTP: 123456)</p>
            <div className="space-y-1 text-xs text-amber-600">
              <p>• Mobile: 9876543210 ({translate('admin.adminPanel')})</p>
              <p>• Mobile: 9876543211 ({translate('navbar.leaders')})</p>
              <p>• Mobile: 9876543212 ({translate('navbar.becomeMember')})</p>
              <p>• Mobile: 9876543213 ({translate('joinModal.registerAsBuyer')})</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
