import { motion } from 'framer-motion';
import { Gem, Phone, MessageCircle, Filter, Scale, Award, X, Lock, Unlock, ShoppingBag } from 'lucide-react';
import { goldDesigns, GoldDesign } from '../data/mockData';
import { designImages } from '../data/goldImages';
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getInvestments,
  getUnlockedInvested,
  getLockedInvested,
  getTotalInvested,
  spendUnlockedInvestment,
  saveGoldOrder,
  getUserGoldOrders,
} from '../services/investmentService';

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
      showToast('error', 'Enter a valid order amount', 'Error');
      return;
    }
    if (amt > unlocked) {
      showToast('error', 'Not enough unlocked investment. Wait 12 months or invest more earlier.', 'Locked');
      return;
    }

    const spent = spendUnlockedInvestment(user.id, amt);
    if (!spent.success) {
      showToast('error', spent.message, 'Error');
      return;
    }

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

    showToast('success', 'Gold order placed — admin can see it now', 'Ordered');
    setSelectedDesign(null);
    setOrderAmount('');
    setRefresh(x => x + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Digital Gold Showroom</h1>
        <p className="text-gray-500 mt-1">Weight only — no product prices. Redeem unlocked investment after 12 months.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid sm:grid-cols-3 gap-3"
      >
        <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <p className="text-xs text-blue-100">Total invested</p>
          <p className="text-2xl font-bold">₹{total.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <p className="text-xs text-amber-100 flex items-center gap-1"><Lock className="w-3 h-3" /> Locked (12 mo)</p>
          <p className="text-2xl font-bold">₹{locked.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <p className="text-xs text-green-100 flex items-center gap-1"><Unlock className="w-3 h-3" /> Unlocked for gold</p>
          <p className="text-2xl font-bold">₹{unlocked.toLocaleString()}</p>
        </div>
      </motion.div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        Product prices are hidden. Only weight is shown. Use unlocked investment to place a gold order — admin will see it.
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
                : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-200 hover:text-amber-600'
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
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all group"
          >
            <div className="h-48 relative overflow-hidden">
              <img
                src={designImages[design.name] || designImages['Royal Necklace Set']}
                alt={design.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-medium text-amber-700 shadow-sm">
                  {design.purity}
                </span>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                  {design.category}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors">{design.name}</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{design.description}</p>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-sm font-bold text-gray-900">{design.weightGrams}g</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm text-gray-500">{design.purity}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedDesign(design);
                  setOrderAmount(unlocked > 0 ? String(Math.min(unlocked, 1000)) : '');
                }}
                className="w-full mt-3 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all"
              >
                Order with Investment
              </button>
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
                  <p className="text-xs text-gray-500">{o.createdAt} · {o.status}</p>
                </div>
                <p className="font-bold text-amber-700">₹{o.amount.toLocaleString()}</p>
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
                  <p className="font-medium">₹{inv.amount.toLocaleString()}</p>
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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-56 relative">
              <img
                src={designImages[selectedDesign.name] || designImages['Royal Necklace Set']}
                alt={selectedDesign.name}
                className="w-full h-full object-cover"
              />
              <button onClick={() => setSelectedDesign(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg">{selectedDesign.category}</span>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">{selectedDesign.purity}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{selectedDesign.name}</h2>
              <p className="text-sm text-gray-600">{selectedDesign.description}</p>

              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-2xl font-bold text-gray-900">{selectedDesign.weightGrams} grams</p>
                <p className="text-xs text-gray-500 mt-2">Price not shown — redeem with unlocked investment only</p>
              </div>

              <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-800">
                Unlocked for gold: <strong>₹{unlocked.toLocaleString()}</strong>
                {unlocked <= 0 && (
                  <span className="block text-xs mt-1 text-amber-700">No unlocked balance yet. Investment unlocks after 12 months.</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order amount (₹) from investment</label>
                <input
                  type="number"
                  min={1}
                  max={unlocked}
                  value={orderAmount}
                  onChange={e => setOrderAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                  placeholder={`Max ₹${unlocked.toLocaleString()}`}
                />
              </div>

              <button
                onClick={handleOrder}
                disabled={unlocked <= 0}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Gem className="w-4 h-4" /> Place Gold Order
              </button>

              <div className="flex gap-3">
                <a href="tel:+919876543210" className="flex-1 py-3 bg-green-600 text-white font-medium rounded-xl text-center flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-emerald-600 text-white font-medium rounded-xl text-center flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
