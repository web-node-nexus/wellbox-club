import { motion } from 'framer-motion';
import { Copy, CheckCircle, Share2, Users, DollarSign, TrendingUp, Gift, Link2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Referral() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  if (!user) return null;

  const referralLink = `${window.location.origin}/register/${user.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('success', 'Referral link copied!', 'Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    showToast('success', 'Referral code copied!', 'Copied');
  };

  const shareWhatsApp = () => {
    const text = `Join Jewellbox Club and start earning with gold! Use my referral link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    showToast('success', 'Opening WhatsApp...', 'Share');
  };

  const shareEmail = () => {
    const subject = 'Join Jewellbox Club - Digital Gold Investment Platform';
    const body = `Hi,\n\nI want to invite you to join Jewellbox Club - India's #1 Digital Gold Platform!\n\nUse my referral link to sign up: ${referralLink}\n\nOr use my referral code: ${user.referralCode}\n\nStart earning commissions and buy gold at wholesale prices!\n\nBest regards,\n${user.name}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    showToast('success', 'Opening email client...', 'Share');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
    showToast('success', 'Opening Facebook...', 'Share');
  };

  const shareTwitter = () => {
    const text = `Join Jewellbox Club and start earning with gold! 🪙💰 Use my referral link: ${referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    showToast('success', 'Opening Twitter...', 'Share');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Referral Link</h1>
        <p className="text-white/50 mt-1">Share and earn commissions from your referrals</p>
      </div>

      {/* Referral Code Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl p-8 text-purple-900 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Link2 className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Your Referral Code</h2>
        </div>
        <p className="text-5xl font-bold font-mono mb-6">{user.referralCode}</p>
        <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-4">
          <p className="text-xs font-medium mb-1">Referral Link</p>
          <p className="text-sm font-mono break-all">{referralLink}</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyCode}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur"
          >
            <Copy className="w-5 h-5" />
            Copy Code
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyLink}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur"
          >
            {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </motion.button>
        </div>
      </motion.div>

      {/* Share Options */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Share Via</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareWhatsApp}
            className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-colors"
          >
            <Share2 className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-green-700">WhatsApp</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareEmail}
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
          >
            <Share2 className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Email</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareFacebook}
            className="flex flex-col items-center gap-2 p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
          >
            <Share2 className="w-8 h-8 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Facebook</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareTwitter}
            className="flex flex-col items-center gap-2 p-4 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors"
          >
            <Share2 className="w-8 h-8 text-sky-600" />
            <span className="text-sm font-medium text-sky-700">Twitter</span>
          </motion.button>
        </div>
      </div>

      {/* Commission Structure */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Commission Structure</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200"
          >
            <DollarSign className="w-8 h-8 text-green-600 mb-3" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">Level 1: 10%</h4>
            <p className="text-sm text-gray-600">Earn 10% commission on every direct referral's monthly contribution</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200"
          >
            <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">Level 2: 5%</h4>
            <p className="text-sm text-gray-600">Earn 5% commission on contributions from your referrals' referrals</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200"
          >
            <Gift className="w-8 h-8 text-purple-600 mb-3" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">Gold Bonus: 3%</h4>
            <p className="text-sm text-gray-600">Earn 3% commission when your referrals purchase gold from showroom</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200"
          >
            <Users className="w-8 h-8 text-amber-600 mb-3" />
            <h4 className="text-lg font-bold text-gray-900 mb-2">Leader Bonus: 5%</h4>
            <p className="text-sm text-gray-600">After 100 team members, earn 5% monthly on team's total income</p>
          </motion.div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Tips to Grow Your Team</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Share your referral link on WhatsApp groups and social media</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Tell friends and family about the benefits of digital gold investment</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Highlight the 30% cheaper gold prices from our showroom</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Explain the multi-level commission structure clearly</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Help your referrals build their own teams for exponential growth</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
