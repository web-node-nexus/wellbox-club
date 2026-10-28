import { motion } from 'framer-motion';
import { Users, TrendingUp, Crown, Gem, Calculator, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
interface PageProps { onJoinClick: () => void; }

export default function IncomePlan({ onJoinClick }: PageProps) {
  const [members, setMembers] = useState(30);
  const [contribution, setContribution] = useState(3000);

  const l1 = members * contribution * 0.10;
  const l2 = Math.floor(members * 0.5) * contribution * 0.05;
  const leader = members * contribution * 0.05;
  const goldBonus = Math.floor(members * 0.1) * 50000 * 0.03;
  const total = l1 + l2 + leader + goldBonus;

  const commissions = [
    { title: 'Level 1 Commission', rate: '10%', desc: 'Earn 10% of every direct referral\'s monthly contribution. If your referral contributes ₹3,000, you earn ₹300 instantly!', color: 'from-green-500 to-emerald-600', example: '20 direct refs × ₹3,000 × 10% = ₹6,000/month', emoji: '👥', benefits: ['Instant credit', 'No cap on earnings', 'Lifetime commissions'] },
    { title: 'Level 2 Commission', rate: '5%', desc: 'Earn 5% on contributions made by people your referrals bring in. Multi-level earning with no limits!', color: 'from-blue-500 to-indigo-600', example: '10 L2 members × ₹3,000 × 5% = ₹1,500/month', emoji: '📈', benefits: ['Passive income', 'Network effect', 'Unlimited levels'] },
    { title: 'Leader Income', rate: '5%', desc: 'Once you reach 100 team members, earn 5% monthly on your entire team\'s total contribution. Credited on 3rd of every month!', color: 'from-amber-500 to-orange-600', example: '100 members × ₹3,000 × 5% = ₹15,000/month', emoji: '👑', benefits: ['Monthly payout', 'Auto-qualification', 'Premium benefits'] },
    { title: 'Gold Order Bonus', rate: '3%', desc: 'When your team member purchases gold from showroom, earn 3% of order value. High-value orders = high commissions!', color: 'from-purple-500 to-pink-600', example: '10 gold orders × ₹50,000 × 3% = ₹15,000', emoji: '💎', benefits: ['High-value orders', 'Instant credit', 'No limits'] },
  ];

  return (
    <div className="min-h-screen bg-[#0f0520] text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          {/* Real Gold Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-[#1a0a2e] to-amber-950/40" />
          <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-20 mix-blend-overlay">
            <img src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&q=80" alt="Gold Coins" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* More Gold Coins & Jewellery */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-5xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -120, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['💰', '💎', '👑', '💵', '🪙', '💍', '📿', '🏆'][i % 8]}
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
              <span className="text-lg font-bold text-amber-300">Multiple Income Streams</span>
              <Sparkles className="w-6 h-6 text-amber-400" />
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6 text-shadow-gold">
              Income <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              4 powerful ways to earn. Build your team, grow your income, achieve financial freedom!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Commission Cards */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {commissions.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-premium rounded-3xl p-8 border border-white/10 hover:border-amber-500/30 transition-all premium-card-hover"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                  <span className="text-4xl">{item.emoji}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-4xl font-bold gradient-text glow-text">{item.rate}</p>
                </div>
              </div>
              <p className="text-white/70 mb-4 leading-relaxed">{item.desc}</p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
                <p className="text-sm text-amber-300 font-semibold">💡 Example: {item.example}</p>
              </div>
              <div className="space-y-2">
                {item.benefits.map((benefit, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-white/70">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-premium rounded-3xl p-8 lg:p-10 border border-amber-500/20 animated-gradient-border"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Calculator className="w-7 h-7 text-purple-900" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">Income Calculator</h3>
              <p className="text-white/50">Estimate your potential monthly earnings</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm text-white/70 mb-3">
                  <span className="font-semibold">Team Members</span>
                  <span className="text-amber-400 font-bold text-2xl">{members}</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={200}
                  value={members}
                  onChange={e => setMembers(Number(e.target.value))}
                  className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-yellow-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm text-white/70 mb-3">
                  <span className="font-semibold">Monthly Contribution (₹)</span>
                  <span className="text-amber-400 font-bold text-2xl">₹{contribution.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={1000}
                  max={10000}
                  step={500}
                  value={contribution}
                  onChange={e => setContribution(Number(e.target.value))}
                  className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-yellow-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-6 border border-amber-500/20">
              <p className="text-sm text-white/50 mb-4 font-semibold">Estimated Monthly Earnings</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Level 1 (10%)</span>
                  <span className="font-bold text-green-400 text-xl">₹{l1.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Level 2 (5%)</span>
                  <span className="font-bold text-blue-400 text-xl">₹{l2.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Leader (5%)</span>
                  <span className="font-bold text-amber-400 text-xl">₹{leader.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Gold Bonus (3%)</span>
                  <span className="font-bold text-purple-400 text-xl">₹{goldBonus.toLocaleString()}</span>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl">Total Monthly</span>
                    <span className="text-4xl font-bold gradient-text glow-text">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 premium-bg" />
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onJoinClick}
            className="px-12 py-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-2xl rounded-2xl shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-shadow btn-premium inline-flex items-center gap-3"
          >
            Start Earning Today
            <ArrowRight className="w-7 h-7" />
          </motion.button>
        </div>
      </section>
    </div>
  );
}
