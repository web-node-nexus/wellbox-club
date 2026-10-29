import { motion } from 'framer-motion';
import { Users, TrendingUp, Crown, Gem, Calculator, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import GoldBackground from '../components/GoldBackground';
interface PageProps { onJoinClick: () => void; }

export default function IncomePlan({ onJoinClick }: PageProps) {
  const [members, setMembers] = useState(30);
  const [contribution, setContribution] = useState(3000);

  const l1 = members * contribution * 0.10;
  const l2 = Math.floor(members * 0.5) * contribution * 0.05;
  const leader = members * contribution * 0.05;
  const goldBonus = Math.floor(members * 0.1) * 50000 * 0.04;
  const total = l1 + l2 + leader + goldBonus;

  const commissions = [
    { title: 'Level 1 Commission', rate: '10%', desc: 'Earn 10% of every direct referral\'s monthly contribution. If your referral contributes ₹3,000, you earn ₹300 instantly!', color: 'from-green-500 to-emerald-600', example: '20 direct refs × ₹3,000 × 10% = ₹6,000/month', emoji: '👥', benefits: ['Instant credit', 'No cap on earnings', 'Lifetime commissions'] },
    { title: 'Level 2 Commission', rate: '5%', desc: 'Earn 5% on contributions made by people your referrals bring in. Multi-level earning with no limits!', color: 'from-blue-500 to-indigo-600', example: '10 L2 members × ₹3,000 × 5% = ₹1,500/month', emoji: '📈', benefits: ['Passive income', 'Network effect', 'Unlimited levels'] },
    { title: 'Leader Income', rate: '5%', desc: 'Once you reach 100 team members, earn 5% monthly on your entire team\'s total contribution. Credited on 3rd of every month!', color: 'from-amber-500 to-orange-600', example: '100 members × ₹3,000 × 5% = ₹15,000/month', emoji: '👑', benefits: ['Monthly payout', 'Auto-qualification', 'Premium benefits'] },
    { title: 'Gold Order Bonus', rate: '4%', desc: 'When your team member purchases gold from showroom, earn 4% of order value. High-value orders = high commissions!', color: 'from-purple-500 to-pink-600', example: '10 gold orders × ₹50,000 × 4% = ₹20,000', emoji: '💎', benefits: ['High-value orders', 'Instant credit', 'No limits'] },
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
                <TrendingUp className="w-16 h-16 text-purple-900" />
              </div>
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              <span className="text-white">Income </span>
              <span className="gold-text-shimmer">Plan</span>
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
              whileHover={{ y: -15, scale: 1.03 }}
              className="gold-card-premium rounded-3xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-xl`}
                >
                  <span className="text-5xl">{item.emoji}</span>
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-5xl font-bold gold-text-shimmer">{item.rate}</p>
                </div>
              </div>
              <p className="text-white/70 mb-4 leading-relaxed">{item.desc}</p>
              <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-4 mb-4">
                <p className="text-sm text-amber-300 font-semibold">💡 Example: {item.example}</p>
              </div>
              <div className="space-y-2">
                {item.benefits.map((benefit, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-sm text-white/70">{benefit}</span>
                  </motion.div>
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
          className="card-inner-glow rounded-3xl p-10"
        >
          <div className="flex items-center gap-4 mb-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl"
            >
              <Calculator className="w-8 h-8 text-purple-900" />
            </motion.div>
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
                  <span className="text-amber-400 font-bold text-3xl gold-text-shimmer">{members}</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={200}
                  value={members}
                  onChange={e => setMembers(Number(e.target.value))}
                  className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-yellow-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm text-white/70 mb-3">
                  <span className="font-semibold">Monthly Contribution (₹)</span>
                  <span className="text-amber-400 font-bold text-3xl gold-text-shimmer">₹{contribution.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={1000}
                  max={10000}
                  step={500}
                  value={contribution}
                  onChange={e => setContribution(Number(e.target.value))}
                  className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-yellow-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-8 border-2 border-amber-500/30">
              <p className="text-sm text-white/50 mb-4 font-semibold">Estimated Monthly Earnings</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Level 1 (10%)</span>
                  <span className="font-bold text-green-400 text-2xl">₹{l1.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Level 2 (5%)</span>
                  <span className="font-bold text-blue-400 text-2xl">₹{l2.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Leader (5%)</span>
                  <span className="font-bold text-amber-400 text-2xl">₹{leader.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Gold Bonus (4%)</span>
                  <span className="font-bold text-purple-400 text-2xl">₹{goldBonus.toLocaleString()}</span>
                </div>
                <div className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-2xl">Total Monthly</span>
                    <span className="text-5xl font-bold gold-text-shimmer">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center relative overflow-hidden">
        <GoldBackground intensity="medium" />
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onJoinClick}
            className="btn-gold-premium px-12 py-6 text-2xl rounded-2xl inline-flex items-center gap-3"
          >
            Start Earning Today
            <ArrowRight className="w-7 h-7" />
          </motion.button>
        </div>
      </section>
    </div>
  );
}
