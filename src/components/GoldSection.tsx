import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GoldSectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export default function GoldSection({ children, title, subtitle, badge, className = '' }: GoldSectionProps) {
  return (
    <section className={`relative py-20 lg:py-28 overflow-hidden ${className}`}>
      {/* Animated background */}
      <div className="absolute inset-0 premium-bg" />
      
      {/* Floating gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Gold glow orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-sm text-amber-300 font-medium">
              ✨ {badge}
            </span>
          </motion.div>
        )}

        {title && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold font-[var(--font-heading)] mb-4">
              {title.split(' ').map((word, i) => (
                <span key={i}>
                  {i === title.split(' ').length - 1 ? (
                    <span className="gradient-text">{word}</span>
                  ) : (
                    <span className="text-white">{word}</span>
                  )}{' '}
                </span>
              ))}
            </h2>
            {subtitle && (
              <p className="text-lg text-white/60 max-w-2xl mx-auto">{subtitle}</p>
            )}
          </motion.div>
        )}

        {children}
      </div>
    </section>
  );
}
