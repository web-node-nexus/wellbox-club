import { motion } from 'framer-motion';
import { Crown, Target, DollarSign, Award, Users, CheckCircle, Sparkles } from 'lucide-react';
import GoldSection from '../components/GoldSection';
interface PageProps { onJoinClick: () => void; }

export default function LeaderProgram({ onJoinClick }: PageProps) {
  return (
    <div className="min-h-screen bg-[#0f0520] text-white">
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
                y: [0, -60, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.7, 0.2],
              }}
              transition={{
                duration: 7 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              👑
            </motion.div>
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/40 pulse-glow"
            >
              <Crown className="w-12 h-12 text-purple-900" />
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              Leader <span className="gradient-text">Program</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Build a team of 100+ members and unlock premium Leader benefits. Monthly payouts, exclusive perks, and recognition await!
            </p>
          </motion.div>
        </div>
      </section>

      <GoldSection>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold font-[var(--font-heading)] mb-6">What Makes a <span className="gradient-text">Leader</span>?</h2>
            <div className="space-y-6">
              {[
                { icon: Target, title: '100 Members Milestone', desc: 'Build your direct + indirect team to 100 members. Auto-promotion triggers instantly!', emoji: '🎯' },
                { icon: DollarSign, title: '5% Monthly Payout', desc: 'Earn 5% of your entire team\'s monthly contribution income. Credited on 3rd of every month.', emoji: '💰' },
                { icon: Award, title: 'Manual Promotion', desc: 'Admin can also manually promote deserving members to Leader status before 100 members.', emoji: '🏆' },
                { icon: Users, title: 'Team Management', desc: 'Access advanced team analytics, performance tracking, and leadership tools.', emoji: '👥' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4 p-4 glass rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all gold-card">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                    <span className="text-3xl">{item.emoji}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-8 border border-amber-500/20 gold-border">
            <h3 className="text-2xl font-bold mb-6 text-center">Leader Benefits</h3>
            <div className="space-y-3">
              {[
                '5% monthly team income payout',
                'Priority customer support',
                'Exclusive leader training sessions',
                'Leadership certificate & badge',
                'Access to leader-only events',
                'Higher gold order commissions',
                'Featured in success stories',
                'Dedicated account manager',
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 text-sm p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="text-white/80">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <p className="text-xs text-amber-300">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Leader payout is calculated and credited automatically on the <strong>3rd of every month at 10:00 AM</strong> via scheduled cron job.
              </p>
            </div>
          </motion.div>
        </div>
      </GoldSection>

      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 premium-bg" />
        <div className="relative">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onJoinClick} className="px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-xl rounded-2xl shadow-2xl shadow-amber-500/30 premium-btn">
            Apply for Leader Program 👑
          </motion.button>
        </div>
      </section>
    </div>
  );
}
