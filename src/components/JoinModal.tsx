import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, User, Phone, MapPin, Tag, CheckCircle, Loader2, Sparkles } from 'lucide-react';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'member' | 'leader';
}

export default function JoinModal({ isOpen, onClose, initialTab = 'member' }: JoinModalProps) {
  const [activeTab, setActiveTab] = useState<'member' | 'leader'>(initialTab);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    referralCode: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = 'Enter valid 10-digit mobile';
    if (activeTab === 'leader' && !formData.city.trim()) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  const handleClose = () => {
    setStep('form');
    setFormData({ name: '', mobile: '', referralCode: '', city: '' });
    setErrors({});
    onClose();
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
            className="relative w-full max-w-md bg-gradient-to-b from-purple-950 to-[#0f0520] rounded-3xl border border-amber-500/20 shadow-2xl shadow-amber-500/10 overflow-hidden"
          >
            <button onClick={handleClose} className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 p-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-purple-900" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-[var(--font-heading)] text-white">Join Jwellbox Club</h2>
                  <p className="text-xs text-amber-300/70">Start your gold journey today</p>
                </div>
              </div>
              <div className="flex gap-2 bg-black/30 rounded-xl p-1">
                <button onClick={() => { setActiveTab('member'); setStep('form'); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'member' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 shadow-lg' : 'text-white/60 hover:text-white'}`}>
                  <User className="w-4 h-4 inline mr-1" /> Member
                </button>
                <button onClick={() => { setActiveTab('leader'); setStep('form'); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'leader' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}>
                  <Crown className="w-4 h-4 inline mr-1" /> Leader
                </button>
              </div>
            </div>
            <div className="p-6">
              {step === 'form' && (
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Enter your full name" className={`w-full pl-10 pr-4 py-3.5 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-base`} />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-white/40">+91</span>
                      <input type="tel" value={formData.mobile} onChange={e => setFormData(p => ({ ...p, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))} placeholder="98765 43210" className={`w-full pl-20 pr-4 py-3.5 bg-white/5 border ${errors.mobile ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-base`} />
                    </div>
                    {errors.mobile && <p className="text-xs text-red-400 mt-1">{errors.mobile}</p>}
                  </div>
                  {activeTab === 'leader' && (
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">City *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input type="text" value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))} placeholder="Your city" className={`w-full pl-10 pr-4 py-3.5 bg-white/5 border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-base`} />
                      </div>
                      {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
                    </div>
                  )}
                  {activeTab === 'member' && (
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1.5">Referral Code (Optional)</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input type="text" value={formData.referralCode} onChange={e => setFormData(p => ({ ...p, referralCode: e.target.value.toUpperCase() }))} placeholder="Enter referral code" className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-base uppercase" />
                      </div>
                    </div>
                  )}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className={`w-full py-4 rounded-xl font-semibold text-base shadow-lg transition-all disabled:opacity-50 ${activeTab === 'member' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 shadow-amber-500/30' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/30'}`}>
                    {loading ? (<Loader2 className="w-5 h-5 animate-spin mx-auto" />) : (<><Sparkles className="w-4 h-4 inline mr-2" />{activeTab === 'member' ? 'Join as Member' : 'Apply as Leader'}</>)}
                  </motion.button>
                  <p className="text-center text-xs text-white/40">By joining, you agree to our Terms & Privacy Policy</p>
                </motion.form>
              )}
              {step === 'success' && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Welcome to Jwellbox Club! 🎉</h3>
                  <p className="text-sm text-white/60 mb-2">{activeTab === 'member' ? 'Your membership is confirmed. Start building your team and earning commissions!' : 'Your leader application has been received. Our team will contact you within 24 hours.'}</p>
                  <p className="text-xs text-amber-400/70 italic mb-6">"Ab shuru hoga asli gold rush!" 💰</p>
                  <button onClick={handleClose} className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-colors">Close</button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}