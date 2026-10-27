import { motion } from 'framer-motion';
import { Gem, Phone, MessageCircle, Scale, Award, Filter, Sparkles, Eye, Heart, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';
interface PageProps { onJoinClick: () => void; }

export default function GoldShowroomPublic({ onJoinClick }: PageProps) {
  const { showToast } = useToast();
  const [category, setCategory] = useState('all');
  const [selectedDesign, setSelectedDesign] = useState<any>(null);

  const designs = [
    { name: 'Royal Necklace Set', category: 'Necklace', weight: 45.5, purity: '22K', making: '₹800/g', emoji: '📿', desc: 'Exquisite traditional necklace with intricate kundan work. Perfect for weddings and special occasions.', price: '₹2,85,000' },
    { name: 'Antique Bangles Pair', category: 'Bangles', weight: 28, purity: '22K', making: '₹600/g', emoji: '⭕', desc: 'Beautiful antique finish bangles with traditional motifs. Lightweight daily wear.', price: '₹1,76,000' },
    { name: 'Diamond Cut Chain', category: 'Chain', weight: 15.2, purity: '22K', making: '₹500/g', emoji: '⛓️', desc: 'Stunning diamond cut gold chain with brilliant shine. Modern design.', price: '₹95,000' },
    { name: 'Temple Jewelry Set', category: 'Set', weight: 120, purity: '22K', making: '₹1200/g', emoji: '👑', desc: 'Complete temple set including necklace, earrings, maang tikka. Handcrafted.', price: '₹7,50,000' },
    { name: 'Minimalist Ring', category: 'Ring', weight: 4.8, purity: '24K', making: '₹400/g', emoji: '💍', desc: 'Elegant minimalist ring in pure 24K gold. Perfect everyday wear.', price: '₹30,000' },
    { name: 'Jhumka Earrings', category: 'Earrings', weight: 18.5, purity: '22K', making: '₹700/g', emoji: '✨', desc: 'Traditional jhumka with pearl drops. Classic design that never fades.', price: '₹1,16,000' },
    { name: 'Gold Coin 10g', category: 'Coins', weight: 10, purity: '24K', making: '₹200/g', emoji: '🪙', desc: 'Pure 24K gold coin for investment and gifting. BIS hallmarked.', price: '₹62,500' },
    { name: 'Bridal Choker', category: 'Necklace', weight: 85, purity: '22K', making: '₹1500/g', emoji: '💎', desc: 'Magnificent bridal choker with precious stone embedding.', price: '₹5,35,000' },
    { name: 'Anklet Pair', category: 'Bangles', weight: 22, purity: '22K', making: '₹550/g', emoji: '🦶', desc: 'Traditional silver-gold plated anklets. Beautiful craftsmanship.', price: '₹1,38,000' },
    { name: 'Mangalsutra', category: 'Necklace', weight: 12, purity: '22K', making: '₹650/g', emoji: '📿', desc: 'Classic mangalsutra with black beads and gold pendant.', price: '₹75,000' },
    { name: 'Nose Ring', category: 'Earrings', weight: 2.5, purity: '22K', making: '₹450/g', emoji: '💫', desc: 'Delicate nose ring with tiny diamond accent. Elegant and subtle.', price: '₹16,000' },
    { name: 'Gold Bar 50g', category: 'Coins', weight: 50, purity: '24K', making: '₹150/g', emoji: '🏅', desc: 'Investment-grade 24K gold bar. Perfect for wealth building.', price: '₹3,12,500' },
  ];

  const categories = ['all', ...new Set(designs.map(d => d.category))];
  const filtered = category === 'all' ? designs : designs.filter(d => d.category === category);

  const handleContact = (type: 'call' | 'whatsapp') => {
    if (type === 'call') {
      window.location.href = 'tel:+919876543210';
    } else {
      const message = `Hi! I'm interested in the ${selectedDesign?.name} (${selectedDesign?.weight}g, ${selectedDesign?.purity}). Can you provide more details?`;
      window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
    }
    showToast('success', `${type === 'call' ? 'Calling' : 'Opening WhatsApp'}...`, 'Contact Request Sent');
  };

  return (
    <div className="min-h-screen bg-[#0f0520] text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 premium-bg" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.7, 0.2],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['💎', '💍', '👑', '✨', '🪙'][i % 5]}
            </motion.div>
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-amber-500/20 border-2 border-amber-500/30 rounded-full mb-8 animated-gradient-border"
            >
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span className="text-lg font-bold text-amber-300">Digital Showroom</span>
              <Sparkles className="w-6 h-6 text-amber-400" />
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6 text-shadow-gold">
              Gold <span className="gradient-text">Showroom</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-6">
              Get gold at very cheap price - directly from the manufacturer! No middlemen, no markup, just pure gold at wholesale rates.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-full backdrop-blur-xl">
              <Award className="w-6 h-6 text-amber-400" />
              <span className="text-amber-300 font-bold text-lg">BIS Hallmarked • 100% Certified</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  category === cat
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 shadow-lg shadow-amber-500/30'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:border-amber-500/30 hover:text-amber-400'
                }`}
              >
                {cat === 'all' ? '✨ All Designs' : cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Designs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="group relative glass-premium rounded-3xl overflow-hidden border border-white/5 hover:border-amber-500/40 transition-all duration-300 premium-card-hover cursor-pointer"
              onClick={() => setSelectedDesign(item)}
            >
              {/* Image Area */}
              <div className="h-56 bg-gradient-to-br from-amber-900/30 via-purple-900/30 to-amber-900/30 flex items-center justify-center relative overflow-hidden">
                <motion.span
                  className="text-8xl"
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.emoji}
                </motion.span>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Action buttons on hover */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex-1 py-2 bg-white/20 backdrop-blur-xl rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-white/30 transition-colors"
                  >
                    <Eye className="w-3 h-3" /> View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex-1 py-2 bg-amber-500/80 backdrop-blur-xl rounded-lg text-xs font-bold text-purple-900 flex items-center justify-center gap-1 hover:bg-amber-500 transition-colors"
                  >
                    <Heart className="w-3 h-3" /> Save
                  </motion.button>
                </div>
                
                {/* Purity Badge */}
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full text-xs font-bold text-purple-900 shadow-lg">
                  {item.purity}
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/10 backdrop-blur rounded-full text-xs font-semibold text-white border border-white/20">
                  {item.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">{item.name}</h3>
                <p className="text-xs text-white/50 mb-3 line-clamp-2">{item.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-400" />
                    <span className="text-base font-bold text-amber-400">{item.weight}g</span>
                  </div>
                  <span className="text-xs text-white/40">{item.making}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-premium rounded-3xl p-8 lg:p-12 border border-amber-500/20 text-center animated-gradient-border"
        >
          <h3 className="text-3xl lg:text-4xl font-bold font-[var(--font-heading)] mb-4 text-shadow-gold">
            Interested in a Design?
          </h3>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Contact us directly for pricing, customization, or to place an order. We're here to help you find the perfect piece!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              href="tel:+919876543210"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-shadow flex items-center justify-center gap-3 btn-premium"
            >
              <Phone className="w-6 h-6" />
              Call Now
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow flex items-center justify-center gap-3 btn-premium"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp Us
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Design Detail Modal */}
      {selectedDesign && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedDesign(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl glass-premium rounded-3xl p-8 border border-amber-500/30 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDesign(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Image */}
              <div className="flex-1 h-64 bg-gradient-to-br from-amber-900/30 to-purple-900/30 rounded-2xl flex items-center justify-center">
                <span className="text-9xl">{selectedDesign.emoji}</span>
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-2">{selectedDesign.name}</h3>
                <p className="text-white/70 mb-4">{selectedDesign.desc}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/60">Weight</span>
                    <span className="font-bold text-amber-400 text-lg">{selectedDesign.weight}g</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/60">Purity</span>
                    <span className="font-bold text-amber-400 text-lg">{selectedDesign.purity}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-white/60">Making Charges</span>
                    <span className="font-bold text-amber-400 text-lg">{selectedDesign.making}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Category</span>
                    <span className="font-bold text-amber-400 text-lg">{selectedDesign.category}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleContact('call')}
                    className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 btn-premium"
                  >
                    <Phone className="w-5 h-5" />
                    Call
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleContact('whatsapp')}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 btn-premium"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
