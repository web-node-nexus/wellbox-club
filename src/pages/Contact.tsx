import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import GoldSection from '../components/GoldSection';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); };

  return (
    <div className="min-h-screen bg-[#0f0520] text-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          {/* Real Gold Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-[#1a0a2e] to-amber-950/40" />
          <div className="absolute top-0 left-0 w-full h-full opacity-15 mix-blend-overlay">
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80" alt="Gold Jewellery" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gold Coins & Jewellery */}
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
              {['💰', '💎', '👑', '✨', '🪙', '💍', '📿'][i % 7]}
            </motion.div>
          ))}
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300 font-medium">Get in Touch</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-xl text-white/70">We'd love to hear from you. Reach out anytime!</p>
          </motion.div>
        </div>
      </section>

      <GoldSection>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold font-[var(--font-heading)] mb-6">Get in Touch</h2>
            <div className="space-y-4 mb-8">
              {[
                { icon: Phone, label: 'Phone', value: '+91 98765 43210', sub: 'Mon-Sat, 10AM-7PM', emoji: '📞' },
                { icon: Mail, label: 'Email', value: 'support@jwellbox.club', sub: 'We reply within 24 hours', emoji: '📧' },
                { icon: MapPin, label: 'Address', value: 'Jaipur, Rajasthan, India', sub: 'Head Office', emoji: '📍' },
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ scale: 1.02 }} className="flex items-start gap-4 p-5 glass rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all gold-card">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                    <span className="text-3xl">{item.emoji}</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">{item.label}</p>
                    <p className="font-bold text-lg">{item.value}</p>
                    <p className="text-sm text-white/50">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white font-bold shadow-lg shadow-green-500/30 premium-btn"
            >
              <MessageCircle className="w-6 h-6" />
              Chat on WhatsApp
            </motion.a>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="glass rounded-3xl p-8 border border-amber-500/20 gold-border">
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
                  >
                    <Send className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold">Message Sent!</h3>
                  <p className="text-sm text-white/60 mt-2">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Name</label>
                    <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Phone</label>
                    <input type="tel" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Message</label>
                    <textarea rows={4} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all resize-none" placeholder="How can we help?" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg shadow-amber-500/30 premium-btn"
                  >
                    Send Message ✨
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </GoldSection>
    </div>
  );
}
