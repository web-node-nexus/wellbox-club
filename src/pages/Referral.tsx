import { motion } from 'framer-motion';
import { Copy, CheckCircle, Share2, Users, DollarSign } from 'lucide-react';
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

  const shareWhatsApp = () => {
    const text = `Join Jewellbox Club and start earning with gold! Use my referral link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Referral Link</h1>
        <p className="text-white/50 mt-1">Share and earn commissions</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl p-8 text-purple-900">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Your Referral Code</h2>
        </div>
        <p className="text-5xl font-bold font-mono mb-6">{user.referralCode}</p>
        <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-4">
          <p className="text-xs font-medium mb-1">Referral Link</p>
          <p className="text-sm font-mono break-all">{referralLink}</p>
        </div>
        <div className="flex gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyLink} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors backdrop-blur">
            {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={shareWhatsApp} className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors">
            <Share2 className="w-5 h-5" />
            Share on WhatsApp
          </motion.button>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <DollarSign className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="font-bold text-lg mb-2">Level 1: 10%</h3>
          <p className="text-sm text-white/60">Earn 10% commission on every direct referral's monthly contribution</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <DollarSign className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="font-bold text-lg mb-2">Level 2: 5%</h3>
          <p className="text-sm text-white/60">Earn 5% commission on contributions from your referrals' referrals</p>
        </motion.div>
      </div>
    </div>
  );
}
