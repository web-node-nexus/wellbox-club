import { motion } from 'framer-motion';
import { Gem, Phone, MessageCircle, Scale, Award, Filter, Sparkles } from 'lucide-react';
import { useState } from 'react';
import GoldSection from '../components/GoldSection';
interface PageProps { onJoinClick: () => void; }

export default function GoldShowroomPublic({ onJoinClick }: PageProps) {
  const [category, setCategory] = useState('all');
  const designs = [
    { name: 'Royal Necklace Set', category: 'Necklace', weight: 45.5, purity: '22K', making: '₹800/g', emoji: '📿', desc: 'Exquisite traditional necklace with intricate kundan work. Perfect for weddings.' },
    { name: 'Antique Bangles Pair', category: 'Bangles', weight: 28, purity: '22K', making: '₹600/g', emoji: '⭕', desc: 'Beautiful antique finish bangles with traditional motifs. Lightweight daily wear.' },
    { name: 'Diamond Cut Chain', category: 'Chain', weight: 15.2, purity: '22K', making: '₹500/g', emoji: '⛓️', desc: 'Stunning diamond cut gold chain with brilliant shine. Modern design.' },
    { name: 'Temple Jewelry Set', category: 'Set', weight: 120, purity: '22K', making: '₹1200/g', emoji: '👑', desc: 'Complete temple set including necklace, earrings, maang tikka. Handcrafted.' },
    { name: 'Minimalist Ring', category: 'Ring', weight: 4.8, purity: '24K', making: '₹400/g', emoji: '💍', desc: 'Elegant minimalist ring in pure 24K gold. Perfect everyday wear.' },
    { name: 'Jhumka Earrings', category: 'Earrings', weight: 18.5, purity: '22K', making: '₹700/g', emoji: '✨', desc: 'Traditional jhumka with pearl drops. Classic design that never fades.' },
    { name: 'Gold Coin 10g', category: 'Coins', weight: 10, purity: '24K', making: '₹200/g', emoji: '🪙', desc: 'Pure 24K gold coin for investment and gifting. BIS hallmarked.' },
    { name: 'Bridal Choker', category: 'Necklace', weight: 85, purity: '22K', making: '₹1500/g', emoji: '💎', desc: 'Magnificent bridal choker with precious stone embedding.' },
    { name: 'Anklet Pair', category: 'Bangles', weight: 22, purity: '22K', making: '₹550/g', emoji: '🦶', desc: 'Traditional silver-gold plated anklets. Beautiful craftsmanship.' },
    { name: 'Mangalsutra', category: 'Necklace', weight: 12, purity: '22K', making: '₹650/g', emoji: '📿', desc: 'Classic mangalsutra with black beads and gold pendant.' },
    { name: 'Nose Ring', category: 'Earrings', weight: 2.5, purity: '22K', making: '₹450/g', emoji: '💫', desc: 'Delicate nose ring with tiny diamond accent. Elegant and subtle.' },
    { name: 'Gold Bar 50g', category: 'Coins', weight: 50, purity: '24K', making: '₹150/g', emoji: '🏅', desc: 'Investment-grade 24K gold bar. Perfect for wealth building.' },
  ];

  const categories = ['all', ...new Set(designs.map(d => d.category))];
  const filtered = category === 'all' ? designs : designs.filter(d => d.category === category);

  return (
    <div className="min-h-screen bg-[#0f0520] text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 premium-bg" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -70, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['💎', '👑', '✨', '🪙', '💍'][i % 5]}
            </motion.div>
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">Digital Showroom</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              Gold <span className="gradient-text">Showroom</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-6">
              Get gold at very cheap price - directly from the manufacturer! No middlemen, no markup, just pure gold at wholesale rates.
            </p>
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500/10 border border-amber-500/30 rounded-full">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-amber-300 font-medium">BIS Hallmarked • 100% Certified</span>
            </div>
          </motion.div>
        </div>
      </section>

      <GoldSection>
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <Filter className="w-5 h-5 text-white/40 flex-shrink-0" />
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 shadow-lg shadow-amber-500/30'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:border-amber-500/30 hover:text-amber-400'
              }`}
            >
              {cat === 'all' ? '✨ All Designs' : cat}
            </motion.button>
          ))}
        </div>

        {/* Designs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all group gold-card"
            >
              <div className="h-48 bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center relative overflow-hidden">
                <motion.span
                  className="text-7xl"
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.emoji}
                </motion.span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/10 backdrop-blur rounded-lg text-xs text-amber-300 font-semibold border border-amber-500/20">{item.purity}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1 group-hover:text-amber-400 transition-colors">{item.name}</h3>
                <p className="text-xs text-white/50 mt-1 line-clamp-2">{item.desc}</p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <Scale className="w-3 h-3 text-amber-400" />
                    <span className="text-xs font-bold text-amber-400">{item.weight}g</span>
                  </div>
                  <span className="text-xs text-white/40">{item.making}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <a href="tel:+919876543210" className="flex-1 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-xs text-green-400 text-center hover:bg-green-600/30 flex items-center justify-center gap-1 transition-colors">
                    <Phone className="w-3 h-3" /> Call
                  </a>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 text-center hover:bg-emerald-600/30 flex items-center justify-center gap-1 transition-colors">
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12 p-8 glass rounded-2xl border border-amber-500/20 gold-border">
          <p className="text-lg text-white/70 mb-3">Want to see more designs or place a custom order?</p>
          <p className="text-amber-400 font-bold text-xl">Contact us on WhatsApp: +91 98765 43210</p>
        </div>
      </GoldSection>
    </div>
  );
}
