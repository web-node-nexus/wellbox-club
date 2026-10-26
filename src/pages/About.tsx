import { motion } from 'framer-motion';
import { Crown, Heart, Target, Award, Users, Shield } from 'lucide-react';

interface PageProps { onJoinClick: () => void; }

export default function About({ onJoinClick }: PageProps) {
  return (
    <div className="min-h-screen bg-[#0f0520] text-white pt-24">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Our Story</span>
            <h1 className="text-4xl lg:text-6xl font-bold font-[var(--font-heading)] mt-3 mb-6">
              About <span className="gradient-text">Jwellbox Club</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Born from a simple idea — make gold affordable, accessible, and rewarding for every Indian family. We connect you directly with manufacturers, cutting out middlemen and passing the savings to you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold font-[var(--font-heading)] mb-4">Our <span className="gradient-text">Mission</span></h2>
            <p className="text-white/60 leading-relaxed mb-4">
              Jwellbox Club was founded with a vision to democratize gold ownership in India. We believe every family deserves access to pure gold at fair prices, and every individual deserves the opportunity to build wealth through community.
            </p>
            <p className="text-white/60 leading-relaxed mb-4">
              Our platform combines the timeless value of gold with modern technology — creating a unique ecosystem where saving, earning, and growing happen together. From homemakers in small towns to professionals in metros, Jwellbox Club is for everyone.
            </p>
            <p className="text-amber-400 italic font-[var(--font-heading)]">
              "Hum sirf gold nahi bechte, hum sapne poore karte hain." 💛
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            {[
              { icon: Heart, label: 'Trust', value: '12,000+' },
              { icon: Target, label: 'Cities', value: '200+' },
              { icon: Award, label: 'Gold Sold', value: '₹5Cr+' },
              { icon: Users, label: 'Leaders', value: '500+' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center border border-white/5">
                <item.icon className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold gradient-text">{item.value}</p>
                <p className="text-xs text-white/50">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold font-[var(--font-heading)] text-center mb-12">Our <span className="gradient-text">Values</span></h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { title: 'Transparency', desc: 'Every rupee tracked in immutable ledger. No hidden charges, no surprises.' },
            { title: 'Community', desc: 'We grow together. Every member\'s success is our success. Ek saath, sab saath!' },
            { title: 'Quality', desc: 'Only BIS hallmarked gold. Direct from certified manufacturers. Purity guaranteed.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-xl font-bold mb-3 text-amber-400">{item.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onJoinClick} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-lg rounded-2xl shadow-2xl shadow-amber-500/30">
          Join Our Community ✨
        </motion.button>
      </section>
    </div>
  );
}
