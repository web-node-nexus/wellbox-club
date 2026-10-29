import { motion } from 'framer-motion';
import { Users, TrendingUp, Gem, Wallet, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import GoldBackground from '../components/GoldBackground';
interface PageProps { onJoinClick: () => void; }

export default function HowItWorks({ onJoinClick }: PageProps) {
  const steps = [
    { icon: Users, title: 'Sign Up & Get Your Code', desc: 'Register as a member with your mobile number. Get your unique referral code instantly. Share it with friends and family to start building your team.', color: 'from-blue-500 to-indigo-600', emoji: '👥' },
    { icon: Wallet, title: 'Make Monthly Contributions', desc: 'Start saving for gold with monthly contributions from ₹1,000. Your money is securely locked for 12 months — building your gold fund while you earn.', color: 'from-green-500 to-emerald-600', emoji: '💰' },
    { icon: TrendingUp, title: 'Earn Commissions', desc: 'Earn 10% on direct referrals (Level 1) and 5% on their referrals (Level 2). Commissions are credited instantly to your withdrawable wallet.', color: 'from-amber-500 to-orange-600', emoji: '📈' },
    { icon: Gem, title: 'Access Gold Showroom', desc: 'Browse 850+ gold designs at manufacturer prices. Express interest, get a call, and purchase BIS hallmarked gold. Plus earn 4% commission on referred orders!', color: 'from-purple-500 to-pink-600', emoji: '💎' },
    { icon: Shield, title: 'Withdraw or Convert', desc: 'Withdraw commissions anytime. After 12 months, unlock your contribution — withdraw to bank OR convert to gold purchase. Complete flexibility!', color: 'from-teal-500 to-cyan-600', emoji: '🔐' },
  ];

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
                <Sparkles className="w-16 h-16 text-purple-900" />
              </div>
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              <span className="text-white">How It </span>
              <span className="gold-text-shimmer">Works</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              5 simple steps to start your gold investment journey. Bas itna karna hai! 🚀
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-purple-500 to-emerald-500 hidden md:block shadow-lg shadow-amber-500/50" />
          
          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-6 items-start"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className={`hidden md:flex w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl items-center justify-center flex-shrink-0 shadow-xl z-10`}
                >
                  <span className="text-3xl">{step.emoji}</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="card-inner-glow rounded-3xl p-8 flex-1"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="gold-badge text-xs">STEP {i + 1}</span>
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-white/70 leading-relaxed text-lg">{step.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      <section className="py-20 text-center relative overflow-hidden">
        <GoldBackground intensity="medium" />
        <div className="relative">
          <Link to="/income-plan" className="inline-flex items-center gap-2 px-6 py-3 card-inner-glow rounded-xl text-sm font-medium mr-4 hover:scale-105 transition-transform">
            View Income Plan <ArrowRight className="w-4 h-4" />
          </Link>
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onJoinClick}
            className="btn-gold-premium px-8 py-4 text-lg rounded-2xl"
          >
            Get Started Now ✨
          </motion.button>
        </div>
      </section>
    </div>
  );
}
