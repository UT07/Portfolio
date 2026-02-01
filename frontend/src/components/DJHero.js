import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';
import djData from '../data/djData.json';
import { resolveAssetUrl } from '../utils/assetUrl';

const DJHero = () => {
  const { hero } = djData;
  const [textSequence, setTextSequence] = useState(0);
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { margin: '-20% 0px -20% 0px', once: true });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setTextSequence(5);
      return;
    }

    const timers = [
      setTimeout(() => setTextSequence(1), 300),    // Badge
      setTimeout(() => setTextSequence(2), 700),    // Headline word by word
      setTimeout(() => setTextSequence(3), 2200),   // Subheadline
      setTimeout(() => setTextSequence(4), 3200),   // Genres
      setTimeout(() => setTextSequence(5), 4000),   // CTAs
    ];

    return () => timers.forEach(clearTimeout);
  }, [isInView, prefersReducedMotion]);

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

  const headlineWords = hero.headline.split(' ');

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Large Hero Image */}
      <div className="absolute inset-0">
        <img 
          src={resolveAssetUrl(hero.hero_image)}
          alt="UT DJ"
          className="w-full h-full object-cover opacity-40"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,26,64,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,94,112,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Neon orbits */}
      <motion.div
        className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full border border-red-500/30 blur-[1px]"
        style={{ boxShadow: '0 0 80px rgba(255,26,64,0.55)' }}
        animate={{ rotate: 360, scale: [1, 1.06, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-48 -right-40 w-[620px] h-[620px] rounded-full border border-red-500/20 blur-[2px]"
        style={{ boxShadow: '0 0 90px rgba(255,26,64,0.45)' }}
        animate={{ rotate: -360, scale: [1, 1.08, 1], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />

      {/* Neon sweep */}
      <motion.div
        className="absolute -inset-20 opacity-30"
        style={{
          background: 'conic-gradient(from 90deg, rgba(255,26,64,0.0), rgba(255,26,64,0.5), rgba(255,26,64,0.0) 60%)'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="max-w-4xl">
          {/* Badge - appears first */}
          {textSequence >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <motion.span 
                className="inline-block px-4 py-2 border border-red-500/50 text-red-400 text-sm font-bold uppercase tracking-widest"
                style={{
                  boxShadow: '0 0 15px rgba(255,26,64,0.3)'
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 25px rgba(255,26,64,0.5)'
                }}
              >
                {hero.badge}
              </motion.span>
            </motion.div>
          )}

          {/* Headline - words appear one by one */}
          {textSequence >= 2 && (
            <div className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white mb-8 font-unbounded leading-none min-h-[200px] md:min-h-[300px]" data-testid="dj-hero-headline">
              {headlineWords.map((word, index) => {
                const isBounce = word.toLowerCase().includes('bounce');
                const bounceAnimation = isBounce && !prefersReducedMotion
                  ? {
                      animate: {
                        y: [0, -18, 6, -10, 0],
                        rotate: [0, -6, 4, -3, 0],
                        scale: [1, 1.08, 0.98, 1.06, 1],
                        skewX: [0, -6, 6, -3, 0],
                        textShadow: [
                          '0 0 0 rgba(255,26,64,0)',
                          '0 0 30px rgba(255,26,64,0.9)',
                          '0 0 10px rgba(255,26,64,0.4)',
                          '0 0 40px rgba(255,26,64,0.95)',
                          '0 0 0 rgba(255,26,64,0)'
                        ]
                      },
                      transition: {
                        duration: 1.2,
                        repeat: Infinity,
                        repeatDelay: 2.2,
                        ease: 'easeInOut'
                      }
                    }
                  : {};
                return (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 40, scale: 0.9, rotateX: -70, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
                    transition={{
                      delay: index * 0.12,
                      type: 'spring',
                      stiffness: 260,
                      damping: 18
                    }}
                    className={`inline-block mr-4 ${isBounce ? 'text-red-500' : ''}`}
                    style={isBounce ? {
                      textShadow: '0 0 30px rgba(255,26,64,0.8)'
                    } : {}}
                  >
                    <motion.span
                      className="inline-block"
                      {...bounceAnimation}
                    >
                      {word}
                    </motion.span>
                  </motion.span>
                );
              })}
            </div>
          )}

          {/* Subheadline */}
          {textSequence >= 3 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-sm md:text-base font-medium tracking-wide text-neutral-300 mb-6 max-w-3xl font-space-mono"
            >
              {hero.subheadline}
            </motion.p>
          )}

          {/* Genres */}
          {textSequence >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <p className="text-xs md:text-sm text-red-400 font-space-mono tracking-wider">
                {hero.genres}
              </p>
            </motion.div>
          )}

          {/* CTAs */}
          {textSequence >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {hero.ctas.map((cta, index) => (
                <motion.button
                  key={cta.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  onClick={() => cta.external ? openExternal(cta.href) : scrollToSection(cta.href)}
                  className="group flex items-center gap-2 px-8 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all duration-200 font-bold uppercase tracking-widest font-space-mono text-sm"
                  style={{
                    boxShadow: '0 0 15px rgba(255,26,64,0.3)'
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: '0 0 25px rgba(255,26,64,0.5)'
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
          )}
        </div>
      </div>
    </section>
  );
};

export default DJHero;
