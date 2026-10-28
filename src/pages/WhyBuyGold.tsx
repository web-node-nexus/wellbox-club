import { motion } from 'framer-motion';
import { TrendingUp, Shield, Award, Heart, Globe, Sparkles } from 'lucide-react';
import GoldBackground from '../components/GoldBackground';
interface PageProps { onJoinClick: () => void; }

export default function WhyBuyGold({ onJoinClick }: PageProps) {
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
                <span className="text-6xl">🪙</span>
              </div>
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              <span className="text-white">Why Buy </span>
              <span className="gold-text-shimmer">Gold</span>
              <span className="text-white">?</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Gold isn't just metal — it's security, tradition, and wealth combined. Here's why smart Indians choose gold.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            { icon: TrendingUp, title: 'Always Appreciates', desc: 'Gold has consistently increased in value over decades. Unlike stocks or crypto, gold never goes to zero. It\'s the ultimate safe-haven asset.', emoji: '📈' },
            { icon: Shield, title: 'Inflation Hedge', desc: 'When prices rise, gold rises too. Your gold savings protect your purchasing power against inflation year after year.', emoji: '🛡️' },
            { icon: Award, title: 'Cultural Value', desc: 'In India, gold is more than investment — it\'s tradition, auspiciousness, and family heritage passed through generations.', emoji: '🏆' },
            { icon: Heart, title: 'Emergency Fund', desc: 'Gold can be liquidated instantly anywhere in India. It\'s the most trusted emergency fund — always accepted, always valued.', emoji: '❤️' },
            { icon: Globe, title: 'Global Currency', desc: 'Gold is recognized worldwide. Unlike paper money, gold has intrinsic value that transcends borders and governments.', emoji: '🌍' },
            { icon: Sparkles, title: 'Tax Benefits', desc: 'Gold investments through systematic plans offer better tax treatment than many other investment options in India.', emoji: '✨' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -15, scale: 1.03 }}
              className="gold-card-premium rounded-3xl p-8"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 border-2 border-amber-500/30"
              >
                <span className="text-5xl">{item.emoji}</span>
              </motion.div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/70 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-inner-glow rounded-3xl p-12 text-center border-2 border-amber-500/30"
        >
          <h3 className="text-4xl font-bold font-[var(--font-heading)] mb-4">
            Why Buy from <span className="gold-text-shimmer">Jewellbox</span>?
          </h3>
          <p className="text-white/70 max-w-2xl mx-auto mb-8 text-lg">
            We connect you directly with manufacturers — no middlemen, no markup. Get BIS hallmarked gold at wholesale prices, plus earn commissions while you save!
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onJoinClick}
            className="btn-gold-premium px-12 py-6 text-2xl rounded-2xl"
          >
            Start Saving in Gold ✨
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
