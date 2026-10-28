import { motion } from 'framer-motion';
import { Crown, Heart, Target, Award, Users, Shield, Sparkles, CheckCircle, TrendingUp } from 'lucide-react';
interface PageProps { onJoinClick: () => void; }

export default function About({ onJoinClick }: PageProps) {
  const stats = [
    { icon: Heart, label: 'Trust', value: '12,000+', color: 'from-pink-500 to-rose-600', emoji: '❤️' },
    { icon: Target, label: 'Cities', value: '200+', color: 'from-blue-500 to-indigo-600', emoji: '🎯' },
    { icon: Award, label: 'Gold Sold', value: '₹5Cr+', color: 'from-amber-500 to-orange-600', emoji: '🏆' },
    { icon: Users, label: 'Leaders', value: '500+', color: 'from-purple-500 to-violet-600', emoji: '👑' },
  ];

  const values = [
    { icon: Shield, title: 'Transparency', desc: 'Every rupee tracked in immutable ledger. No hidden charges, no surprises. Complete visibility into your earnings and investments.', emoji: '🛡️' },
    { icon: Heart, title: 'Community', desc: 'We grow together. Every member\'s success is our success. Ek saath, sab saath! Building a stronger India through collective prosperity.', emoji: '❤️' },
    { icon: Award, title: 'Quality', desc: 'Only BIS hallmarked gold. Direct from certified manufacturers. Purity guaranteed with every purchase. Your trust is our priority.', emoji: '🏆' },
  ];

  const timeline = [
    { year: '2023', title: 'The Beginning', desc: 'Started with a vision to make gold accessible to every Indian family', emoji: '🚀' },
    { year: '2024', title: 'Rapid Growth', desc: 'Crossed 10,000+ members across 200+ cities in India', emoji: '📈' },
    { year: '2025', title: 'Future Ready', desc: 'Expanding to more cities and launching new features', emoji: '✨' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-900 text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          {/* Real Gold Background Images */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-[#1a0a2e] to-amber-950/40" />
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 mix-blend-overlay">
            <img src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&q=80" alt="Gold" className="w-full h-full object-cover" />
          </div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          {/* Floating Gold Coins & Jewellery */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -80, 0],
                rotate: [0, 360],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['💎', '👑', '✨', '🪙', '💰', '💍', '📿'][i % 7]}
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
              <Crown className="w-6 h-6 text-amber-400" />
              <span className="text-lg font-bold text-amber-300">Our Story</span>
              <Crown className="w-6 h-6 text-amber-400" />
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6 text-shadow-gold">
              About <span className="gradient-text">Jewellbox Club</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Born from a simple idea — make gold affordable, accessible, and rewarding for every Indian family. We connect you directly with manufacturers, cutting out middlemen and passing the savings to you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-premium border border-white/20 rounded-3xl p-8 text-center premium-card-hover"
            >
              <div className="text-5xl mb-4">{item.emoji}</div>
              <p className="text-4xl font-bold gradient-text glow-text mb-2">{item.value}</p>
              <p className="text-sm text-white/60 font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl font-bold font-[var(--font-heading)] mb-6 text-shadow-gold">
              Our <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-white/80 leading-relaxed mb-6 text-lg">
              Jwellbox Club was founded with a vision to democratize gold ownership in India. We believe every family deserves access to pure gold at fair prices, and every individual deserves the opportunity to build wealth through community.
            </p>
            <p className="text-white/80 leading-relaxed mb-6 text-lg">
              Our platform combines the timeless value of gold with modern technology — creating a unique ecosystem where saving, earning, and growing happen together. From homemakers in small towns to professionals in metros, Jwellbox Club is for everyone.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              {['BIS Hallmarked', 'Direct from Manufacturer', '100% Transparent', 'Secure Platform'].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full backdrop-blur-xl"
                >
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-300">{badge}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-amber-400 italic font-[var(--font-heading)] text-2xl mt-8 glow-text">
              "Hum sirf gold nahi bechte, hum sapne poore karte hain." 💛
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            {stats.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="glass-premium border border-white/20 rounded-2xl p-6 text-center premium-card-hover"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
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
          <h2 className="text-5xl font-bold font-[var(--font-heading)] mb-4 text-shadow-gold">
            Our <span className="gradient-text">Values</span>
          </h2>
          <p className="text-white/60 text-lg">What drives us every day</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-premium border border-white/20 rounded-3xl p-8 premium-card-hover"
            >
              <div className="text-6xl mb-4">{item.emoji}</div>
              <h3 className="text-3xl font-bold mb-3 text-amber-400 glow-text">{item.title}</h3>
              <p className="text-white/70 leading-relaxed text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-5xl font-bold font-[var(--font-heading)] mb-4 text-shadow-gold">
            Our <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-white/60 text-lg">From idea to impact</p>
        </motion.div>
        <div className="space-y-8">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ x: 10 }}
              className="flex gap-6 items-start"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center text-4xl font-bold shadow-2xl shadow-amber-500/30"
              >
                {item.emoji}
              </motion.div>
              <div className="flex-1 glass-premium border border-white/20 rounded-3xl p-8 premium-card-hover">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-bold gradient-text">{item.year}</span>
                  <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs font-bold text-amber-300">MILESTONE</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/70 text-lg">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative max-w-3xl mx-auto px-4">
          <h2 className="text-5xl font-bold font-[var(--font-heading)] mb-6 text-shadow-gold">
            Ready to Start Your <span className="gradient-text">Gold Journey</span>?
          </h2>
          <p className="text-white/70 text-xl mb-10">Join thousands of members already building wealth with Jwellbox Club</p>
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onJoinClick}
            className="px-12 py-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-2xl rounded-2xl shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-shadow btn-premium"
          >
            Join Our Community ✨
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
