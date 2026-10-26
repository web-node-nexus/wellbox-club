import { motion } from 'framer-motion';
import { TrendingUp, Shield, Award, Heart, Globe, Sparkles } from 'lucide-react';
interface PageProps { onJoinClick: () => void; }

export default function WhyBuyGold({ onJoinClick }: PageProps) {
  return (
    <div className="min-h-screen bg-[#0f0520] text-white pt-24">
      <section className="relative py-20">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-6xl font-bold font-[var(--font-heading)] mb-6">
              Why Buy <span className="gradient-text">Gold</span>?
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Gold isn't just metal — it's security, tradition, and wealth combined. Here's why smart Indians choose gold.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: TrendingUp, title: 'Always Appreciates', desc: 'Gold has consistently increased in value over decades. Unlike stocks or crypto, gold never goes to zero. It\'s the ultimate safe-haven asset.' },
            { icon: Shield, title: 'Inflation Hedge', desc: 'When prices rise, gold rises too. Your gold savings protect your purchasing power against inflation year after year.' },
            { icon: Award, title: 'Cultural Value', desc: 'In India, gold is more than investment — it\'s tradition, auspiciousness, and family heritage passed through generations.' },
            { icon: Heart, title: 'Emergency Fund', desc: 'Gold can be liquidated instantly anywhere in India. It\'s the most trusted emergency fund — always accepted, always valued.' },
            { icon: Globe, title: 'Global Currency', desc: 'Gold is recognized worldwide. Unlike paper money, gold has intrinsic value that transcends borders and governments.' },
            { icon: Sparkles, title: 'Tax Benefits', desc: 'Gold investments through systematic plans offer better tax treatment than many other investment options in India.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 border border-white/5">
              <item.icon className="w-8 h-8 text-amber-400 mb-3" />
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 glass rounded-3xl p-8 border border-amber-500/20 text-center">
          <h3 className="text-2xl font-bold font-[var(--font-heading)] mb-4">Why Buy from <span className="gradient-text">Jwellbox</span>?</h3>
          <p className="text-white/60 max-w-xl mx-auto mb-6">
            We connect you directly with manufacturers — no middlemen, no markup. Get BIS hallmarked gold at wholesale prices, plus earn commissions while you save!
          </p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onJoinClick} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-2xl shadow-2xl shadow-amber-500/30">
            Start Saving in Gold ✨
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
