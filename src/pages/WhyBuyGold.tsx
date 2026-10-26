import { motion } from 'framer-motion';
import { TrendingUp, Shield, Award, Heart, Globe, Sparkles } from 'lucide-react';
import GoldSection from '../components/GoldSection';
interface PageProps { onJoinClick: () => void; }

export default function WhyBuyGold({ onJoinClick }: PageProps) {
  return (
    <div className="min-h-screen bg-[#0f0520] text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 premium-bg" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
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
                duration: 7 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['💰', '🪙', '✨', '💎', '🏅'][i % 5]}
            </motion.div>
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">Timeless Investment</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              Why Buy <span className="gradient-text">Gold</span>?
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Gold isn't just metal — it's security, tradition, and wealth combined. Here's why smart Indians choose gold.
            </p>
          </motion.div>
        </div>
      </section>

      <GoldSection>
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
              className="glass rounded-2xl p-6 border border-white/5 hover:border-amber-500/30 transition-all gold-card"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
                <span className="text-4xl">{item.emoji}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-white/70 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-10 border border-amber-500/20 text-center gold-border">
          <h3 className="text-3xl font-bold font-[var(--font-heading)] mb-4">Why Buy from <span className="gradient-text">Jwellbox</span>?</h3>
          <p className="text-white/70 max-w-2xl mx-auto mb-8 text-lg">
            We connect you directly with manufacturers — no middlemen, no markup. Get BIS hallmarked gold at wholesale prices, plus earn commissions while you save!
          </p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onJoinClick} className="px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-xl rounded-2xl shadow-2xl shadow-amber-500/30 premium-btn">
            Start Saving in Gold ✨
          </motion.button>
        </motion.div>
      </GoldSection>
    </div>
  );
}
