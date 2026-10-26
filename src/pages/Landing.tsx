import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Crown, Users, DollarSign, TrendingUp, Gem, Shield, Star, ChevronDown, ChevronRight, Play, Sparkles, ArrowRight, CheckCircle, Lock, Unlock, Phone, MessageCircle, Award, Zap, Heart, Target, Scale } from 'lucide-react';

interface LandingProps {
  onJoinClick: () => void;
}

// Animated Counter Component
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="text-3xl lg:text-4xl font-bold gradient-text">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

export default function Landing({ onJoinClick }: LandingProps) {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [calcMembers, setCalcMembers] = useState(20);
  const [calcContribution, setCalcContribution] = useState(3000);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const testimonials = [
    { name: 'Rajesh Kumar', city: 'Jaipur', text: 'Jwellbox Club ne meri zindagi badal di! 6 months mein 50 members ki team banayi aur ab leader hoon. Monthly income ₹45,000+ hai!', rating: 5 },
    { name: 'Priya Sharma', city: 'Delhi', text: 'Best platform for gold savings. Monthly contribution lock karke 12 months baad gold le sakti hoon. Commission bhi milta hai!', rating: 5 },
    { name: 'Amit Patel', city: 'Mumbai', text: 'Gold showroom se directly manufacturer se gold mila - 30% sasta! Aur referral se extra income. Win-win situation!', rating: 5 },
    { name: 'Sunita Devi', city: 'Lucknow', text: 'Ghar baithe kaam karke achhi income ho rahi hai. Team build karna easy hai kyunki product trusted hai. Thank you Jwellbox!', rating: 5 },
    { name: 'Vikram Singh', city: 'Ahmedabad', text: 'Leader banne ka sapna poora hua! 100 members ki team complete ki aur ab monthly payout milta hai. Life changing experience!', rating: 5 },
  ];

  const faqs = [
    { q: 'What is Jwellbox Club?', a: 'Jwellbox Club is India\'s premium gold investment and referral platform where members contribute monthly, earn commissions by building teams, and access gold directly from manufacturers at wholesale prices.' },
    { q: 'How much do I need to invest to join?', a: 'You can start with a minimum monthly contribution of ₹1,000. There is no joining fee. Your contribution is locked for 12 months after which you can withdraw or convert to gold.' },
    { q: 'How does the referral commission work?', a: 'You earn 10% commission on your direct referral\'s contribution (Level 1) and 5% on their referral\'s contribution (Level 2). All commissions are credited to your withdrawable wallet instantly.' },
    { q: 'When can I withdraw my commission?', a: 'Commission wallet balance can be withdrawn anytime! Submit a withdrawal request and it gets processed within 24-48 hours directly to your bank account.' },
    { q: 'What happens to my contribution after 12 months?', a: 'After the 12-month lock period, you have two options: (1) Withdraw the full amount to your bank account, or (2) Convert it into gold purchase from our showroom at manufacturer prices.' },
    { q: 'How do I become a Leader?', a: 'When your total team reaches 100 members (direct + indirect), you automatically become a Leader! Leaders earn an additional 5% monthly payout on their entire team\'s income.' },
    { q: 'Is the gold BIS hallmarked?', a: 'Yes! All gold available in our showroom is BIS hallmarked and comes directly from certified manufacturers. We guarantee purity and quality.' },
    { q: 'What is the gold order commission?', a: 'When a member in your team purchases gold through the showroom, you earn 3% of the order value as commission. This is credited to your commission wallet instantly.' },
    { q: 'Is my money safe?', a: 'Absolutely! Every transaction is recorded in an immutable ledger. Your contribution is locked securely and all commission calculations are automated and transparent.' },
    { q: 'Can I see gold designs before buying?', a: 'Yes! Our digital gold showroom displays all designs with weight in grams, purity (22K/24K), and making charges. You can express interest and our team will arrange viewing.' },
    { q: 'How is the leader payout calculated?', a: 'Leader payout is calculated on the 3rd of every month. It\'s 5% of the total contribution income generated by your team in the previous month. Credited automatically to your wallet.' },
    { q: 'Do I need experience to become a leader?', a: 'No prior experience needed! We provide complete training, marketing materials, and support. Many of our top leaders started as homemakers and students.' },
  ];

  const incomeL1 = calcMembers * calcContribution * 0.10;
  const incomeL2 = Math.floor(calcMembers * 0.5) * calcContribution * 0.05;
  const leaderIncome = calcMembers * calcContribution * 0.05;
  const totalMonthly = incomeL1 + incomeL2 + leaderIncome;

  return (
    <div className="min-h-screen bg-[#0f0520] text-white overflow-hidden">
      {/* ============ HERO SECTION ============ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center mesh-gradient overflow-hidden">
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg opacity-20 blur-sm" />
          <motion.div animate={{ y: [20, -20, 20], rotate: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full opacity-30" />
          <motion.div animate={{ y: [-10, 30, -10], x: [-5, 5, -5] }} transition={{ duration: 7, repeat: Infinity }} className="absolute bottom-40 left-1/4 w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-600 rotate-45 opacity-25" />
          <motion.div animate={{ y: [10, -30, 10] }} transition={{ duration: 9, repeat: Infinity }} className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-10 blur-xl" />
          <motion.div animate={{ y: [-15, 15, -15], rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute bottom-20 right-10 w-6 h-6 border-2 border-amber-400/30 rounded-sm" />
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300">India's #1 Gold Investment Club</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[var(--font-heading)] leading-tight mb-6">
              <span className="text-white">Earn Together.</span>
              <br />
              <span className="gradient-text">Grow Together.</span>
              <br />
              <span className="text-white">Own Gold.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">
              Join thousands of members building wealth through gold savings, team commissions, and direct manufacturer gold access. <span className="text-amber-400 font-medium">Sapna apka, saath humara!</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onJoinClick}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-purple-900 font-bold text-lg rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" /> Become a Member
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onJoinClick()}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 border-2 border-purple-400/30 text-white font-bold text-lg rounded-2xl hover:bg-purple-500/10 hover:border-purple-400/50 transition-all flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5 text-purple-400" /> Become a Leader
              </motion.button>
            </div>
          </motion.div>

          {/* Live Counters */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            <div className="glass rounded-2xl p-4">
              <AnimatedCounter target={12500} suffix="+" />
              <p className="text-xs text-white/50 mt-1">Active Members</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <AnimatedCounter target={850} suffix="+" />
              <p className="text-xs text-white/50 mt-1">Gold Designs</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <AnimatedCounter target={2} prefix="₹" suffix="Cr+" />
              <p className="text-xs text-white/50 mt-1">Commission Paid</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-amber-400/50" />
        </motion.div>
      </section>

      {/* ============ GOLD SHOWROOM - MAIN HIGHLIGHT ============ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Premium background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] via-purple-950/40 to-[#0f0520]" />
        
        {/* Floating gold particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              {['💎', '💍', '👑', '✨', '🪙'][i % 5]}
            </motion.div>
          ))}
        </div>

        {/* Gold glow orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/30 rounded-full mb-6 gold-border"
            >
              <Gem className="w-6 h-6 text-amber-400" />
              <span className="text-lg font-bold text-amber-300">Digital Gold Showroom</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.div>
            
            <h2 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6">
              <span className="text-white">Get Gold at</span>
              <br />
              <span className="gradient-text">Very Cheap Price</span>
            </h2>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-4">
              Directly from the manufacturer. No middlemen. No markup.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
                <CheckCircle className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">BIS Hallmarked</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
                <CheckCircle className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">850+ Designs</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
                <CheckCircle className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">22K & 24K Gold</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
                <CheckCircle className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">30% Cheaper</span>
              </div>
            </div>
          </motion.div>

          {/* Featured Designs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {[
              { name: 'Royal Necklace', weight: '45.5g', purity: '22K', emoji: '📿', category: 'Necklace' },
              { name: 'Diamond Ring', weight: '4.8g', purity: '24K', emoji: '💍', category: 'Ring' },
              { name: 'Temple Set', weight: '120g', purity: '22K', emoji: '👑', category: 'Set' },
              { name: 'Gold Coin', weight: '10g', purity: '24K', emoji: '🪙', category: 'Coins' },
              { name: 'Jhumka Earrings', weight: '18.5g', purity: '22K', emoji: '✨', category: 'Earrings' },
              { name: 'Antique Bangles', weight: '28g', purity: '22K', emoji: '⭕', category: 'Bangles' },
              { name: 'Bridal Choker', weight: '85g', purity: '22K', emoji: '💎', category: 'Necklace' },
              { name: 'Gold Bar', weight: '50g', purity: '24K', emoji: '🏅', category: 'Coins' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group relative glass rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/40 transition-all duration-300 gold-card"
              >
                {/* Image Area */}
                <div className="h-48 bg-gradient-to-br from-amber-900/30 via-purple-900/30 to-amber-900/30 flex items-center justify-center relative overflow-hidden">
                  <motion.span
                    className="text-7xl"
                    whileHover={{ scale: 1.3, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.emoji}
                  </motion.span>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Purity Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full text-xs font-bold text-purple-900 shadow-lg">
                    {item.purity}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-semibold text-white border border-white/20">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-base mb-2 group-hover:text-amber-400 transition-colors">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Scale className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold text-amber-400">{item.weight}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 text-xs font-bold rounded-lg shadow-lg"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/gold-showroom-public">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-purple-900 font-bold text-lg rounded-2xl shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-shadow flex items-center gap-3 premium-btn"
                >
                  <Gem className="w-6 h-6" />
                  Explore Full Showroom
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>
              
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-shadow flex items-center gap-3 premium-btn"
                >
                  <MessageCircle className="w-6 h-6" />
                  WhatsApp Us
                </motion.button>
              </a>
            </div>

            <p className="text-white/50 mt-6 text-sm">
              💡 <span className="text-amber-400 font-semibold">Pro Tip:</span> Join as a member and earn 3% commission on every gold order you refer!
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] via-purple-950/50 to-[#0f0520]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl lg:text-5xl font-bold font-[var(--font-heading)] mt-3 mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">Bas 3 simple steps mein shuru karein apna gold journey</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, step: '01', title: 'Join & Contribute', desc: 'Sign up with a referral code, make your first monthly contribution starting from ₹1,000. Your gold savings begin!', color: 'from-amber-500 to-yellow-600' },
              { icon: TrendingUp, step: '02', title: 'Build Your Team', desc: 'Share your unique referral code. Earn 10% on Level 1 and 5% on Level 2 contributions. Team grows, income grows!', color: 'from-purple-500 to-pink-600' },
              { icon: Gem, step: '03', title: 'Earn & Own Gold', desc: 'Withdraw commissions anytime. After 12 months, convert contributions to gold or withdraw. Access showroom at factory prices!', color: 'from-emerald-500 to-teal-600' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="glass rounded-3xl p-8 h-full border border-white/5 hover:border-amber-500/20 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-amber-500/5">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-5xl font-bold text-white/5 absolute top-6 right-6 font-[var(--font-heading)]">{item.step}</span>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INCOME PLAN + CALCULATOR ============ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] to-purple-950/30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Multiple Income Streams</span>
            <h2 className="text-3xl lg:text-5xl font-bold font-[var(--font-heading)] mt-3 mb-4">
              Income <span className="gradient-text">Plan</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">4 ways to earn - the more you build, the more you make!</p>
          </motion.div>

          {/* Commission Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {[
              { title: 'Level 1', rate: '10%', desc: 'Direct referral contribution', icon: Users, gradient: 'from-green-500 to-emerald-600' },
              { title: 'Level 2', rate: '5%', desc: "Referral's referral contribution", icon: TrendingUp, gradient: 'from-blue-500 to-indigo-600' },
              { title: 'Leader Income', rate: '5%', desc: 'Monthly on team total income', icon: Crown, gradient: 'from-amber-500 to-orange-600' },
              { title: 'Gold Bonus', rate: '3%', desc: 'On referred gold orders', icon: Gem, gradient: 'from-purple-500 to-pink-600' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-amber-500/20 transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold gradient-text mb-1">{item.rate}</p>
                <p className="font-semibold text-white mb-1">{item.title}</p>
                <p className="text-xs text-white/50">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Interactive Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 lg:p-10 border border-amber-500/10"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-900" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Income Calculator</h3>
                <p className="text-sm text-white/50">Estimate your potential monthly earnings</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center justify-between text-sm text-white/70 mb-2">
                    <span>Number of Team Members</span>
                    <span className="text-amber-400 font-bold">{calcMembers}</span>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={200}
                    value={calcMembers}
                    onChange={e => setCalcMembers(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-yellow-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                  />
                </div>
                <div>
                  <label className="flex items-center justify-between text-sm text-white/70 mb-2">
                    <span>Monthly Contribution (₹)</span>
                    <span className="text-amber-400 font-bold">₹{calcContribution.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min={1000}
                    max={10000}
                    step={500}
                    value={calcContribution}
                    onChange={e => setCalcContribution(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-yellow-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-6 border border-amber-500/10">
                <p className="text-sm text-white/50 mb-4">Estimated Monthly Income</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Level 1 (10%)</span>
                    <span className="font-bold text-green-400">₹{incomeL1.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Level 2 (5%)</span>
                    <span className="font-bold text-blue-400">₹{incomeL2.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Leader (5%)</span>
                    <span className="font-bold text-amber-400">₹{leaderIncome.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Monthly</span>
                      <span className="text-2xl font-bold gradient-text">₹{totalMonthly.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ MEMBER vs LEADER ============ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 to-[#0f0520]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold font-[var(--font-heading)] mb-4">
              Member vs <span className="gradient-text">Leader</span>
            </h2>
            <p className="text-white/60">Choose your path to gold prosperity</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Member Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 border border-white/10"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-5">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Member</h3>
              <p className="text-white/50 text-sm mb-6">Start your gold journey</p>
              <ul className="space-y-3">
                {['Monthly gold savings plan', '10% Level 1 commission', '5% Level 2 commission', '3% gold order bonus', 'Withdraw commissions anytime', 'Access to gold showroom', '12-month contribution lock'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={onJoinClick} className="mt-8 w-full py-3 bg-white/5 border border-white/20 rounded-xl font-medium hover:bg-white/10 transition-colors">
                Join as Member
              </button>
            </motion.div>

            {/* Leader Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative glass rounded-3xl p-8 border border-amber-500/20 glow-gold"
            >
              <div className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 text-xs font-bold rounded-full">
                MOST POPULAR
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-5">
                <Crown className="w-7 h-7 text-purple-900" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Leader <span className="text-amber-400">👑</span></h3>
              <p className="text-white/50 text-sm mb-6">100+ team members • Premium benefits</p>
              <ul className="space-y-3">
                {['Everything in Member plan', 'Additional 5% monthly leader payout', 'Auto-promotion at 100 members', 'Priority support & training', 'Exclusive leader events', 'Higher gold order commissions', 'Recognition & certificates'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={onJoinClick} className="mt-8 w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-shadow">
                Apply as Leader
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ LEADER PROGRAM ============ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] via-purple-950/30 to-[#0f0520]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Leader Program</span>
              <h2 className="text-3xl lg:text-4xl font-bold font-[var(--font-heading)] mt-3 mb-4">
                Become a <span className="gradient-text">Leader</span> in 100 Steps
              </h2>
              <p className="text-white/60 mb-6 leading-relaxed">
                Build your team to 100 members and unlock the Leader status! Leaders earn an additional 5% monthly payout on their entire team's contribution income. Payout is credited automatically on the 3rd of every month.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">100 Members Milestone</p>
                    <p className="text-xs text-white/50">Direct + indirect team members count</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">5% Monthly Payout</p>
                    <p className="text-xs text-white/50">On team's total monthly contribution</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Auto-Promotion + Manual</p>
                    <p className="text-xs text-white/50">Automatic at 100 or admin can promote</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 border border-amber-500/10"
            >
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-amber-500/30 pulse-glow"
                >
                  <Crown className="w-10 h-10 text-purple-900" />
                </motion.div>
                <h3 className="text-xl font-bold">Leader Badge</h3>
                <p className="text-sm text-white/50">Your achievement, your pride!</p>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60">Progress to Leader</span>
                  <span className="text-amber-400 font-bold">72/100</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '72%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="h-3 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full shadow-lg shadow-amber-500/30"
                  />
                </div>
                <p className="text-xs text-white/40 mt-2">28 more members to go! 🚀</p>
              </div>

              <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 rounded-xl p-4 border border-amber-500/10">
                <p className="text-xs text-amber-300">💡 Leader payout is calculated and credited on the <strong>3rd of every month at 10:00 AM</strong> via automated cron job.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ GOLD SHOWROOM PREVIEW ============ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] to-purple-950/30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-medium text-amber-400 uppercase tracking-wider">Digital Showroom</span>
            <h2 className="text-3xl lg:text-5xl font-bold font-[var(--font-heading)] mt-3 mb-4">
              Gold <span className="gradient-text">Showroom</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">Get gold at very cheap price - directly from the manufacturer! No middlemen, no markup.</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Royal Necklace Set', weight: '45.5g', purity: '22K', emoji: '📿' },
              { name: 'Antique Bangles', weight: '28g', purity: '22K', emoji: '⭕' },
              { name: 'Diamond Cut Chain', weight: '15.2g', purity: '22K', emoji: '⛓️' },
              { name: 'Temple Jewelry Set', weight: '120g', purity: '22K', emoji: '👑' },
              { name: 'Minimalist Ring', weight: '4.8g', purity: '24K', emoji: '💍' },
              { name: 'Jhumka Earrings', weight: '18.5g', purity: '22K', emoji: '✨' },
              { name: 'Gold Coin 10g', weight: '10g', purity: '24K', emoji: '🪙' },
              { name: 'Bridal Choker', weight: '85g', purity: '22K', emoji: '💎' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5, scale: 1.03 }}
                className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/20 transition-all group cursor-pointer"
              >
                <div className="h-32 bg-gradient-to-br from-amber-900/30 to-purple-900/30 flex items-center justify-center relative overflow-hidden">
                  <span className="text-5xl group-hover:scale-125 transition-transform duration-500">{item.emoji}</span>
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/10 rounded text-[10px] text-amber-300">{item.purity}</div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <p className="text-xs text-amber-400 mt-0.5">{item.weight}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/gold-showroom-public" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
              View All Designs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ WHY JWELLBOX ============ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 to-[#0f0520]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold font-[var(--font-heading)] mb-4">
              Why <span className="gradient-text">Jwellbox</span>?
            </h2>
            <p className="text-white/60">Trust, transparency, and unbeatable value</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: '100% Secure', desc: 'Every transaction in immutable ledger. Your money is safe and transparent.' },
              { icon: Gem, title: 'Direct from Manufacturer', desc: 'No middlemen. Get gold at wholesale prices, BIS hallmarked quality.' },
              { icon: Award, title: 'BIS Hallmarked', desc: 'All gold is certified pure. 22K and 24K options available.' },
              { icon: DollarSign, title: 'Instant Commissions', desc: 'Earn and withdraw commissions anytime. No waiting period.' },
              { icon: Users, title: 'Growing Community', desc: 'Join 12,000+ members across India. Strong support network.' },
              { icon: Heart, title: 'Made for Everyone', desc: 'Students, homemakers, professionals - anyone can join and earn.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/5 hover:border-amber-500/20 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WALLET EXPLAINED ============ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] via-purple-950/30 to-[#0f0520]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold font-[var(--font-heading)] mb-4">
              Dual <span className="gradient-text">Wallet</span> System
            </h2>
            <p className="text-white/60">Two wallets, complete flexibility</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Commission Wallet */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Unlock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Commission Wallet</h3>
                  <p className="text-xs text-green-400">Withdrawable Anytime</p>
                </div>
              </div>
              <div className="space-y-3">
                {['Level 1 & 2 commissions', 'Leader monthly payouts', 'Gold order bonuses', 'Instant withdrawal request', 'Bank transfer in 24-48 hrs'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Contribution Wallet */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 border border-blue-500/20"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Contribution Wallet</h3>
                  <p className="text-xs text-blue-400">12-Month Lock Period</p>
                </div>
              </div>
              {/* Timeline */}
              <div className="relative pl-6 border-l-2 border-blue-500/30 space-y-4">
                <div className="relative">
                  <div className="absolute -left-[25px] w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-300" />
                  <p className="text-sm font-medium">Month 0: Contribute</p>
                  <p className="text-xs text-white/50">Start your monthly savings</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[25px] w-4 h-4 bg-blue-500/50 rounded-full border-2 border-blue-400" />
                  <p className="text-sm font-medium">Month 1-11: Growing</p>
                  <p className="text-xs text-white/50">Amount locked securely</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[25px] w-4 h-4 bg-green-500 rounded-full border-2 border-green-300 pulse-glow" />
                  <p className="text-sm font-medium">Month 12: Unlocked!</p>
                  <p className="text-xs text-white/50">Withdraw OR convert to gold</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] to-purple-950/30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold font-[var(--font-heading)] mb-4">
              Success <span className="gradient-text">Stories</span>
            </h2>
            <p className="text-white/60">Real members, real earnings, real gold!</p>
          </motion.div>

          {/* Testimonial Slider */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="glass rounded-3xl p-8 lg:p-10 border border-amber-500/10 max-w-3xl mx-auto"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonials[testimonialIdx].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-lg lg:text-xl text-white/80 leading-relaxed mb-6 italic font-[var(--font-heading)]">
                  "{testimonials[testimonialIdx].text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-purple-900 font-bold">
                    {testimonials[testimonialIdx].name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonials[testimonialIdx].name}</p>
                    <p className="text-sm text-white/50">{testimonials[testimonialIdx].city}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === testimonialIdx ? 'bg-amber-400 w-8' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 to-[#0f0520]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl font-bold font-[var(--font-heading)] mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-white/60">Everything you need to know about Jwellbox Club</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="glass rounded-2xl border border-white/5 overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-sm lg:text-base pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-amber-400 flex-shrink-0 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-white/60 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-20 lg:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] to-purple-950/50" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10 lg:p-16 border border-amber-500/20 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-3xl lg:text-5xl font-bold font-[var(--font-heading)] mb-4">
                Ready to Start Your <span className="gradient-text">Gold Journey</span>?
              </h2>
              <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
                Join 12,000+ members already building wealth. Ab der kis baat ki? 🚀
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onJoinClick}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-lg rounded-2xl shadow-2xl shadow-amber-500/30"
                >
                  Join Now - It's Free ✨
                </motion.button>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-green-600/20 border border-green-500/30 text-green-400 font-bold text-lg rounded-2xl flex items-center justify-center gap-2 hover:bg-green-600/30 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" /> WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
