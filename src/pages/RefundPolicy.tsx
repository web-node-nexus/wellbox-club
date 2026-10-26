import { motion } from 'framer-motion';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#0f0520] text-white pt-24">
      <section className="relative py-16">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl lg:text-5xl font-bold font-[var(--font-heading)] mb-6">
              Refund & <span className="gradient-text">Withdrawal Policy</span>
            </h1>
            <p className="text-white/50 text-sm">Last updated: January 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 pb-20 max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-8 border border-white/5 space-y-6">
          {[
            { title: '1. Commission Wallet Withdrawals', content: 'Commission wallet balance can be withdrawn at any time. Submit a withdrawal request through the platform. Requests are reviewed and processed by admin within 24-48 hours. Amount is transferred directly to your registered bank account via NEFT/IMPS/UPI.' },
            { title: '2. Contribution Wallet - Lock Period', content: 'Monthly contributions are locked for 12 months from the date of each contribution. During this period, contributions cannot be withdrawn. This lock ensures disciplined gold savings.' },
            { title: '3. After Lock Period - Withdrawal Option', content: 'After the 12-month lock period expires, you can choose to withdraw your contribution amount to your bank account. The withdrawal will be processed within 3-5 business days of request approval.' },
            { title: '4. After Lock Period - Gold Conversion', content: 'Alternatively, after the lock period, you can convert your contribution balance into gold purchase from our showroom. The contribution amount will be adjusted against the gold order value.' },
            { title: '5. No Partial Withdrawals During Lock', content: 'Partial withdrawals from the contribution wallet are not permitted during the 12-month lock period. This policy ensures the integrity of the savings plan.' },
            { title: '6. Cancellation of Membership', content: 'If you wish to cancel your membership, locked contributions will remain locked until their respective 12-month periods expire. Commission wallet balance can be withdrawn before closure.' },
            { title: '7. Processing Fees', content: 'Withdrawal requests may be subject to nominal bank transfer charges as applicable. No platform fees are charged on withdrawals.' },
            { title: '8. Disputed Transactions', content: 'If you notice any discrepancy in your wallet balance or transactions, contact support immediately at support@jwellbox.club. All transactions are recorded in our immutable ledger for verification.' },
            { title: '9. Gold Order Cancellation', content: 'Gold orders placed through the showroom can be cancelled within 24 hours of order confirmation. After 24 hours, orders enter manufacturing process and cannot be cancelled.' },
            { title: '10. Force Majeure', content: 'Delays in processing due to bank holidays, technical issues, or circumstances beyond our control are not subject to penalty. We will process all pending requests at the earliest.' },
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
