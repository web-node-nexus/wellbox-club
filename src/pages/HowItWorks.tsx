import { motion } from 'framer-motion';
import { Users, TrendingUp, Gem, Wallet, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import GoldSection from '../components/GoldSection';
interface PageProps { onJoinClick: () => void; }

export default function HowItWorks({ onJoinClick }: PageProps) {
  const steps = [
    { icon: Users, title: 'Sign Up & Get Your Code', desc: 'Register as a member with your mobile number. Get your unique referral code instantly. Share it with friends and family to start building your team.', color: 'from-blue-500 to-indigo-600', emoji: '👥' },
    { icon: Wallet, title: 'Make Monthly Contributions', desc: 'Start saving for gold with monthly contributions from ₹1,000. Your money is securely locked for 12 months — building your gold fund while you earn.', color: 'from-green-500 to-emerald-600', emoji: '💰' },
    { icon: TrendingUp, title: 'Earn Commissions', desc: 'Earn 10% on direct referrals (Level 1) and 5% on their referrals (Level 2). Commissions are credited instantly to your withdrawable wallet.', color: 'from-amber-500 to-orange-600', emoji: '📈' },
    { icon: Gem, title: 'Access Gold Showroom', desc: 'Browse 850+ gold designs at manufacturer prices. Express interest, get a call, and purchase BIS hallmarked gold. Plus earn 3% commission on referred orders!', color: 'from-purple-500 to-pink-600', emoji: '💎' },
    { icon: Shield, title: 'Withdraw or Convert', desc: 'Withdraw commissions anytime. After 12 months, unlock your contribution — withdraw to bank OR convert to gold purchase. Complete flexibility!', color: 'from-teal-500 to-cyan-600', emoji: '🔐' },
  ];

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
                y: [0, -50, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['💰', '💎', '👑', '✨', '🪙'][i % 5]}
            </motion.div>
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">Simple Process</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              How It <span className="gradient-text">Works</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              5 simple steps to start your gold investment journey. Bas itna karna hai! 🚀
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <GoldSection>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-purple-500 to-emerald-500 hidden md:block" />
          
          <div className="space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-6 items-start"
              >
                <div className={`hidden md:flex w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl items-center justify-center flex-shrink-0 shadow-lg z-10 gold-card`}>
                  <span className="text-2xl">{step.emoji}</span>
                </div>
                <div className="glass rounded-2xl p-6 flex-1 border border-white/5 hover:border-amber-500/30 transition-all gold-card">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">STEP {i + 1}</span>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-white/70 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </GoldSection>

      {/* CTA */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 premium-bg" />
        <div className="relative">
          <Link to="/income-plan" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors mr-4">
            View Income Plan <ArrowRight className="w-4 h-4" />
          </Link>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onJoinClick} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-lg rounded-2xl shadow-2xl shadow-amber-500/30 premium-btn">
            Get Started Now ✨
          </motion.button>
        </div>
      </section>
    </div>
  );
}
