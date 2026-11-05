import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gem, Phone, User, Scale, Loader2, CheckCircle } from 'lucide-react';
import { saveGoldOrder } from '../services/investmentService';

interface OrderGoldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CARAT_OPTIONS = ['24K', '22K', '21K', '20K', '18K', '16K', '14K', '12K', '10K', '9K'] as const;
type CaratOption = (typeof CARAT_OPTIONS)[number];

export default function OrderGoldModal({ isOpen, onClose }: OrderGoldModalProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [carat, setCarat] = useState<CaratOption>('22K');
  const [grams, setGrams] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setName('');
    setMobile('');
    setCarat('22K');
    setGrams('');
    setError('');
    setLoading(false);
    setDone(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    const weight = Number(grams);
    if (!weight || weight <= 0) {
      setError('Enter gold weight in grams');
      return;
    }

    setLoading(true);
    try {
      await saveGoldOrder({
        id: `pgold_${Date.now()}`,
        userId: `guest_${mobile}`,
        userName: name.trim(),
        userMobile: mobile,
        designId: carat.toLowerCase(),
        designName: `${carat} Gold (Direct Order)`,
        weightGrams: weight,
        amount: 0,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        investmentIds: [],
      });
      setDone(true);
    } catch (err: any) {
      setError(err?.message || 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#2a1a4a] to-[#1a0f2e] border border-amber-400/30 shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <Gem className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Order Gold</h3>
                  <p className="text-xs text-amber-200/80">Direct manufacturer purchase request</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 text-white/70"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {done ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle className="w-14 h-14 text-green-400 mx-auto" />
                <h4 className="text-xl font-bold text-white">Order Received</h4>
                <p className="text-sm text-white/70">
                  Our team will call you shortly with the live rate for {carat} · {grams}g.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-purple-950 font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-400/30 text-sm text-red-200">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300/70" />
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300/70" />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-white/50">+91</span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-20 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                      placeholder="10-digit mobile"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Carat *</label>
                  <select
                    value={carat}
                    onChange={e => setCarat(e.target.value as CaratOption)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="24K" className="bg-[#2a1a4a]">24K</option>
                    <option value="22K" className="bg-[#2a1a4a]">22K</option>
                    <option value="21K" className="bg-[#2a1a4a]">21K</option>
                    <option value="20K" className="bg-[#2a1a4a]">20K</option>
                    <option value="18K" className="bg-[#2a1a4a]">18K</option>
                    <option value="16K" className="bg-[#2a1a4a]">16K</option>
                    <option value="14K" className="bg-[#2a1a4a]">14K</option>
                    <option value="12K" className="bg-[#2a1a4a]">12K</option>
                    <option value="10K" className="bg-[#2a1a4a]">10K</option>
                    <option value="9K" className="bg-[#2a1a4a]">9K</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Weight (grams) *</label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-300/70" />
                    <input
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={grams}
                      onChange={e => setGrams(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-white/30 focus:border-amber-400 focus:outline-none"
                      placeholder="e.g. 10"
                      required
                    />
                  </div>
                </div>

                <p className="text-xs text-amber-200/70">
                  Live manufacturer rate will be confirmed on call. This request goes to Admin.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-purple-950 font-bold shadow-lg shadow-amber-500/30 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Gem className="w-5 h-5" />
                      Place Gold Order
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
