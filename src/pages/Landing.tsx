import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Crown, Users, TrendingUp, Gem, Shield, Star, ChevronDown, Sparkles, ArrowRight, CheckCircle, Lock, Unlock, Phone, MessageCircle, Award, Zap, Heart, Target, Scale, Play, TrendingDown, ShoppingCart, Eye, DollarSign } from 'lucide-react';
import { designImages } from '../data/goldImages';
import { useLanguage } from '../context/LanguageContext';

interface LandingProps {
  onJoinClick: (tab?: 'member' | 'leader') => void;
}

// 3D Gold Coin Component
function GoldCoin({ delay = 0, x = 0, y = 0, size = 60 }: { delay?: number; x?: number; y?: number; size?: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0, rotateY: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.8],
        rotateY: [0, 360, 720, 1080],
        y: [0, -50, -100, -150]
      }}
      transition={{ 
        duration: 4,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div 
        className="rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 shadow-2xl shadow-amber-500/50 flex items-center justify-center border-4 border-yellow-400"
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          <div className="text-purple-900 font-bold" style={{ fontSize: size * 0.4 }}>₹</div>
        </div>
      </div>
    </motion.div>
  );
}

// Floating Jewellery Component
function FloatingJewellery({ emoji, delay = 0, x = 0, y = 0 }: { emoji: string; delay?: number; x?: number; y?: number }) {
  return (
    <motion.div
      className="absolute text-4xl md:text-6xl"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, 0],
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.div>
  );
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
    <div ref={ref} className="text-4xl lg:text-5xl font-bold gradient-text">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

