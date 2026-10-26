import { motion } from 'framer-motion';
import { Users, TrendingUp, Crown, Gem, Calculator, Sparkles } from 'lucide-react';
import { useState } from 'react';
import GoldSection from '../components/GoldSection';
interface PageProps { onJoinClick: () => void; }

export default function IncomePlan({ onJoinClick }: PageProps) {
  const [members, setMembers] = useState(30);
  const [contribution, setContribution] = useState(3000);

  const l1 = members * contribution * 0.10;
  const l2 = Math.floor(members * 0.5) * contribution * 0.05;
  const leader = members * contribution * 0.05;
  const goldBonus = Math.floor(members * 0.1) * 50000 * 0.03;
  const total = l1 + l2 + leader + goldBonus;

  return (
    <div className="min-h-screen bg-[#0f0520] text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 premium-bg" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -80, 0],
                rotate: [0, 360],
                opacity: [0.1, 0.5, 0.1],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['💰', '💎', '👑', '💵', '🪙'][i % 5]}
            </motion.div>
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">Multiple Income Streams</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              Income <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              4 powerful ways to earn. Build your team, grow your income, achieve financial freedom!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Commission Details */}
      <GoldSection>
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {[
            { title: 'Level 1 Commission', rate: '10%', desc: 'Earn 10% of every direct referral\'s monthly contribution. If your referral contributes ₹3,000, you earn ₹300 instantly!', icon: Users, color: 'from-green-500 to-emerald-600', example: '20 direct refs × ₹3,000 × 10% = ₹6,000/month', emoji: '👥' },
            { title: 'Level 2 Commission', rate: '5%', desc: 'Earn 5% on contributions made by people your referrals bring in. Multi-level earning with no limits!', icon: TrendingUp, color: 'from-blue-500 to-indigo-600', example: '10 L2 members × ₹3,000 × 5% = ₹1,500/month', emoji: '📈' },
            { title: 'Leader Income', rate: '5%', desc: 'Once you reach 100 team members, earn 5% monthly on your entire team\'s total contribution. Credited on 3rd of every month!', icon: Crown, color: 'from-amber-500 to-orange-600', example: '100 members × ₹3,000 × 5% = ₹15,000/month', emoji: '👑' },
            { title: 'Gold Order Bonus', rate: '3%', desc: 'When your team member purchases gold from showroom, earn 3% of order value. High-value orders = high commissions!', icon: Gem, color: 'from-purple-500 to-pink-600', example: '10 gold orders × ₹50,000 × 3% = ₹15,000', emoji: '💎' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 border border-white/5 hover:border-amber-500/30 transition-all gold-card">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl">{item.emoji}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-3xl font-bold gradient-text">{item.rate}</p>
                </div>
              </div>
              <p className="text-sm text-white/70 mb-3">{item.desc}</p>
              <p className="text-xs text-amber-400 bg-amber-400/10 px-3 py-2 rounded-lg border border-amber-500/20">💡 Example: {item.example}</p>
            </motion.div>
          ))}
        </div>

        {/* Calculator */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-8 border border-amber-500/20 gold-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calculator className="w-6 h-6 text-purple-900" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Income Calculator</h3>
              <p className="text-sm text-white/50">Estimate your potential earnings</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Team Members</span>
                  <span className="text-amber-400 font-bold text-lg">{members}</span>
                </label>
                <input type="range" min={5} max={200} value={members} onChange={e => setMembers(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-yellow-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg" />
              </div>
              <div>
                <label className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Monthly Contribution (₹)</span>
                  <span className="text-amber-400 font-bold text-lg">₹{contribution.toLocaleString()}</span>
                </label>
                <input type="range" min={1000} max={10000} step={500} value={contribution} onChange={e => setContribution(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-yellow-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-6 border border-amber-500/20">
              <p className="text-sm text-white/50 mb-4">Estimated Monthly Earnings</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><span className="text-sm text-white/70">Level 1 (10%)</span><span className="font-bold text-green-400 text-lg">₹{l1.toLocaleString()}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-white/70">Level 2 (5%)</span><span className="font-bold text-blue-400 text-lg">₹{l2.toLocaleString()}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-white/70">Leader (5%)</span><span className="font-bold text-amber-400 text-lg">₹{leader.toLocaleString()}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-white/70">Gold Bonus (3%)</span><span className="font-bold text-purple-400 text-lg">₹{goldBonus.toLocaleString()}</span></div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between items-center"><span className="font-semibold text-lg">Total Monthly</span><span className="text-3xl font-bold gradient-text">₹{total.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </GoldSection>

      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 premium-bg" />
        <div className="relative">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onJoinClick} className="px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-xl rounded-2xl shadow-2xl shadow-amber-500/30 premium-btn">
            Start Earning Today ✨
          </motion.button>
        </div>
      </section>
    </div>
  );
}
