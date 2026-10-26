import { motion } from 'framer-motion';
import { Users, TrendingUp, Gem, Wallet, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
interface PageProps { onJoinClick: () => void; }

export default function HowItWorks({ onJoinClick }: PageProps) {
  const steps = [
    { icon: Users, title: 'Sign Up & Get Your Code', desc: 'Register as a member with your mobile number. Get your unique referral code instantly. Share it with friends and family to start building your team.', color: 'from-blue-500 to-indigo-600' },
    { icon: Wallet, title: 'Make Monthly Contributions', desc: 'Start saving for gold with monthly contributions from ₹1,000. Your money is securely locked for 12 months — building your gold fund while you earn.', color: 'from-green-500 to-emerald-600' },
    { icon: TrendingUp, title: 'Earn Commissions', desc: 'Earn 10% on direct referrals (Level 1) and 5% on their referrals (Level 2). Commissions are credited instantly to your withdrawable wallet.', color: 'from-amber-500 to-orange-600' },
    { icon: Gem, title: 'Access Gold Showroom', desc: 'Browse 850+ gold designs at manufacturer prices. Express interest, get a call, and purchase BIS hallmarked gold. Plus earn 3% commission on referred orders!', color: 'from-purple-500 to-pink-600' },
    { icon: Shield, title: 'Withdraw or Convert', desc: 'Withdraw commissions anytime. After 12 months, unlock your contribution — withdraw to bank OR convert to gold purchase. Complete flexibility!', color: 'from-teal-500 to-cyan-600' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0520] text-white pt-24">
      <section className="relative py-20">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Simple Process</span>
            <h1 className="text-4xl lg:text-6xl font-bold font-[var(--font-heading)] mt-3 mb-6">
              How <span className="gradient-text">It Works</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              5 simple steps to start your gold investment journey. Bas itna karna hai! 🚀
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 max-w-4xl mx-auto px-4">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-purple-500 to-emerald-500 hidden md:block" />
          
          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className={`hidden md:flex w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl items-center justify-center flex-shrink-0 shadow-lg z-10`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="glass rounded-2xl p-6 flex-1 border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded">STEP {i + 1}</span>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-white/60 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <Link to="/income-plan" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors mr-4">
          View Income Plan <ArrowRight className="w-4 h-4" />
        </Link>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onJoinClick} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-lg rounded-2xl shadow-2xl shadow-amber-500/30">
          Get Started Now ✨
        </motion.button>
      </section>
    </div>
  );
}
