import { motion } from 'framer-motion';
import { HelpCircle, Phone, Mail, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Support() {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      showToast('error', 'Please fill all required fields', 'Error');
      return;
    }
    setSubmitted(true);
    showToast('success', 'Support ticket submitted successfully!', 'Success');
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ subject: '', message: '', priority: 'normal' });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Support</h1>
        <p className="text-white/50 mt-1">We're here to help you</p>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: Phone, label: 'Call Us', value: '+91 98765 43210', color: 'from-green-500 to-emerald-600', action: () => window.location.href = 'tel:+919876543210' },
          { icon: Mail, label: 'Email', value: 'support@jewellbox.club', color: 'from-blue-500 to-indigo-600', action: () => window.location.href = 'mailto:support@jewellbox.club' },
          { icon: MessageCircle, label: 'WhatsApp', value: 'Chat Now', color: 'from-emerald-500 to-teal-600', action: () => window.open('https://wa.me/919876543210', '_blank') },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-500 text-center">{item.label}</p>
            <button
              onClick={item.action}
              className="font-medium text-center mt-1 text-gray-900 hover:text-amber-600 transition-colors w-full"
            >
              {item.value}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Support Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h3>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900">Message Sent!</h3>
            <p className="text-gray-600 mt-2">We'll get back to you within 24 hours.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <input
                type="text"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="What do you need help with?"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              >
                <option value="low">Low - General inquiry</option>
                <option value="normal">Normal - Need assistance</option>
                <option value="high">High - Urgent issue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                placeholder="Describe your issue in detail..."
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
            >
              <Send className="w-5 h-5" />
              Send Message
            </motion.button>
          </form>
        )}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {[
            { q: 'How do I withdraw my commission?', a: 'Go to Wallet & Withdraw page, enter amount, select payment method, and submit request. Processed within 24-48 hours.' },
            { q: 'When do I become a Leader?', a: 'When your total team reaches 100 members (direct + indirect), you automatically become a Leader.' },
            { q: 'How is leader payout calculated?', a: 'Leaders earn 5% of their team\'s total monthly contribution income, credited on 3rd of every month.' },
            { q: 'Can I convert my contribution to gold?', a: 'Yes! After 12 months lock period, you can withdraw or convert your contribution to gold purchase.' },
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-gray-50 rounded-xl"
            >
              <p className="font-medium text-gray-900 text-sm">{faq.q}</p>
              <p className="text-sm text-gray-600 mt-1">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
