import { motion } from 'framer-motion';
import { Crown, Heart, Target, Award, Users, Shield, TrendingUp, Gem } from 'lucide-react';
interface PageProps { onJoinClick: () => void; }

export default function About({ onJoinClick }: PageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-900 text-white pt-24">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full mb-6">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">Our Story</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              About <span className="gradient-text">Jwellbox Club</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Born from a simple idea — make gold affordable, accessible, and rewarding for every Indian family. We connect you directly with manufacturers, cutting out middlemen and passing the savings to you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold font-[var(--font-heading)] mb-6">Our <span className="gradient-text">Mission</span></h2>
            <p className="text-white/80 leading-relaxed mb-6 text-lg">
              Jwellbox Club was founded with a vision to democratize gold ownership in India. We believe every family deserves access to pure gold at fair prices, and every individual deserves the opportunity to build wealth through community.
            </p>
            <p className="text-white/80 leading-relaxed mb-6 text-lg">
              Our platform combines the timeless value of gold with modern technology — creating a unique ecosystem where saving, earning, and growing happen together. From homemakers in small towns to professionals in metros, Jwellbox Club is for everyone.
            </p>
            <p className="text-amber-400 italic font-[var(--font-heading)] text-xl">
              "Hum sirf gold nahi bechte, hum sapne poore karte hain." 💛
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            {[
              { icon: Heart, label: 'Trust', value: '12,000+', color: 'from-pink-500 to-rose-600' },
              { icon: Target, label: 'Cities', value: '200+', color: 'from-blue-500 to-indigo-600' },
              { icon: Award, label: 'Gold Sold', value: '₹5Cr+', color: 'from-amber-500 to-orange-600' },
              { icon: Users, label: 'Leaders', value: '500+', color: 'from-purple-500 to-violet-600' },
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold gradient-text">{item.value}</p>
                <p className="text-sm text-white/60 mt-1">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-bold font-[var(--font-heading)] mb-4">Our <span className="gradient-text">Values</span></h2>
          <p className="text-white/60 text-lg">What drives us every day</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Transparency', desc: 'Every rupee tracked in immutable ledger. No hidden charges, no surprises. Complete visibility into your earnings and investments.' },
            { icon: Heart, title: 'Community', desc: 'We grow together. Every member\'s success is our success. Ek saath, sab saath! Building a stronger India through collective prosperity.' },
            { icon: Award, title: 'Quality', desc: 'Only BIS hallmarked gold. Direct from certified manufacturers. Purity guaranteed with every purchase. Your trust is our priority.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4">
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-amber-400">{item.title}</h3>
              <p className="text-white/70 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-bold font-[var(--font-heading)] mb-4">Our <span className="gradient-text">Journey</span></h2>
          <p className="text-white/60 text-lg">From idea to impact</p>
        </motion.div>
        <div className="space-y-8">
          {[
            { year: '2023', title: 'The Beginning', desc: 'Started with a vision to make gold accessible to every Indian family' },
            { year: '2024', title: 'Rapid Growth', desc: 'Crossed 10,000+ members across 200+ cities in India' },
            { year: '2025', title: 'Future Ready', desc: 'Expanding to more cities and launching new features' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl">
                {item.year}
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold font-[var(--font-heading)] mb-6">Ready to Start Your <span className="gradient-text">Gold Journey</span>?</h2>
          <p className="text-white/70 text-lg mb-8">Join thousands of members already building wealth with Jwellbox Club</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onJoinClick} className="px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-xl rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow">
            Join Our Community ✨
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
