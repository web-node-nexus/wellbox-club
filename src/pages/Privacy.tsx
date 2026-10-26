import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0f0520] text-white pt-24">
      <section className="relative py-16">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold font-[var(--font-heading)] mb-6">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-white/50 text-sm">Last updated: January 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 pb-20 max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-8 border border-white/5 space-y-6">
          {[
            { title: '1. Information We Collect', content: 'We collect personal information you provide during registration: name, mobile number, email, city, and referral code. We also collect transaction data, wallet balances, and usage analytics.' },
            { title: '2. How We Use Your Information', content: 'Your information is used to: process transactions, calculate commissions, manage your wallet, communicate updates, improve our platform, and comply with legal requirements.' },
            { title: '3. Data Security', content: 'We implement industry-standard security measures including encryption, secure servers, and access controls. All financial transactions are recorded in an immutable ledger for transparency.' },
            { title: '4. Data Sharing', content: 'We do not sell your personal data. We may share information with: payment processors (for withdrawals), gold manufacturers (for orders), and regulatory authorities (when required by law).' },
            { title: '5. Cookies & Tracking', content: 'We use cookies and analytics tools to improve user experience. You can control cookie preferences through your browser settings.' },
            { title: '6. Your Rights', content: 'You have the right to: access your data, correct inaccurate information, request data deletion, and opt-out of marketing communications. Contact us to exercise these rights.' },
            { title: '7. Data Retention', content: 'We retain your data for as long as your account is active. After account closure, transaction records are kept for 7 years as required by law.' },
            { title: '8. Children\'s Privacy', content: 'Our platform is not intended for users under 18. We do not knowingly collect data from minors.' },
            { title: '9. Changes to Policy', content: 'We may update this policy periodically. Significant changes will be notified via email or platform notification.' },
            { title: '10. Contact', content: 'For privacy concerns, contact our Data Protection Officer at privacy@jwellbox.club.' },
          ].map((section, i) => (
            <div key={i}>
              <h3 className="text-lg font-bold text-amber-400 mb-2">{section.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
