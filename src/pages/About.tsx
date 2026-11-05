import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Heart, Target, Award, Users, Shield, Sparkles, CheckCircle, FileText, Phone, Lock, X, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import GoldBackground from '../components/GoldBackground';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface PageProps { onJoinClick: () => void; }

type DocItem = {
  id: string;
  title: string;
  subtitle: string;
  file: string;
  emoji: string;
};

const COMPANY_DOCS: DocItem[] = [
  {
    id: 'gst',
    title: 'GST / RC Certificate',
    subtitle: 'Registration certificate',
    file: '/docs/gst-registration-certificate.pdf',
    emoji: '📜',
  },
  {
    id: 'license',
    title: 'Trade License Approval',
    subtitle: 'Official license approval',
    file: '/docs/trade-license-approval.pdf',
    emoji: '✅',
  },
  {
    id: 'udyam',
    title: 'Udyam Registration',
    subtitle: 'MSME / Udyam certificate',
    file: '/docs/udyam-registration.pdf',
    emoji: '🏢',
  },
];

export default function About({ onJoinClick }: PageProps) {
  const { translate } = useLanguage();
  const { getAllUsers, user } = useAuth();
  const [verifyDoc, setVerifyDoc] = useState<DocItem | null>(null);
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const openDocRequest = (doc: DocItem) => {
    setVerifyDoc(doc);
    setError('');
    // Prefill if already logged in as member/leader/admin
    if (user && (user.role === 'member' || user.role === 'leader' || user.role === 'admin' || user.isLeader)) {
      setMobile(user.mobile);
    } else {
      setMobile('');
    }
  };

  const closeVerify = () => {
    setVerifyDoc(null);
    setMobile('');
    setError('');
    setChecking(false);
  };

  const handleVerifyAndOpen = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }

    setChecking(true);

    // Check DB (local registered users)
    const found = getAllUsers().find(u => u.mobile === mobile);
    const allowed =
      !!found &&
      (found.role === 'member' ||
        found.role === 'leader' ||
        found.role === 'admin' ||
        found.isLeader);

    setTimeout(() => {
      setChecking(false);
      if (!found) {
        setError('This number is not registered. Document access denied.');
        return;
      }
      if (!allowed) {
        setError('Only Members & Leaders can open company documents.');
        return;
      }
      if (!verifyDoc) return;

      // Open PDF in new tab only after verification
      window.open(verifyDoc.file, '_blank', 'noopener,noreferrer');
      closeVerify();
    }, 400);
  };
  
  const stats = [
    { icon: Heart, label: translate('about.stats.trust'), value: '12,000+', color: 'from-pink-500 to-rose-600', emoji: '❤️' },
    { icon: Target, label: translate('about.stats.cities'), value: '200+', color: 'from-blue-500 to-indigo-600', emoji: '🎯' },
    { icon: Award, label: translate('about.stats.goldSold'), value: '₹5Cr+', color: 'from-amber-500 to-orange-600', emoji: '🏆' },
    { icon: Users, label: translate('about.stats.leaders'), value: '500+', color: 'from-purple-500 to-violet-600', emoji: '👑' },
  ];

  const values = [
    { icon: Shield, title: translate('about.values.transparency.title'), desc: translate('about.values.transparency.desc'), emoji: '🛡️' },
    { icon: Heart, title: translate('about.values.community.title'), desc: translate('about.values.community.desc'), emoji: '❤️' },
    { icon: Award, title: translate('about.values.quality.title'), desc: translate('about.values.quality.desc'), emoji: '🏆' },
  ];

  const timeline = [
    { year: '2023', title: translate('about.timeline.2023.title'), desc: translate('about.timeline.2023.desc'), emoji: '🚀' },
    { year: '2024', title: translate('about.timeline.2024.title'), desc: translate('about.timeline.2024.desc'), emoji: '📈' },
    { year: '2025', title: translate('about.timeline.2025.title'), desc: translate('about.timeline.2025.desc'), emoji: '✨' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0520] text-white">
      {/* Hero */}
      <section className="relative pt-24 pb-10 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-20 overflow-hidden luxury-bg">
        <GoldBackground intensity="heavy" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2, duration: 1 }}
              className="inline-block mb-8"
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/50 gold-ring">
                <Crown className="w-9 h-9 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-purple-900" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/40 rounded-full mb-8 backdrop-blur-xl"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-lg font-bold text-amber-300">{translate('about.hero.badge')}</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-[var(--font-heading)] mb-6">
              <span className="text-white">{translate('about.hero.title1')} </span>
              <span className="gold-text-shimmer">Jewellbox Club</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              {translate('about.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-14 lg:py-20 max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="card-inner-glow rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                className="text-3xl sm:text-5xl lg:text-6xl mb-4"
              >
                {item.emoji}
              </motion.div>
              <p className="text-2xl sm:text-4xl lg:text-5xl font-bold gold-text-shimmer mb-2">{item.value}</p>
              <p className="text-sm text-white/60 font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="gold-divider" />

      {/* Mission */}
      <section className="py-10 sm:py-14 lg:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[var(--font-heading)] mb-6">
              {translate('about.mission.title1')} <span className="gold-text-shimmer">{translate('about.mission.title2')}</span>
            </h2>
            <p className="text-white/80 leading-relaxed mb-6 text-lg">
              {translate('about.mission.desc1')}
            </p>
            <p className="text-white/80 leading-relaxed mb-6 text-lg">
              {translate('about.mission.desc2')}
            </p>
            
            <div className="flex flex-wrap gap-3 mt-8">
              {[translate('about.mission.badge1'), translate('about.mission.badge2'), translate('about.mission.badge3'), translate('about.mission.badge4')].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="gold-badge"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">{badge}</span>
                </motion.div>
              ))}
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-amber-400 italic font-[var(--font-heading)] text-2xl mt-8 gold-text-shimmer"
            >
              {translate('about.mission.quote')} 💛
            </motion.p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
            {stats.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="card-inner-glow rounded-2xl p-6 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold gold-text-shimmer">{item.value}</p>
                <p className="text-sm text-white/60 mt-1">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Values */}
      <section className="py-10 sm:py-14 lg:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[var(--font-heading)] mb-4">
            {translate('about.values.title1')} <span className="gold-text-shimmer">{translate('about.values.title2')}</span>
          </h2>
          <p className="text-white/60 text-lg">{translate('about.values.subtitle')}</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -15, scale: 1.03 }}
              className="gold-card-premium rounded-2xl sm:rounded-3xl p-5 sm:p-8"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="text-4xl sm:text-6xl lg:text-7xl mb-4 inline-block"
              >
                {item.emoji}
              </motion.div>
              <h3 className="text-3xl font-bold mb-3 gold-text-shimmer">{item.title}</h3>
              <p className="text-white/70 leading-relaxed text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="gold-divider" />

      {/* Journey Timeline */}
      <section className="py-10 sm:py-14 lg:py-20 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[var(--font-heading)] mb-4">
            {translate('about.journey.title1')} <span className="gold-text-shimmer">{translate('about.journey.title2')}</span>
          </h2>
          <p className="text-white/60 text-lg">{translate('about.journey.subtitle')}</p>
        </motion.div>
        
        <div className="space-y-8">
          {timeline.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ x: 15 }}
              className="flex gap-6 items-start"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="flex-shrink-0 w-28 h-28 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center text-5xl font-bold shadow-2xl shadow-amber-500/40 gold-stack"
              >
                {item.emoji}
              </motion.div>
              <div className="flex-1 card-inner-glow rounded-2xl sm:rounded-3xl p-5 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl font-bold gold-text-shimmer">{item.year}</span>
                  <span className="gold-badge text-xs">{translate('about.journey.milestone')}</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/70 text-lg">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="gold-divider" />

      {/* Company Documents — Member / Leader only */}
      <section className="py-10 sm:py-14 lg:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm font-medium mb-4">
            <Lock className="w-4 h-4" />
            Members & Leaders only
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[var(--font-heading)] mb-4">
            Company <span className="gold-text-shimmer">Documents</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            GST, Trade License & Udyam certificates. Opening requires mobile verification — the number must be a registered member/leader.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {COMPANY_DOCS.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-inner-glow rounded-3xl p-6 flex flex-col"
            >
              <div className="text-5xl mb-4">{doc.emoji}</div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">{doc.title}</h3>
              </div>
              <p className="text-sm text-white/50 mb-6 flex-1">{doc.subtitle}</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => openDocRequest(doc)}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-950 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Verify & Open
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-14 lg:py-20 text-center relative overflow-hidden">
        <GoldBackground intensity="medium" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-inner-glow rounded-3xl p-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-[var(--font-heading)] mb-6">
              {translate('about.cta.title1')} <span className="gold-text-shimmer">{translate('about.cta.title2')}</span>?
            </h2>
            <p className="text-white/70 text-base sm:text-lg lg:text-xl mb-10">{translate('about.cta.subtitle')}</p>
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onJoinClick}
              className="btn-gold-premium w-full max-w-sm sm:w-auto mx-auto px-6 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg rounded-xl sm:rounded-2xl"
            >
              {translate('about.cta.button')} ✨
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Mobile verification modal */}
      <AnimatePresence>
        {verifyDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeVerify}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              className="relative w-full max-w-md rounded-3xl border border-amber-500/25 bg-gradient-to-b from-purple-950 to-[#0f0520] p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeVerify}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              <div className="flex items-center gap-3 mb-4 pr-8">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl">
                  {verifyDoc.emoji}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{verifyDoc.title}</h3>
                  <p className="text-xs text-amber-300/80 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Member / Leader verification required
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyAndOpen} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Registered Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-white/40">+91</span>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter mobile number"
                      className="w-full pl-20 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-amber-500/50"
                      required
                      disabled={checking}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-300">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={checking || mobile.length !== 10}
                  className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-950 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {checking ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Checking…
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-5 h-5" />
                      Verify & Open Document
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-white/40">
                  If the number is not in the database, or the role is buyer/individual, the document will not open.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
