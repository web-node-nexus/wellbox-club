import { motion } from 'framer-motion';
import { Gem, Phone, MessageCircle, Heart, Filter, Scale, Award, X } from 'lucide-react';
import { goldDesigns, GoldDesign } from '../data/mockData';
import { useState } from 'react';

export default function GoldShowroom() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDesign, setSelectedDesign] = useState<GoldDesign | null>(null);
  const [showInterest, setShowInterest] = useState(false);
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  const categories = ['all', ...new Set(goldDesigns.map(d => d.category))];
  const filtered = selectedCategory === 'all' ? goldDesigns : goldDesigns.filter(d => d.category === selectedCategory);

  const handleInterest = () => {
    setInterestSubmitted(true);
    setTimeout(() => {
      setInterestSubmitted(false);
      setShowInterest(false);
    }, 3000);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Necklace': return '📿';
      case 'Bangles': return '⭕';
      case 'Chain': return '⛓️';
      case 'Ring': return '💍';
      case 'Earrings': return '✨';
      case 'Coins': return '🪙';
      case 'Set': return '👑';
      default: return '💎';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Digital Gold Showroom</h1>
        <p className="text-gray-500 mt-1">Browse premium gold designs at manufacturer prices</p>
      </div>

      {/* Highlight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-600 to-yellow-500 rounded-2xl p-5 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Gem className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold">Get gold at very cheap price - directly from the manufacturer!</p>
            <p className="text-sm text-amber-100 mt-0.5">No middlemen. Best quality. BIS Hallmarked. Custom designs available.</p>
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
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
            {cat === 'all' ? 'All Designs' : `${getCategoryIcon(cat)} ${cat}`}
          </button>
        ))}
      </div>

      {/* Gold Designs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((design, i) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all group"
          >
            {/* Image placeholder with gradient */}
            <div className="h-48 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">{getCategoryIcon(design.category)}</span>
              </div>
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
                  <Scale className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{design.weightGrams}g</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm text-gray-500">{design.makingCharges}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedDesign(design)}
                className="w-full mt-3 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all"
              >
                I'm Interested
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Design Detail Modal */}
      {selectedDesign && !showInterest && (
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
            <div className="h-56 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl">{getCategoryIcon(selectedDesign.category)}</span>
              </div>
              <button onClick={() => setSelectedDesign(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-lg">{selectedDesign.category}</span>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">{selectedDesign.purity}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{selectedDesign.name}</h2>
              <p className="text-sm text-gray-600 mt-2">{selectedDesign.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="text-lg font-bold text-gray-900">{selectedDesign.weightGrams} grams</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Making Charges</p>
                  <p className="text-lg font-bold text-gray-900">{selectedDesign.makingCharges}</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-700">💡 Price available on request. Contact us for the best manufacturer price!</p>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowInterest(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" /> I'm Interested
                </button>
                <a href="tel:+919876543210" className="py-3 px-4 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="py-3 px-4 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Interest Form Modal */}
      {showInterest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => { setShowInterest(false); setInterestSubmitted(false); }}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            {interestSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Interest Registered!</h3>
                <p className="text-sm text-gray-500 mt-2">Our team will contact you shortly. You can also call or WhatsApp us directly.</p>
                <div className="flex gap-3 mt-6 justify-center">
                  <a href="tel:+919876543210" className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg">📞 Call Now</a>
                  <a href="https://wa.me/919876543210" className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg">💬 WhatsApp</a>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Express Interest</h3>
                <p className="text-sm text-gray-500 mb-4">For: {selectedDesign?.name}</p>
                <form onSubmit={handleInterest} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input type="text" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                    <textarea className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500" rows={3} placeholder="Any specific requirements..." />
                  </div>
                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all">
                    Submit Interest
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