export default function Landing({ onJoinClick }: LandingProps) {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [calcMembers, setCalcMembers] = useState(20);
  const [calcContribution, setCalcContribution] = useState(3000);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { translate } = useLanguage();

  const testimonials = [
    { name: 'Rajesh Kumar', city: 'Jaipur', text: 'Jewellbox Club ne meri zindagi badal di! 6 months mein 50 members ki team banayi aur ab leader hoon. Monthly income ₹45,000+ hai!', rating: 5, earning: '₹45,000/mo' },
    { name: 'Priya Sharma', city: 'Delhi', text: 'Digital gold showroom se directly manufacturer se gold mila - bahut kam price mein! Aur referral se extra income. Win-win situation!', rating: 5, earning: '₹28,000/mo' },
    { name: 'Amit Patel', city: 'Mumbai', text: 'Best platform for digital gold investment. Monthly contribution lock karke 12 months baad gold le sakti hoon. Commission bhi milta hai!', rating: 5, earning: '₹62,000/mo' },
  ];

  const incomeL1 = calcMembers * calcContribution * 0.10;
  const incomeL2 = Math.floor(calcMembers * 0.5) * calcContribution * 0.05;
  const leaderIncome = calcMembers * calcContribution * 0.05;
  const totalMonthly = incomeL1 + incomeL2 + leaderIncome;

  return (
    <div className="min-h-screen bg-[#0f0520] text-white overflow-hidden">
      {/* ============ HERO SECTION - DIGITAL GOLD SHOWROOM ============ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Premium Gold Background with Real Gold Images */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-[#1a0a2e] to-amber-950/40" />
          {/* Real Gold Coins Image */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 mix-blend-overlay">
            <img src="https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&q=80" alt="Gold Coins" className="w-full h-full object-cover" />
          </div>
          {/* Real Jewellery Image */}
          <div className="absolute bottom-0 left-0 w-1/2 h-full opacity-20 mix-blend-overlay">
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80" alt="Gold Jewellery" className="w-full h-full object-cover" />
          </div>
        </div>
        
        {/* Animated Gold Particles - More Coins */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gold Coins - More Realistic */}
          <GoldCoin delay={0} x={5} y={15} size={100} />
          <GoldCoin delay={0.5} x={90} y={25} size={80} />
          <GoldCoin delay={1} x={15} y={75} size={90} />
          <GoldCoin delay={1.5} x={80} y={65} size={70} />
          <GoldCoin delay={2} x={50} y={10} size={110} />
          <GoldCoin delay={2.5} x={25} y={85} size={85} />
          <GoldCoin delay={3} x={95} y={45} size={95} />
          <GoldCoin delay={3.5} x={10} y={50} size={75} />
          <GoldCoin delay={4} x={70} y={80} size={100} />
          
          {/* Floating Jewellery Emojis */}
          <FloatingJewellery emoji="💎" delay={0} x={20} y={30} />
          <FloatingJewellery emoji="💍" delay={0.5} x={85} y={20} />
          <FloatingJewellery emoji="👑" delay={1} x={30} y={80} />
          <FloatingJewellery emoji="✨" delay={1.5} x={75} y={75} />
          <FloatingJewellery emoji="🪙" delay={2} x={50} y={15} />
          <FloatingJewellery emoji="📿" delay={2.5} x={65} y={90} />
          <FloatingJewellery emoji="💰" delay={3} x={10} y={55} />
          <FloatingJewellery emoji="🏆" delay={3.5} x={95} y={40} />
        </div>

        {/* Gold Glow Orbs - Enhanced */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-amber-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-yellow-500/15 rounded-full blur-3xl" />

        {/* Hero Content */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/40 rounded-full mb-8 backdrop-blur-xl shadow-2xl shadow-amber-500/20"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-amber-400" />
              </motion.div>
              <span className="text-lg font-bold text-amber-300">{translate('landing.tagline')}</span>
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-amber-400" />
              </motion.div>
            </motion.div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-[var(--font-heading)] leading-tight mb-8">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-white"
                style={{ textShadow: '0 0 40px rgba(255, 215, 0, 0.3)' }}
              >
                {translate('landing.heroTitle1')}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block gradient-text"
                style={{ textShadow: '0 0 60px rgba(255, 215, 0, 0.5)' }}
              >
                {translate('landing.heroTitle2')}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="block text-amber-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-4 font-bold"
              >
                {translate('landing.heroTitle3')}
              </motion.span>
            </h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-xl sm:text-2xl lg:text-3xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed font-medium"
            >
              {translate('landing.heroSubtitle')}
              <br />
              <span className="text-2xl sm:text-3xl">BIS Hallmarked • 850+ Designs • Earn While You Save</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onJoinClick('member')}
                className="w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-purple-900 font-bold text-xl rounded-2xl shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <ShoppingCart className="w-7 h-7" />
                <span className="relative">{translate('navbar.becomeMember')}</span>
                <ArrowRight className="w-7 h-7 relative" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onJoinClick('leader')}
                className="w-full sm:w-auto px-12 py-6 bg-white/10 border-2 border-amber-400/50 text-white font-bold text-xl rounded-2xl hover:bg-amber-500/10 hover:border-amber-400 transition-all flex items-center justify-center gap-3 backdrop-blur-xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Crown className="w-7 h-7 text-amber-400 relative" />
                <span className="relative">{translate('navbar.becomeLeader')}</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all hover:scale-105">
              <AnimatedCounter target={12500} suffix="+" />
              <p className="text-sm text-white/60 mt-2 font-medium">{translate('landing.activeMembers')}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all hover:scale-105">
              <AnimatedCounter target={850} suffix="+" />
              <p className="text-sm text-white/60 mt-2 font-medium">{translate('landing.goldDesigns')}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all hover:scale-105">
              <AnimatedCounter target={2} prefix="₹" suffix="Cr+" />
              <p className="text-sm text-white/60 mt-2 font-medium">{translate('landing.commissionPaid')}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all hover:scale-105">
              <AnimatedCounter target={500} suffix="+" />
              <p className="text-sm text-white/60 mt-2 font-medium">{translate('landing.activeMembers')}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-10 h-10 text-amber-400/50" />
        </motion.div>
      </section>

      {/* ============ DIGITAL GOLD SHOWROOM - MAIN HIGHLIGHT ============ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] via-purple-950/50 to-[#0f0520]" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-5xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -120, 0],
                rotate: [0, 360],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              {['💎', '💍', '👑', '✨', '🪙', '📿'][i % 6]}
            </motion.div>
          ))}
        </div>

        {/* Gold Glow */}
        <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl" />

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
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border-3 border-amber-500/50 rounded-full mb-8 backdrop-blur-xl shadow-2xl shadow-amber-500/30"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Gem className="w-8 h-8 text-amber-400" />
              </motion.div>
              <span className="text-2xl font-bold text-amber-300">Digital Gold Showroom</span>
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-7 h-7 text-amber-400" />
              </motion.div>
            </motion.div>
            
            <h2 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6" style={{ textShadow: '0 0 60px rgba(255, 215, 0, 0.4)' }}>
              <span className="text-white">Buy Gold at</span>
              <br />
              <span className="gradient-text">Wholesale Prices</span>
            </h2>
            
            <p className="text-2xl text-white/80 max-w-3xl mx-auto mb-8 font-medium">
              Directly from manufacturer. <span className="text-amber-400 font-bold">No middlemen. No markup.</span>
              <br />
              <span className="text-3xl font-bold text-amber-400">Get Gold at Very Less Price!</span>
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              {[
                { icon: CheckCircle, text: 'BIS Hallmarked', color: 'text-green-400' },
                { icon: CheckCircle, text: '850+ Designs', color: 'text-blue-400' },
                { icon: CheckCircle, text: '22K & 24K Gold', color: 'text-amber-400' },
                { icon: CheckCircle, text: 'Very Less Price', color: 'text-purple-400' },
                { icon: CheckCircle, text: 'Instant Delivery', color: 'text-pink-400' },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border-2 border-amber-500/30 rounded-full backdrop-blur-xl hover:border-amber-500/50 transition-all"
                >
                  <badge.icon className={`w-6 h-6 ${badge.color}`} />
                  <span className="text-base font-bold text-white">{badge.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Featured Designs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {[
              { name: 'Royal Necklace', weight: '45.5g', purity: '22K', image: designImages['Royal Necklace Set'], category: 'Necklace', price: '₹2,85,000' },
              { name: 'Diamond Ring', weight: '4.8g', purity: '24K', image: designImages['Minimalist Ring'], category: 'Ring', price: '₹30,000' },
              { name: 'Temple Set', weight: '120g', purity: '22K', image: designImages['Temple Jewelry Set'], category: 'Set', price: '₹7,50,000' },
              { name: 'Gold Coin', weight: '10g', purity: '24K', image: designImages['Gold Coin 10g'], category: 'Coins', price: '₹62,500' },
              { name: 'Jhumka Earrings', weight: '18.5g', purity: '22K', image: designImages['Jhumka Earrings'], category: 'Earrings', price: '₹1,16,000' },
              { name: 'Antique Bangles', weight: '28g', purity: '22K', image: designImages['Antique Bangles Pair'], category: 'Bangles', price: '₹1,76,000' },
              { name: 'Bridal Choker', weight: '85g', purity: '22K', image: designImages['Bridal Choker'], category: 'Necklace', price: '₹5,35,000' },
              { name: 'Gold Bar', weight: '50g', purity: '24K', image: designImages['Gold Bar 50g'], category: 'Coins', price: '₹3,12,500' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -15, scale: 1.05 }}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border-2 border-white/10 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer"
              >
                {/* Image Area */}
                <div className="h-56 bg-gradient-to-br from-amber-900/40 via-purple-900/40 to-amber-900/40 flex items-center justify-center relative overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Action buttons on hover */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-1 py-2.5 bg-white/20 backdrop-blur-xl rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-white/30 transition-colors"
                    >
                      <Eye className="w-4 h-4" /> View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-4 h-4" /> Buy
                    </motion.button>
                  </div>
                  
                  {/* Purity Badge */}
                  <div className="absolute top-3 right-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full text-sm font-bold text-purple-900 shadow-lg">
                    {item.purity}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full text-sm font-semibold text-white border-2 border-white/20">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">{item.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-amber-400" />
                      <span className="text-base font-bold text-amber-400">{item.weight}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{item.price}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all relative overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    <span className="relative">Buy Now →</span>
                  </motion.button>
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/gold-showroom-public">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-purple-900 font-bold text-xl rounded-2xl shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 transition-all flex items-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Gem className="w-7 h-7 relative" />
                  <span className="relative">Explore Full Showroom</span>
                  <ArrowRight className="w-7 h-7 relative" />
                </motion.button>
              </Link>
              
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xl rounded-2xl shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all flex items-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <MessageCircle className="w-7 h-7 relative" />
                  <span className="relative">WhatsApp Us</span>
                </motion.button>
              </a>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/60 mt-8 text-lg"
            >
              💡 <span className="text-amber-400 font-bold">Pro Tip:</span> Join as a member and earn 4% commission on every gold order you refer!
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ============ LEADER PROGRAM - HOW TO BECOME LEADER ============ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] via-purple-950/60 to-[#0f0520]" />
        
        {/* Floating Gold Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-5xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                rotate: [0, 360],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 7 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['👑', '💰', '🏆', '💎', '🪙'][i % 5]}
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border-3 border-amber-500/50 rounded-full mb-8 backdrop-blur-xl shadow-2xl shadow-amber-500/30"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-8 h-8 text-amber-400" />
              </motion.div>
              <span className="text-2xl font-bold text-amber-300">Leader Program</span>
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-7 h-7 text-amber-400" />
              </motion.div>
            </motion.div>
            
            <h2 className="text-5xl lg:text-7xl font-bold font-[var(--font-heading)] mb-6" style={{ textShadow: '0 0 60px rgba(255, 215, 0, 0.4)' }}>
              <span className="text-white">Become a</span> <span className="gradient-text">Leader</span>
            </h2>
            <p className="text-2xl text-white/80 max-w-3xl mx-auto font-medium">
              Build your team, unlock premium benefits, and earn monthly leader payouts!
            </p>
          </motion.div>

          {/* Leader Journey - Step by Step */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Step 1: Join as Member */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/10 hover:border-amber-500/30 transition-all group hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-5xl font-bold text-white/10">01</span>
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm font-bold text-blue-400">START HERE</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Join as Member</h3>
              <p className="text-white/70 leading-relaxed mb-4">
                Register with your mobile number. Get your unique referral code. Start building your team!
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-300 font-semibold">
                  ✅ No joining fee<br />
                  ✅ Instant referral code<br />
                  ✅ Start earning immediately
                </p>
              </div>
            </motion.div>

            {/* Step 2: Build Team to 100 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-amber-500/30 hover:border-amber-500/50 transition-all group hover:scale-105 shadow-2xl shadow-amber-500/10"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-5xl font-bold text-amber-400/20">02</span>
                <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-sm font-bold text-amber-400">KEY STEP</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-amber-400">Add 100 Members</h3>
              <p className="text-white/70 leading-relaxed mb-4">
                Build your team to <span className="text-amber-400 font-bold text-xl">100 members</span> (direct + indirect). Once you reach 100, you automatically become a Leader!
              </p>
              <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-4">
                <p className="text-sm text-amber-300 font-bold mb-2">🎯 IMPORTANT:</p>
                <p className="text-sm text-amber-200">
                  You CANNOT become a Leader directly. You must build your team to 100 members first. This ensures only dedicated leaders earn premium benefits!
                </p>
              </div>
            </motion.div>

            {/* Step 3: Earn Leader Income */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-500/30 hover:border-purple-500/50 transition-all group hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-5xl font-bold text-purple-400/20">03</span>
                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm font-bold text-purple-400">REWARD</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-purple-400">Earn Leader Income</h3>
              <p className="text-white/70 leading-relaxed mb-4">
                Once you're a Leader with <span className="text-purple-400 font-bold">10+ direct members</span>, you start earning 5% monthly payout on your team's total income!
              </p>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                <p className="text-sm text-purple-300 font-semibold">
                  💰 5% monthly team income<br />
                  💰 Credited on 3rd of every month<br />
                  💰 Premium leader benefits
                </p>
              </div>
            </motion.div>
          </div>

          {/* Leader Income Rules - Highlighted */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border-2 border-amber-500/30 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Crown className="w-8 h-8 text-purple-900" />
              </div>
              <div>
                <h3 className="text-3xl font-bold">Leader Income Rules</h3>
                <p className="text-white/60">Clear path to premium earnings</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Rule 1 */}
              <div className="bg-white/5 rounded-2xl p-6 border border-amber-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-amber-400">100 Members Required</h4>
                    <p className="text-white/70">
                      You must have <span className="text-amber-400 font-bold text-lg">100 total members</span> (direct + indirect) in your team to become a Leader. No shortcuts!
                    </p>
                  </div>
                </div>
              </div>

              {/* Rule 2 */}
              <div className="bg-white/5 rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-purple-400">10 Direct Members for Income</h4>
                    <p className="text-white/70">
                      Leader income starts only when you have <span className="text-purple-400 font-bold text-lg">10+ direct members</span> under you. Build your direct team first!
                    </p>
                  </div>
                </div>
              </div>

              {/* Rule 3 */}
              <div className="bg-white/5 rounded-2xl p-6 border border-green-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-green-400">Monthly Payout on 3rd</h4>
                    <p className="text-white/70">
                      Leader payout is calculated and credited on the <span className="text-green-400 font-bold">3rd of every month</span> at 10:00 AM automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rule 4 */}
              <div className="bg-white/5 rounded-2xl p-6 border border-blue-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-blue-400">Admin Managed</h4>
                    <p className="text-white/70">
                      All leader promotions and payouts are managed by <span className="text-blue-400 font-bold">Admin Panel</span>. Transparent and secure system!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
              <h4 className="text-xl font-bold mb-4 text-center">Your Journey to Leader</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm font-semibold text-white/70">Start (0 members)</div>
                  <div className="flex-1 bg-white/10 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '10%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-bold text-blue-400">Member</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm font-semibold text-white/70">10 members</div>
                  <div className="flex-1 bg-white/10 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '30%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-bold text-purple-400">Income Starts</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 text-sm font-semibold text-white/70">100 members</div>
                  <div className="flex-1 bg-white/10 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.9 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg shadow-amber-500/50"
                    />
                  </div>
                  <span className="text-sm font-bold text-amber-400">👑 LEADER</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onJoinClick('leader')}
              className="px-12 py-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-purple-900 font-bold text-xl rounded-2xl shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Crown className="w-7 h-7 inline mr-3 relative" />
              <span className="relative">Start Your Leader Journey Now</span>
            </motion.button>
            <p className="text-white/60 mt-4 text-lg">
              Join today and start building your team to become a Leader!
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] via-purple-950/50 to-[#0f0520]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl lg:text-6xl font-bold font-[var(--font-heading)] mt-3 mb-4" style={{ textShadow: '0 0 40px rgba(255, 215, 0, 0.3)' }}>
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-lg text-white/60 max-w-xl mx-auto">Bas 3 simple steps mein shuru karein apna gold journey</p>
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
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 h-full border-2 border-white/10 hover:border-amber-500/30 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-amber-500/10 hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-5 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-6xl font-bold text-white/5 absolute top-6 right-6 font-[var(--font-heading)]">{item.step}</span>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INCOME PLAN + CALCULATOR ============ */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] to-purple-950/30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-bold text-amber-400 uppercase tracking-wider">Multiple Income Streams</span>
            <h2 className="text-4xl lg:text-6xl font-bold font-[var(--font-heading)] mt-3 mb-4" style={{ textShadow: '0 0 40px rgba(255, 215, 0, 0.3)' }}>
              Income <span className="gradient-text">Plan</span>
            </h2>
            <p className="text-lg text-white/60 max-w-xl mx-auto">4 ways to earn - the more you build, the more you make!</p>
          </motion.div>

          {/* Commission Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { title: 'Level 1', rate: '10%', desc: 'Direct referral contribution', icon: Users, gradient: 'from-green-500 to-emerald-600' },
              { title: 'Level 2', rate: '5%', desc: "Referral's referral contribution", icon: TrendingUp, gradient: 'from-blue-500 to-indigo-600' },
              { title: 'Leader Income', rate: '5%', desc: 'Monthly on team total income', icon: Crown, gradient: 'from-amber-500 to-orange-600' },
              { title: 'Gold Bonus', rate: '4%', desc: 'On referred gold orders', icon: Gem, gradient: 'from-purple-500 to-pink-600' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/10 hover:border-amber-500/30 transition-all cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-amber-500/10"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-4xl font-bold gradient-text mb-2">{item.rate}</p>
                <p className="font-bold text-lg text-white mb-1">{item.title}</p>
                <p className="text-sm text-white/50">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Interactive Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border-2 border-amber-500/20 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-purple-900" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Income Calculator</h3>
                <p className="text-sm text-white/50">Estimate your potential monthly earnings</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center justify-between text-sm text-white/70 mb-2">
                    <span>Number of Team Members</span>
                    <span className="text-amber-400 font-bold text-lg">{calcMembers}</span>
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
                    <span className="text-amber-400 font-bold text-lg">₹{calcContribution.toLocaleString()}</span>
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

              <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-6 border-2 border-amber-500/20">
                <p className="text-sm text-white/50 mb-4">Estimated Monthly Income</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Level 1 (10%)</span>
                    <span className="font-bold text-green-400 text-lg">₹{incomeL1.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Level 2 (5%)</span>
                    <span className="font-bold text-blue-400 text-lg">₹{incomeL2.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Leader (5%)</span>
                    <span className="font-bold text-amber-400 text-lg">₹{leaderIncome.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Total Monthly</span>
                      <span className="text-3xl font-bold gradient-text">₹{totalMonthly.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 to-[#0f0520]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-6xl font-bold font-[var(--font-heading)] mb-4" style={{ textShadow: '0 0 40px rgba(255, 215, 0, 0.3)' }}>
              Success <span className="gradient-text">Stories</span>
            </h2>
            <p className="text-lg text-white/60">Real members, real earnings, real gold!</p>
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
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border-2 border-amber-500/20 max-w-3xl mx-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonials[testimonialIdx].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 rounded-full">
                    <span className="text-sm font-bold text-green-400">{testimonials[testimonialIdx].earning}</span>
                  </div>
                </div>
                <p className="text-xl lg:text-2xl text-white/80 leading-relaxed mb-6 italic font-[var(--font-heading)]">
                  "{testimonials[testimonialIdx].text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-purple-900 font-bold text-xl shadow-lg">
                    {testimonials[testimonialIdx].name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{testimonials[testimonialIdx].name}</p>
                    <p className="text-sm text-white/50">{testimonials[testimonialIdx].city}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex items-center justify-center gap-3 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === testimonialIdx ? 'bg-amber-400 w-10' : 'bg-white/20 hover:bg-white/40 w-2.5'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0520] to-purple-950/50" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 lg:p-16 border-2 border-amber-500/30 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
            
            <div className="relative">
              <h2 className="text-4xl lg:text-6xl font-bold font-[var(--font-heading)] mb-6" style={{ textShadow: '0 0 60px rgba(255, 215, 0, 0.4)' }}>
                Ready to Start Your <span className="gradient-text">Gold Journey</span>?
              </h2>
              <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                Join 12,000+ members already building wealth. Ab der kis baat ki? 🚀
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onJoinClick('member')}
                  className="w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold text-xl rounded-2xl shadow-2xl shadow-amber-500/50 hover:shadow-amber-500/70 transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative">Join Now - It's Free ✨</span>
                </motion.button>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-12 py-6 bg-green-600/20 border-2 border-green-500/30 text-green-400 font-bold text-xl rounded-2xl flex items-center justify-center gap-3 hover:bg-green-600/30 transition-colors backdrop-blur-xl"
                >
                  <MessageCircle className="w-6 h-6" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
