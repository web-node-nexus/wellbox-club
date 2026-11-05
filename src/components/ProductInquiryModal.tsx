import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, ShoppingCart, Scale, Gem, Phone, User, Loader2, CheckCircle } from 'lucide-react';
import { saveGoldOrder } from '../services/investmentService';
import { useAuth } from '../context/AuthContext';

export type ShowroomProduct = {
  id?: string;
  name: string;
  category: string;
  weight: number | string;
  purity: string;
  making?: string;
  image?: string;
  desc?: string;
};

interface ProductInquiryModalProps {
  product: ShowroomProduct | null;
  mode: 'detail' | 'buy' | null;
  onClose: () => void;
  onSwitchToBuy?: () => void;
}

function parseWeight(weight: number | string): number {
  if (typeof weight === 'number') return weight;
  const n = parseFloat(String(weight).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export default function ProductInquiryModal({
  product,
  mode,
  onClose,
  onSwitchToBuy,
}: ProductInquiryModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [confirmStep, setConfirmStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const resetBuy = () => {
    setConfirmStep(false);
    setLoading(false);
    setDone(false);
    setError('');
    setName(user?.name || '');
    setMobile(user?.mobile || '');
  };

  const handleClose = () => {
    resetBuy();
    onClose();
  };

  const startBuyConfirm = () => {
    setConfirmStep(true);
    setError('');
    setDone(false);
  };

  const submitBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const grams = parseWeight(product.weight);
      await saveGoldOrder({
        id: `pgold_${Date.now()}`,
        userId: user?.id || `guest_${mobile}`,
        userName: name.trim(),
        userMobile: mobile,
        designId: product.id || product.name.toLowerCase().replace(/\s+/g, '_'),
        designName: `${product.name} · ${product.purity} (Buy Now)`,
        weightGrams: grams || 0,
        amount: 0,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        investmentIds: [],
      });
      setDone(true);
    } catch (err: any) {
      setError(err?.message || 'Could not send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const open = !!product && !!mode;
  const gramsLabel =
    typeof product?.weight === 'number' ? `${product.weight}g` : String(product?.weight || '');

  return (
    <AnimatePresence>
      {open && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-gradient-to-b from-[#2a1a4a] to-[#1a0f2e] border border-amber-400/30 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header image */}
            <div className="relative h-48 sm:h-56 bg-gradient-to-br from-amber-900/40 to-purple-900/40">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">💎</div>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-purple-950 text-xs font-bold">
                  {product.purity}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold border border-white/20">
                  {product.category}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              {done ? (
                <div className="text-center space-y-3 py-4">
                  <CheckCircle className="w-14 h-14 text-green-400 mx-auto" />
                  <h3 className="text-xl font-bold text-white">Request Sent to Admin</h3>
                  <p className="text-sm text-white/70">
                    {product.name} · {gramsLabel} — our team will call you shortly with the live rate.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-purple-950 font-bold"
                  >
                    Done
                  </button>
                </div>
              ) : mode === 'detail' && !confirmStep ? (
                <>
                  <div>
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wide mb-1">
                      <Eye className="w-3.5 h-3.5" /> Product Details
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{product.name}</h3>
                    {product.desc && (
                      <p className="mt-2 text-sm text-white/70 leading-relaxed">{product.desc}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                      <p className="text-[10px] uppercase text-white/40">Weight</p>
                      <p className="flex items-center gap-1.5 font-bold text-amber-300 mt-0.5">
                        <Scale className="w-4 h-4" /> {gramsLabel}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                      <p className="text-[10px] uppercase text-white/40">Purity</p>
                      <p className="flex items-center gap-1.5 font-bold text-amber-300 mt-0.5">
                        <Gem className="w-4 h-4" /> {product.purity}
                      </p>
                    </div>
                    {product.making && (
                      <div className="rounded-xl bg-white/5 border border-white/10 p-3 col-span-2">
                        <p className="text-[10px] uppercase text-white/40">Making charges</p>
                        <p className="font-semibold text-white mt-0.5">{product.making}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-amber-200/70">
                    Price is confirmed on call (manufacturer live rate). No online payment here.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      onSwitchToBuy?.();
                      startBuyConfirm();
                    }}
                    className="w-full min-h-12 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-purple-950 font-bold flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" /> Buy Now
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wide mb-1">
                      <ShoppingCart className="w-3.5 h-3.5" /> Confirm Buy Request
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{product.name}</h3>
                    <p className="text-sm text-white/60 mt-1">
                      {gramsLabel} · {product.purity} — details will be shared with Admin.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/15 border border-red-400/30 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <form onSubmit={submitBuy} className="space-y-3">
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
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-white/50">
                          +91
                        </span>
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

                    <p className="text-xs text-amber-200/70">
                      On confirm, this request is shared with Admin. Our team will call you with the live rate.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 min-h-12 py-3 rounded-xl border border-white/20 text-white/80 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 min-h-12 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-purple-950 font-bold disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" /> Confirm & Send to Admin
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
