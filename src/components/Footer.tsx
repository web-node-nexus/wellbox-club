import { Link } from 'react-router-dom';
import { Crown, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, MessageCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-purple-950 via-[#0f0520] to-black text-white overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-900" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-[var(--font-heading)]">
                  <span className="gradient-text">Jwellbox</span> Club
                </h3>
              </div>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              India's premium gold investment & referral platform. Earn together, grow together, own gold directly from manufacturers.
            </p>
            <p className="text-xs text-amber-400/70 italic">
              "Sone ka sapna, ab hoga poora!" 💛
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {[Facebook, Instagram, Twitter, Youtube, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500/30 transition-all">
                  <Icon className="w-4 h-4 text-white/60 hover:text-amber-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', path: '/' },
                { label: 'How it Works', path: '/how-it-works' },
                { label: 'Income Plan', path: '/income-plan' },
                { label: 'Leader Program', path: '/leader-program' },
                { label: 'Gold Showroom', path: '/gold-showroom-public' },
                { label: 'Why Buy Gold', path: '/why-buy-gold' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-white/60 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">Policies</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'FAQ', path: '/faq' },
                { label: 'Terms & Conditions', path: '/terms' },
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Refund Policy', path: '/refund-policy' },
                { label: 'Contact Us', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-white/60 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-white/80">+91 98765 43210</p>
                  <p className="text-xs text-white/40">Mon-Sat, 10AM-7PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/80">support@jwellbox.club</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white/80">Jaipur, Rajasthan, India</p>
              </li>
            </ul>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-sm hover:bg-green-600/30 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {currentYear} Jwellbox Club. All rights reserved. Made with 💛 in India.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>BIS Hallmarked</span>
            <span>•</span>
            <span>100% Secure</span>
            <span>•</span>
            <span>Direct from Manufacturer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
