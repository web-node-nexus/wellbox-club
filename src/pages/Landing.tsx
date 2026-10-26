import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Users, Wallet, Gem, Shield, TrendingUp, ArrowRight, Star, CheckCircle } from 'lucide-react';

export default function Landing() {
  const features = [
    { icon: Users, title: 'Referral Network', desc: 'Build your team and earn commissions at multiple levels' },
    { icon: Wallet, title: 'Dual Wallet System', desc: 'Separate wallets for commissions and contributions with flexible access' },
    { icon: Gem, title: 'Digital Gold Showroom', desc: 'Browse and purchase gold directly from manufacturer at best prices' },
    { icon: Crown, title: 'Leader Benefits', desc: 'Become a leader with 100+ team members and earn monthly payouts' },
    { icon: Shield, title: 'Secure & Transparent', desc: 'Every transaction recorded in immutable ledger for full transparency' },
    { icon: TrendingUp, title: 'Grow Your Wealth', desc: '12-month gold savings plan with withdrawal or gold conversion options' },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Members' },
    { value: '₹5Cr+', label: 'Gold Sold' },
    { value: '500+', label: 'Leaders' },
    { value: '₹2Cr+', label: 'Commissions Paid' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Jwellbox Club</h1>
              <p className="text-xs text-amber-600">Gold Investment Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-200">
              Join Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/50 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
              <Star className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Get gold at very cheap price - directly from the manufacturer</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Invest in Gold,
              <span className="bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent"> Build Wealth</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join India's fastest growing gold investment club. Earn commissions, build your team, and access premium gold designs at manufacturer prices.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-2xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl shadow-amber-200 flex items-center justify-center gap-2">
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-amber-300 hover:text-amber-700 transition-all flex items-center justify-center gap-2">
                Member Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-amber-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl lg:text-4xl font-bold text-amber-600">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Jwellbox Club?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A complete ecosystem for gold investment, team building, and wealth creation</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Simple steps to start earning with Jwellbox Club</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Join', desc: 'Register with a referral code or create your account' },
              { step: '02', title: 'Contribute', desc: 'Make monthly contributions to build your gold savings' },
              { step: '03', title: 'Refer', desc: 'Share your code and build your team network' },
              { step: '04', title: 'Earn', desc: 'Earn commissions at multiple levels + leader bonuses' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
                  <span className="text-xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-amber-900 to-amber-800 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative">
              <h2 className="text-3xl font-bold mb-8">Commission Structure</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <p className="text-4xl font-bold text-yellow-400 mb-2">10%</p>
                  <p className="font-medium">Level 1 Commission</p>
                  <p className="text-sm text-amber-200 mt-2">On direct referral's contribution</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <p className="text-4xl font-bold text-yellow-400 mb-2">5%</p>
                  <p className="font-medium">Level 2 Commission</p>
                  <p className="text-sm text-amber-200 mt-2">On referral of referral's contribution</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <p className="text-4xl font-bold text-yellow-400 mb-2">5%</p>
                  <p className="font-medium">Leader Income</p>
                  <p className="text-sm text-amber-200 mt-2">Monthly on team's total income</p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">3% on gold referral orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Auto leader promotion at 100 members</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">All rates configurable by admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Ready to Start Your Gold Journey?</h2>
          <p className="text-gray-600 mb-8">Join thousands of members already building wealth with Jwellbox Club</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-2xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl shadow-amber-200">
            Join Jwellbox Club Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">Jwellbox Club</span>
            </div>
            <p className="text-sm text-gray-400">© 2024 Jwellbox Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
