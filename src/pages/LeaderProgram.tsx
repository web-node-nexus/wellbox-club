import { motion } from 'framer-motion';
import { Crown, Target, DollarSign, Award, Users, CheckCircle, Sparkles } from 'lucide-react';
interface PageProps { onJoinClick: () => void; }

export default function LeaderProgram({ onJoinClick }: PageProps) {
  return (
    <div className="min-h-screen bg-[#0f0520] text-white pt-24">
      <section className="relative py-20">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-amber-500/30 pulse-glow">
              <Crown className="w-10 h-10 text-purple-900" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold font-[var(--font-heading)] mb-6">
              Leader <span className="gradient-text">Program</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Build a team of 100+ members and unlock premium Leader benefits. Monthly payouts, exclusive perks, and recognition await!
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold font-[var(--font-heading)] mb-6">What Makes a <span className="gradient-text">Leader</span>?</h2>
            <div className="space-y-4">
              {[
                { icon: Target, title: '100 Members Milestone', desc: 'Build your direct + indirect team to 100 members. Auto-promotion triggers instantly!' },
                { icon: DollarSign, title: '5% Monthly Payout', desc: 'Earn 5% of your entire team\'s monthly contribution income. Credited on 3rd of every month.' },
                { icon: Award, title: 'Manual Promotion', desc: 'Admin can also manually promote deserving members to Leader status before 100 members.' },
                { icon: Users, title: 'Team Management', desc: 'Access advanced team analytics, performance tracking, and leadership tools.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-8 border border-amber-500/20">
            <h3 className="text-xl font-bold mb-6 text-center">Leader Benefits</h3>
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
                <div key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-white/80">{item}</span>
                </div>
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
      </section>

      <section className="py-16 text-center">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onJoinClick} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-lg rounded-2xl shadow-2xl shadow-amber-500/30">
          Apply for Leader Program 👑
        </motion.button>
      </section>
    </div>
  );
}
