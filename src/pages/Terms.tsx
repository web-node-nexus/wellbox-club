import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0f0520] text-white pt-24">
      <section className="relative py-16">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold font-[var(--font-heading)] mb-6">
              Terms & <span className="gradient-text">Conditions</span>
            </h1>
            <p className="text-white/50 text-sm">Last updated: January 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 pb-20 max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-8 border border-white/5 space-y-6">
          {[
            { title: '1. Acceptance of Terms', content: 'By registering with Jewellbox Club ("the Platform"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.' },
            { title: '2. Eligibility', content: 'You must be 18 years or older and a resident of India to register. You must provide accurate and complete information during registration.' },
            { title: '3. Membership', content: 'Membership is free. Members can contribute monthly (minimum ₹1,000) and earn commissions through the referral system. All contributions are locked for 12 months from the date of contribution.' },
            { title: '4. Commission Structure', content: 'Level 1 Commission: 10% of direct referral\'s contribution. Level 2 Commission: 5% of referral-of-referral\'s contribution. Leader Commission: 5% of team\'s total monthly income (for members with 100+ team). Gold Order Commission: 3% of referred gold order value. All percentages are configurable and subject to change with notice.' },
            { title: '5. Wallet & Withdrawals', content: 'Commission Wallet: Withdrawable anytime upon admin approval (processed within 24-48 hours). Contribution Wallet: Locked for 12 months. After unlock, members can withdraw or convert to gold.' },
            { title: '6. Leader Program', content: 'Members with 100+ team members automatically become Leaders. Admin may also manually promote members. Leader payouts are credited on the 3rd of every month.' },
            { title: '7. Gold Showroom', content: 'Gold designs are displayed with weight in grams (no price shown). All gold is BIS hallmarked. Orders are processed through manufacturer direct channel.' },
            { title: '8. Prohibited Activities', content: 'Fake accounts, manipulation of referral system, misrepresentation, and any illegal activity will result in immediate termination.' },
            { title: '9. Limitation of Liability', content: 'Jwellbox Club is not responsible for losses due to market fluctuations in gold prices. We facilitate connections and transactions but do not guarantee returns.' },
            { title: '10. Changes to Terms', content: 'We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of modified terms.' },
            { title: '11. Contact', content: 'For questions about these terms, contact us at support@jwellbox.club or +91 98765 43210.' },
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
