import { motion } from 'framer-motion';

interface GoldBackgroundProps {
  intensity?: 'light' | 'medium' | 'heavy';
  showCoins?: boolean;
  showParticles?: boolean;
}

export default function GoldBackground({ intensity = 'medium', showCoins = true, showParticles = true }: GoldBackgroundProps) {
  const coinCount = intensity === 'light' ? 5 : intensity === 'medium' ? 12 : 20;
  const particleCount = intensity === 'light' ? 10 : intensity === 'medium' ? 25 : 40;

  const coins = Array.from({ length: coinCount }, (_, i) => ({
    id: i,
    emoji: ['🪙', '💰', '💎', '💍', '👑', '✨', '📿', '🏆'][i % 8],
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 30 + Math.random() * 40,
    duration: 8 + Math.random() * 6,
    delay: Math.random() * 3,
  }));

  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 10 + Math.random() * 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gold Glow Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl" />

      {/* Gold Particles */}
      {showParticles && particles.map(particle => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute rounded-full bg-gradient-to-br from-yellow-400 to-amber-600"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [100, -100],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Floating Gold Coins & Jewellery */}
      {showCoins && coins.map(coin => (
        <motion.div
          key={`coin-${coin.id}`}
          className="absolute"
          style={{
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            fontSize: coin.size,
          }}
          animate={{
            y: [0, -80, 0],
            rotate: [0, 360],
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: coin.duration,
            delay: coin.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {coin.emoji}
        </motion.div>
      ))}

      {/* Shimmer Overlay */}
      <div className="absolute inset-0 shimmer-wave opacity-20" />
    </div>
  );
}
