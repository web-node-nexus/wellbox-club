import { motion } from 'framer-motion';
import { HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Support() {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('success', 'Support ticket submitted!', 'Success');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Support</h1>
        <p className="text-white/50 mt-1">We're here to help</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: Phone, label: 'Call Us', value: '+91 98765 43210', color: 'from-green-500 to-emerald-600' },
          { icon: Mail, label: 'Email', value: 'support@jwellbox.club', color: 'from-blue-500 to-indigo-600' },
          { icon: MessageCircle, label: 'WhatsApp', value: 'Chat Now', color: 'from-emerald-500 to-teal-600' },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-center">
            <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-white/60">{item.label}</p>
            <p className="font-medium mt-1">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Send us a message</h3>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold">Message Sent!</h3>
            <p className="text-white/60 mt-2">We'll get back to you within 24 hours.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Subject</label>
              <input type="text" required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Message</label>
              <textarea rows={5} required className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50 resize-none" placeholder="Describe your issue..." />
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}
