import { motion } from 'framer-motion';
import { Users, TrendingUp, Crown, Gem, Calculator } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[#0f0520] text-white pt-24">
      <section className="relative py-20">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Multiple Income Streams</span>
            <h1 className="text-4xl lg:text-6xl font-bold font-[var(--font-heading)] mt-3 mb-6">
              Income <span className="gradient-text">Plan</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              4 powerful ways to earn. Build your team, grow your income, achieve financial freedom!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Commission Details */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {[
            { title: 'Level 1 Commission', rate: '10%', desc: 'Earn 10% of every direct referral\'s monthly contribution. If your referral contributes ₹3,000, you earn ₹300 instantly!', icon: Users, color: 'from-green-500 to-emerald-600', example: '20 direct refs × ₹3,000 × 10% = ₹6,000/month' },
            { title: 'Level 2 Commission', rate: '5%', desc: 'Earn 5% on contributions made by people your referrals bring in. Multi-level earning with no limits!', icon: TrendingUp, color: 'from-blue-500 to-indigo-600', example: '10 L2 members × ₹3,000 × 5% = ₹1,500/month' },
            { title: 'Leader Income', rate: '5%', desc: 'Once you reach 100 team members, earn 5% monthly on your entire team\'s total contribution. Credited on 3rd of every month!', icon: Crown, color: 'from-amber-500 to-orange-600', example: '100 members × ₹3,000 × 5% = ₹15,000/month' },
            { title: 'Gold Order Bonus', rate: '3%', desc: 'When your team member purchases gold from showroom, earn 3% of order value. High-value orders = high commissions!', icon: Gem, color: 'from-purple-500 to-pink-600', example: '10 gold orders × ₹50,000 × 3% = ₹15,000' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="text-2xl font-bold gradient-text">{item.rate}</p>
                </div>
              </div>
              <p className="text-sm text-white/60 mb-3">{item.desc}</p>
              <p className="text-xs text-amber-400 bg-amber-400/10 px-3 py-2 rounded-lg">💡 Example: {item.example}</p>
            </motion.div>
          ))}
        </div>

        {/* Calculator */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-8 border border-amber-500/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-purple-900" />
            </div>
            <h3 className="text-xl font-bold">Income Calculator</h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Team Members</span>
                  <span className="text-amber-400 font-bold">{members}</span>
                </label>
                <input type="range" min={5} max={200} value={members} onChange={e => setMembers(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-yellow-600 [&::-webkit-slider-thumb]:rounded-full" />
              </div>
              <div>
                <label className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Monthly Contribution (₹)</span>
                  <span className="text-amber-400 font-bold">₹{contribution.toLocaleString()}</span>
                </label>
                <input type="range" min={1000} max={10000} step={500} value={contribution} onChange={e => setContribution(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-yellow-600 [&::-webkit-slider-thumb]:rounded-full" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-6 border border-amber-500/10">
              <p className="text-sm text-white/50 mb-4">Estimated Monthly Earnings</p>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-white/70">Level 1 (10%)</span><span className="font-bold text-green-400">₹{l1.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-sm text-white/70">Level 2 (5%)</span><span className="font-bold text-blue-400">₹{l2.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-sm text-white/70">Leader (5%)</span><span className="font-bold text-amber-400">₹{leader.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-sm text-white/70">Gold Bonus (3%)</span><span className="font-bold text-purple-400">₹{goldBonus.toLocaleString()}</span></div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between"><span className="font-semibold">Total Monthly</span><span className="text-2xl font-bold gradient-text">₹{total.toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-16 text-center">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onJoinClick} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-lg rounded-2xl shadow-2xl shadow-amber-500/30">
          Start Earning Today ✨
        </motion.button>
      </section>
    </div>
  );
}
