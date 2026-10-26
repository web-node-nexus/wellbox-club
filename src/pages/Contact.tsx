import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); };

  return (
    <div className="min-h-screen bg-[#0f0520] text-white pt-24">
      <section className="relative py-20">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-6xl font-bold font-[var(--font-heading)] mb-6">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-lg text-white/60">We'd love to hear from you. Reach out anytime!</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 pb-20 max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-4 mb-8">
              {[
                { icon: Phone, label: 'Phone', value: '+91 98765 43210', sub: 'Mon-Sat, 10AM-7PM' },
                { icon: Mail, label: 'Email', value: 'support@jwellbox.club', sub: 'We reply within 24 hours' },
                { icon: MapPin, label: 'Address', value: 'Jaipur, Rajasthan, India', sub: 'Head Office' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 glass rounded-xl border border-white/5">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                    <p className="text-xs text-white/50">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600/20 border border-green-500/30 rounded-xl text-green-400 font-medium hover:bg-green-600/30 transition-colors">
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="glass rounded-2xl p-6 border border-white/5">
              <h2 className="text-xl font-bold mb-4">Send a Message</h2>
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold">Message Sent!</h3>
                  <p className="text-sm text-white/60 mt-2">We'll get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Name</label>
                    <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-amber-500/50" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Phone</label>
                    <input type="tel" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-amber-500/50" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Message</label>
                    <textarea rows={4} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-amber-500/50 resize-none" placeholder="How can we help?" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl">Send Message</button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
