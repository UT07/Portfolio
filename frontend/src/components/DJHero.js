import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';
import djData from '../data/djData.json';

const DJHero = () => {
  const { hero } = djData;

  const openExternal = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const scrollToSection = (href) => {
    if (!href.startsWith('http')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Split headline to animate "BOUNCE" separately
  const headlineParts = hero.headline.split('bounce');

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-32 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-950/20 via-black to-cyan-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(217,70,239,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      
      {/* Animated background particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-fuchsia-500/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <motion.span 
              className="inline-block px-4 py-2 border border-fuchsia-500/50 text-fuchsia-400 text-sm font-bold uppercase tracking-widest"
              style={{
                boxShadow: '0 0 15px rgba(217,70,239,0.3)'
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 25px rgba(217,70,239,0.5)'
              }}
            >
              {hero.badge}
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white mb-8 font-unbounded leading-none"
            data-testid="dj-hero-headline"
          >
            {headlineParts[0]}
            <motion.span
              className="inline-block text-fuchsia-500"
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
              }}
              style={{
                textShadow: '0 0 30px rgba(217,70,239,0.6)'
              }}
            >
              bounce
            </motion.span>
            {headlineParts[1]}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-sm md:text-base font-medium tracking-wide text-neutral-400 mb-6 max-w-3xl font-space-mono"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-12"
          >
            <p className="text-xs md:text-sm text-cyan-400 font-space-mono tracking-wider">
              {hero.genres}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            {hero.ctas.map((cta, index) => (
              <motion.button
                key={cta.text}
                onClick={() => cta.external ? openExternal(cta.href) : scrollToSection(cta.href)}
                className="group flex items-center gap-2 px-8 py-3 border border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black transition-all duration-200 font-bold uppercase tracking-widest font-space-mono text-sm"
                style={{
                  boxShadow: '0 0 15px rgba(217,70,239,0.3)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 25px rgba(217,70,239,0.5)'
                }}
                whileTap={{ scale: 0.95 }}
                data-testid={`dj-hero-cta-${cta.text.toLowerCase().replace(' ', '-')}`}
              >
                {cta.text === 'Listen' && <Play className="w-4 h-4" />}
                {cta.text === 'Watch' && <Play className="w-4 h-4" />}
                {cta.text}
                {cta.external && (
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DJHero;
