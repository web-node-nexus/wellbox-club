import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onJoinClick: () => void;
}

export default function Navbar({ onJoinClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if current route is a protected dashboard route (exact match)
  const protectedRoutes = [
    '/dashboard',
    '/individual-dashboard',
    '/referrals',
    '/commissions',
    '/wallet',
    '/contributions',
    '/gold-showroom',
    '/profile',
    '/team',
    '/orders',
    '/referral',
    '/notifications',
    '/support',
  ];

  const isProtectedRoute = protectedRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/income/') ||
    location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide navbar ONLY if user is logged in (not based on route)
  if (user) return null;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'How it Works', path: '/how-it-works' },
    { label: 'Income Plan', path: '/income-plan' },
    { label: 'Gold Showroom', path: '/gold-showroom-public' },
    { label: 'Leaders', path: '/leader-program' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'glass-dark shadow-2xl shadow-purple-900/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow"
              >
                <Crown className="w-6 h-6 lg:w-7 lg:h-7 text-purple-900" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl lg:text-2xl font-bold font-[var(--font-heading)]">
                  <span className="gradient-text">Jewellbox</span>
                  <span className="text-white ml-1">Club</span>
                </h1>
                <p className="text-[10px] text-amber-300/70 -mt-1 tracking-wider">GOLD • GROW • GLORY</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-amber-400 bg-amber-400/10'
                      : 'text-white/80 hover:text-amber-300 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-amber-300 hover:text-amber-200 transition-colors">
                Sign In
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onJoinClick}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-purple-900 font-semibold text-sm rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow"
              >
                Join Now ✨
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-b from-purple-950 to-purple-900 border-l border-amber-500/20 p-6 overflow-y-auto"
            >
              <div className="pt-16 space-y-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        location.pathname === link.path
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'text-white/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 space-y-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block w-full text-center px-4 py-3 border border-amber-500/30 text-amber-300 rounded-xl font-medium">
                    Sign In
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); onJoinClick(); }}
                    className="block w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 rounded-xl font-semibold text-center"
                  >
                    Join Now ✨
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
