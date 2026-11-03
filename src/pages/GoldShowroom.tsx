import { motion } from 'framer-motion';
import { Gem, Phone, MessageCircle, Filter, Scale, X, Lock, Unlock, ShoppingBag } from 'lucide-react';
import { goldDesigns, GoldDesign } from '../data/mockData';
import { designImages } from '../data/goldImages';
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { BUSINESS_RULES, formatInr } from '../data/businessRules';
import {
  getInvestments,
  getUnlockedInvested,
  getLockedInvested,
  getTotalInvested,
  spendUnlockedInvestment,
  saveGoldOrder,
  getUserGoldOrders,
} from '../services/investmentService';

const CALL_NUMBER = '+919876543210';
const WA_NUMBER = '919876543210';

export default function GoldShowroom() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDesign, setSelectedDesign] = useState<GoldDesign | null>(null);
  const [orderAmount, setOrderAmount] = useState('');
  const [refresh, setRefresh] = useState(0);

  const categories = ['all', ...new Set(goldDesigns.map(d => d.category))];
  const filtered = selectedCategory === 'all' ? goldDesigns : goldDesigns.filter(d => d.category === selectedCategory);

  const unlocked = user ? getUnlockedInvested(user.id) : 0;
  const locked = user ? getLockedInvested(user.id) : 0;
  const total = user ? getTotalInvested(user.id) : 0;
  const investments = user ? getInvestments(user.id) : [];
  const myOrders = useMemo(
    () => (user ? getUserGoldOrders(user.id) : []),
    [user, refresh]
  );

  const handleOrder = () => {
    if (!user || !selectedDesign) return;
    const amt = Number(orderAmount);
    if (!amt || amt <= 0) {
      showToast('error', 'Enter order amount from unlocked investment', 'Error');
      return;
    }
    if (amt > unlocked) {
      showToast('error', 'Insufficient unlocked investment (12-month lock)', 'Locked');
      return;
    }

    const spent = spendUnlockedInvestment(user.id, amt);
    if (!spent.success) {
      showToast('error', spent.message, 'Error');
      return;
    }

    const referrerCommission = Math.round(amt * (BUSINESS_RULES.goldOrderPercent / 100));

    saveGoldOrder({
      id: `go_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userMobile: user.mobile,
      designId: selectedDesign.id,
      designName: selectedDesign.name,
      weightGrams: selectedDesign.weightGrams,
      amount: amt,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      investmentIds: spent.investmentIds,
    });

    showToast(
      'success',
      `Order placed. Referrer earns ${BUSINESS_RULES.goldOrderPercent}% (${formatInr(referrerCommission)}) when referred.`,
      'Gold Order'
    );
    setSelectedDesign(null);
    setOrderAmount('');
    setRefresh(x => x + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Digital Gold Showroom</h1>
        <p className="text-gray-500 mt-1">
          Designs by <strong>gram only</strong> — no price. Call us to order. Direct from manufacturer = very cheap.
        </p>
      </div>

      <div className="rounded-2xl p-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-950 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <p className="font-bold text-lg flex items-center gap-2">
              <Gem className="w-5 h-5" /> Manufacturer price — no middlemen
            </p>
            <p className="text-sm opacity-80 mt-1">
              Price screen pe nahi dikhega. User design + weight dekhe, phir call/WhatsApp kare. Order pe referrer ko {BUSINESS_RULES.goldOrderPercent}% milta hai.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <a href={`tel:${CALL_NUMBER}`} className="px-4 py-2.5 bg-purple-900 text-white rounded-xl font-semibold text-sm inline-flex items-center gap-2">
              <Phone className="w-4 h-4" /> Call
            </a>
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-white text-purple-900 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <p className="text-xs text-blue-100">Total invested</p>
          <p className="text-2xl font-bold">{formatInr(total)}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <p className="text-xs text-amber-100 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked (12 mo)</p>
          <p className="text-2xl font-bold">{formatInr(locked)}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <p className="text-xs text-green-100 flex items-center gap-1"><Unlock className="w-3 h-3" /> Unlocked for gold</p>
          <p className="text-2xl font-bold">{formatInr(unlocked)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {cat === 'all' ? 'All Designs' : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((design, i) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all group"
          >
            <div className="h-48 relative overflow-hidden">
              <img
                src={designImages[design.name] || designImages['Royal Necklace Set']}
                alt={design.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 bg-white/90 rounded-lg text-xs font-medium text-amber-700">{design.purity}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{design.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{design.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-500" />
                  <span className="text-base font-bold text-gray-900">{design.weightGrams}g</span>
                </div>
                <span className="text-xs text-gray-400">No price shown</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <a href={`tel:${CALL_NUMBER}`} className="py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl text-center inline-flex items-center justify-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDesign(design);
                    setOrderAmount(unlocked > 0 ? String(Math.min(unlocked, 5000)) : '');
                  }}
                  className="py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-xl"
                >
                  Use Investment
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {myOrders.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-600" /> My Gold Orders
          </h3>
          <div className="space-y-2">
            {myOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                <div>
                  <p className="font-medium text-gray-900">{o.designName} · {o.weightGrams}g</p>
                  <p className="text-xs text-gray-500">{o.createdAt} · {o.status} · admin notified</p>
                </div>
                <p className="font-bold text-amber-700">{formatInr(o.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {investments.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-3">Investment holdings</h3>
          <div className="space-y-2">
            {investments.map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                <div>
                  <p className="font-medium">{formatInr(inv.amount)}</p>
                  <p className="text-xs text-gray-500">Until {inv.lockedUntil}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  inv.status === 'unlocked' ? 'bg-green-100 text-green-700' :
                  inv.status === 'used' ? 'bg-gray-200 text-gray-600' :
                  'bg-amber-100 text-amber-700'
                }`}>{inv.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDesign && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedDesign(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-56 relative">
              <img
                src={designImages[selectedDesign.name] || designImages['Royal Necklace Set']}
                alt={selectedDesign.name}
                className="w-full h-full object-cover"
              />
              <button type="button" onClick={() => setSelectedDesign(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg">{selectedDesign.category}</span>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">{selectedDesign.purity}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{selectedDesign.name}</h2>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Weight (price not displayed)</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Scale className="w-6 h-6 text-amber-500" /> {selectedDesign.weightGrams} grams
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Call for manufacturer rate. Prefer unlocked investment after 12 months, or call now for purchase.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:${CALL_NUMBER}`} className="py-3 bg-green-600 text-white font-medium rounded-xl text-center flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
                <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi, interested in ${selectedDesign.name} (${selectedDesign.weightGrams}g)`)}`} target="_blank" rel="noreferrer" className="py-3 bg-emerald-600 text-white font-medium rounded-xl text-center flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Or redeem unlocked investment</p>
                <p className="text-xs text-green-700 mb-2">Available: {formatInr(unlocked)} · Referrer gets {BUSINESS_RULES.goldOrderPercent}%</p>
                <input
                  type="number"
                  min={1}
                  max={unlocked}
                  value={orderAmount}
                  onChange={e => setOrderAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3"
                  placeholder="Amount from investment"
                />
                <button
                  type="button"
                  onClick={handleOrder}
                  disabled={unlocked <= 0}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl disabled:opacity-50"
                >
                  Place Gold Order (Admin notified)
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
