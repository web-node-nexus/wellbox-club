import { motion } from 'framer-motion';
import { Gem, Phone, MessageCircle, Scale, Award, Filter, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import GoldBackground from '../components/GoldBackground';
import { designImages } from '../data/goldImages';
import { useLanguage } from '../context/LanguageContext';
interface PageProps { onJoinClick: () => void; }

export default function GoldShowroomPublic({ onJoinClick }: PageProps) {
  const { translate } = useLanguage();
  const [category, setCategory] = useState('all');
  
  // Default designs with real images
  const defaultDesigns = [
    { name: 'Royal Necklace Set', category: 'Necklace', weight: 45.5, purity: '22K', making: '₹800/g', image: designImages['Royal Necklace Set'], desc: 'Exquisite traditional necklace with intricate kundan work. Perfect for weddings.' },
    { name: 'Antique Bangles Pair', category: 'Bangles', weight: 28, purity: '22K', making: '₹600/g', image: designImages['Antique Bangles Pair'], desc: 'Beautiful antique finish bangles with traditional motifs. Lightweight daily wear.' },
    { name: 'Diamond Cut Chain', category: 'Chain', weight: 15.2, purity: '22K', making: '₹500/g', image: designImages['Diamond Cut Chain'], desc: 'Stunning diamond cut gold chain with brilliant shine. Modern design.' },
    { name: 'Temple Jewelry Set', category: 'Set', weight: 120, purity: '22K', making: '₹1200/g', image: designImages['Temple Jewelry Set'], desc: 'Complete temple set including necklace, earrings, maang tikka. Handcrafted.' },
    { name: 'Minimalist Ring', category: 'Ring', weight: 4.8, purity: '24K', making: '₹400/g', image: designImages['Minimalist Ring'], desc: 'Elegant minimalist ring in pure 24K gold. Perfect everyday wear.' },
    { name: 'Jhumka Earrings', category: 'Earrings', weight: 18.5, purity: '22K', making: '₹700/g', image: designImages['Jhumka Earrings'], desc: 'Traditional jhumka with pearl drops. Classic design that never fades.' },
    { name: 'Gold Coin 10g', category: 'Coins', weight: 10, purity: '24K', making: '₹200/g', image: designImages['Gold Coin 10g'], desc: 'Pure 24K gold coin for investment and gifting. BIS hallmarked.' },
    { name: 'Bridal Choker', category: 'Necklace', weight: 85, purity: '22K', making: '₹1500/g', image: designImages['Bridal Choker'], desc: 'Magnificent bridal choker with precious stone embedding.' },
    { name: 'Anklet Pair', category: 'Bangles', weight: 22, purity: '22K', making: '₹550/g', image: designImages['Anklet Pair'], desc: 'Traditional silver-gold plated anklets. Beautiful craftsmanship.' },
    { name: 'Mangalsutra', category: 'Necklace', weight: 12, purity: '22K', making: '₹650/g', image: designImages['Mangalsutra'], desc: 'Classic mangalsutra with black beads and gold pendant.' },
    { name: 'Nose Ring', category: 'Earrings', weight: 2.5, purity: '22K', making: '₹450/g', image: designImages['Nose Ring'], desc: 'Delicate nose ring with tiny diamond accent. Elegant and subtle.' },
    { name: 'Gold Bar 50g', category: 'Coins', weight: 50, purity: '24K', making: '₹150/g', image: designImages['Gold Bar 50g'], desc: 'Investment-grade 24K gold bar. Perfect for wealth building.' },
  ];

  // Get designs from localStorage (admin added) + default designs
  const [designs, setDesigns] = useState(() => {
    const adminDesigns = localStorage.getItem('admin_gold_designs');
    if (adminDesigns) {
      const parsed = JSON.parse(adminDesigns);
      // Convert admin designs to public format
      const adminFormatted = parsed
        .filter((d: any) => d.isActive) // Only show active designs
        .map((d: any) => ({
          name: d.name,
          category: d.category,
          weight: d.weightGrams,
          purity: d.purity,
          making: d.makingCharges,
          image: d.images[0] || designImages[d.name] || designImages['Royal Necklace Set'],
          desc: d.description || 'Premium gold jewellery design',
        }));
      return [...adminFormatted, ...defaultDesigns];
    }
    return defaultDesigns;
  });

  const categories = ['all', ...new Set(designs.map(d => d.category))];
  const filtered = category === 'all' ? designs : designs.filter(d => d.category === category);

  return (
    <div className="min-h-screen bg-[#0f0520] text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden luxury-bg">
        <GoldBackground intensity="heavy" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2, duration: 1 }}
              className="inline-block mb-8"
            >
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/50 gold-ring">
                <Gem className="w-16 h-16 text-purple-900" />
              </div>
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              <span className="text-white">{translate('goldShowroomPage.hero.title1')} </span>
              <span className="gold-text-shimmer">{translate('goldShowroomPage.hero.title2')}</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-6">
              {translate('goldShowroomPage.hero.subtitle')}
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-500/10 border-2 border-amber-500/30 rounded-full backdrop-blur-xl">
              <Award className="w-6 h-6 text-amber-400" />
              <span className="text-amber-300 font-bold text-lg">{translate('goldShowroomPage.hero.badge')}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4">
        {/* Category Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold">{translate('goldShowroomPage.filter.title')}</h2>
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
                    ? 'btn-gold-premium'
                    : 'card-inner-glow hover:border-amber-500/30'
                }`}
              >
                {cat === 'all' ? `✨ ${translate('goldShowroomPage.filter.allDesigns')}` : cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Designs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -15, scale: 1.05 }}
              className="gold-card-premium rounded-3xl overflow-hidden group cursor-pointer"
            >
              <div className="h-56 bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center relative overflow-hidden">
                {item.image ? (
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <motion.div
                    className="text-8xl"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    💎
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full text-xs font-bold text-purple-900 shadow-lg">
                  {item.purity}
                </div>
                <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/10 backdrop-blur rounded-full text-xs font-semibold text-white border border-white/20">
                  {item.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">{item.name}</h3>
                <p className="text-xs text-white/50 mb-3 line-clamp-2">{item.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-400" />
                    <span className="text-base font-bold gold-text-shimmer">{item.weight}g</span>
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
          className="mt-16 card-inner-glow rounded-3xl p-10 text-center border-2 border-amber-500/30"
        >
          <h3 className="text-4xl font-bold font-[var(--font-heading)] mb-4">
            {translate('goldShowroomPage.contact.title1')} <span className="gold-text-shimmer">{translate('goldShowroomPage.contact.title2')}</span>?
          </h3>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            {translate('goldShowroomPage.contact.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              href="tel:+919876543210"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-shadow flex items-center justify-center gap-3"
            >
              <Phone className="w-6 h-6" />
              {translate('goldShowroomPage.contact.callNow')}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow flex items-center justify-center gap-3"
            >
              <MessageCircle className="w-6 h-6" />
              {translate('goldShowroomPage.contact.whatsappUs')}
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
