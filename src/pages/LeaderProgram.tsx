import { motion } from 'framer-motion';
import { Crown, Target, DollarSign, Award, Users, CheckCircle, Sparkles } from 'lucide-react';
import GoldBackground from '../components/GoldBackground';
interface PageProps { onJoinClick: () => void; }

export default function LeaderProgram({ onJoinClick }: PageProps) {
  return (
    <div className="min-h-screen bg-[#0f0520] text-white">
      <section className="relative pt-32 pb-20 overflow-hidden luxury-bg">
        <GoldBackground intensity="heavy" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-40 h-40 mx-auto bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-amber-500/50 pulse-glow"
            >
              <Crown className="w-20 h-20 text-purple-900" />
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              <span className="text-white">Leader </span>
              <span className="gold-text-shimmer">Program</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Build a team of 100+ members and unlock premium Leader benefits. Monthly payouts, exclusive perks, and recognition await!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl font-bold font-[var(--font-heading)] mb-6">
              What Makes a <span className="gold-text-shimmer">Leader</span>?
            </h2>
            <div className="space-y-6">
              {[
                { icon: Target, title: '100 Members Milestone', desc: 'Build your direct + indirect team to 100 members. Auto-promotion triggers instantly!', emoji: '🎯' },
                { icon: DollarSign, title: '5% Monthly Payout', desc: 'Earn 5% of your entire team\'s monthly contribution income. Credited on 3rd of every month.', emoji: '💰' },
                { icon: Award, title: 'Manual Promotion', desc: 'Admin can also manually promote deserving members to Leader status before 100 members.', emoji: '🏆' },
                { icon: Users, title: 'Team Management', desc: 'Access advanced team analytics, performance tracking, and leadership tools.', emoji: '👥' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="card-inner-glow rounded-2xl p-6 flex gap-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-amber-500/30">
                    <span className="text-4xl">{item.emoji}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card-inner-glow rounded-3xl p-8 border-2 border-amber-500/30">
            <h3 className="text-3xl font-bold mb-6 text-center gold-text-shimmer">Leader Benefits</h3>
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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 text-sm p-3 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="text-white/80">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-amber-500/10 rounded-xl border-2 border-amber-500/30">
              <p className="text-sm text-amber-300">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Leader payout is calculated and credited automatically on the <strong>3rd of every month at 10:00 AM</strong> via scheduled cron job.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 text-center relative overflow-hidden">
        <GoldBackground intensity="medium" />
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onJoinClick}
            className="btn-gold-premium px-12 py-6 text-2xl rounded-2xl"
          >
            Apply for Leader Program 👑
          </motion.button>
        </div>
      </section>
    </div>
  );
}
