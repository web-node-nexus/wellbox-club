import { motion } from 'framer-motion';
import { Crown, Heart, Target, Award, Users, Shield, Sparkles, CheckCircle, TrendingUp, Gem } from 'lucide-react';
import GoldBackground from '../components/GoldBackground';
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
    <div className="min-h-screen bg-[#0f0520] text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden luxury-bg">
        <GoldBackground intensity="heavy" />
        
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2, duration: 1 }}
              className="inline-block mb-8"
            >
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/50 gold-ring">
                <Crown className="w-16 h-16 text-purple-900" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/40 rounded-full mb-8 backdrop-blur-xl"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-lg font-bold text-amber-300">Our Story</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              <span className="text-white">About </span>
              <span className="gold-text-shimmer">Jewellbox Club</span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Born from a simple idea — make gold affordable, accessible, and rewarding for every Indian family. We connect you directly with manufacturers, cutting out middlemen and passing the savings to you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 max-w-6xl mx-auto px-4 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="card-inner-glow rounded-3xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                className="text-6xl mb-4"
              >
                {item.emoji}
              </motion.div>
              <p className="text-5xl font-bold gold-text-shimmer mb-2">{item.value}</p>
              <p className="text-sm text-white/60 font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="gold-divider" />

      {/* Mission */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl font-bold font-[var(--font-heading)] mb-6">
              Our <span className="gold-text-shimmer">Mission</span>
            </h2>
            <p className="text-white/80 leading-relaxed mb-6 text-lg">
              Jewellbox Club was founded with a vision to democratize gold ownership in India. We believe every family deserves access to pure gold at fair prices, and every individual deserves the opportunity to build wealth through community.
            </p>
            <p className="text-white/80 leading-relaxed mb-6 text-lg">
              Our platform combines the timeless value of gold with modern technology — creating a unique ecosystem where saving, earning, and growing happen together.
            </p>
            
            <div className="flex flex-wrap gap-3 mt-8">
              {['BIS Hallmarked', 'Direct from Manufacturer', '100% Transparent', 'Secure Platform'].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="gold-badge"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">{badge}</span>
                </motion.div>
              ))}
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-amber-400 italic font-[var(--font-heading)] text-2xl mt-8 gold-text-shimmer"
            >
              "Hum sirf gold nahi bechte, hum sapne poore karte hain." 💛
            </motion.p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            {stats.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="card-inner-glow rounded-2xl p-6 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold gold-text-shimmer">{item.value}</p>
                <p className="text-sm text-white/60 mt-1">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Values */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-5xl font-bold font-[var(--font-heading)] mb-4">
            Our <span className="gold-text-shimmer">Values</span>
          </h2>
          <p className="text-white/60 text-lg">What drives us every day</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -15, scale: 1.03 }}
              className="gold-card-premium rounded-3xl p-8"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="text-7xl mb-4 inline-block"
              >
                {item.emoji}
              </motion.div>
              <h3 className="text-3xl font-bold mb-3 gold-text-shimmer">{item.title}</h3>
              <p className="text-white/70 leading-relaxed text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="gold-divider" />

      {/* Journey Timeline */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-5xl font-bold font-[var(--font-heading)] mb-4">
            Our <span className="gold-text-shimmer">Journey</span>
          </h2>
          <p className="text-white/60 text-lg">From idea to impact</p>
        </motion.div>
        
        <div className="space-y-8">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ x: 15 }}
              className="flex gap-6 items-start"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="flex-shrink-0 w-28 h-28 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center text-5xl font-bold shadow-2xl shadow-amber-500/40 gold-stack"
              >
                {item.emoji}
              </motion.div>
              <div className="flex-1 card-inner-glow rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl font-bold gold-text-shimmer">{item.year}</span>
                  <span className="gold-badge text-xs">MILESTONE</span>
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
        <GoldBackground intensity="medium" />
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-inner-glow rounded-3xl p-12"
          >
            <h2 className="text-5xl font-bold font-[var(--font-heading)] mb-6">
              Ready to Start Your <span className="gold-text-shimmer">Gold Journey</span>?
            </h2>
            <p className="text-white/70 text-xl mb-10">Join thousands of members already building wealth with Jewellbox Club</p>
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onJoinClick}
              className="btn-gold-premium px-12 py-6 text-2xl rounded-2xl"
            >
              Join Our Community ✨
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
