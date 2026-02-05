import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';
import { useDJData } from '../contexts/ContentContext';
import { assetUrl } from '../utils/assets';
import placeholderImage from '../assets/asset-placeholder.svg';
import { useMediaQuery } from '../utils/useMediaQuery';

const DJHero = () => {
  const { data: djData } = useDJData();
  const { hero } = djData;
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const reduceAmbient = prefersReducedMotion || isMobile;
  const [replayKey, setReplayKey] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [bouncePlayed, setBouncePlayed] = useState(false);

  const headlineWords = hero.headline.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 220, damping: 18 }
    }
  };

  const bounceOnce = {
    y: [0, -20, 8, -10, 0],
    rotate: [0, -6, 4, -3, 0],
    scale: [1, 1.12, 0.96, 1.06, 1]
  };

  const bounceLoop = {
    y: [0, -20, 8, -10, 0],
    rotate: [0, -6, 4, -3, 0],
    scale: [1, 1.12, 0.96, 1.06, 1]
  };

  const bounceTransitionOnce = {
    duration: 1.2,
    ease: 'easeInOut'
  };

  const bounceTransitionLoop = {
    duration: 1.2,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatDelay: 1.4
  };

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

  const handleHoverStart = () => {
    if (prefersReducedMotion) return;
    setReplayKey((prev) => prev + 1);
    setBouncePlayed(true);
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    if (prefersReducedMotion) return;
    setIsHovered(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Large Hero Image */}
      <div className="absolute inset-0">
        <img
          src={assetUrl(hero.hero_image)}
          alt="UT DJ"
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-40"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onError={(event) => {
            if (event.currentTarget.dataset.fallback === 'true') return;
            event.currentTarget.dataset.fallback = 'true';
            event.currentTarget.src = placeholderImage;
          }}
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
            backgroundImage:
              'linear-gradient(rgba(255,26,64,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,94,112,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
          animate={reduceAmbient ? undefined : { backgroundPosition: ['0px 0px', '60px 60px'] }}
          transition={reduceAmbient ? undefined : { duration: 80, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Neon orbits */}
      <motion.div
        className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full border border-red-500/30 blur-[1px]"
        style={{ boxShadow: '0 0 80px rgba(255,26,64,0.55)' }}
        animate={reduceAmbient ? undefined : { rotate: 360, scale: [1, 1.03, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={reduceAmbient ? undefined : { duration: 80, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-48 -right-40 w-[620px] h-[620px] rounded-full border border-red-500/20 blur-[2px]"
        style={{ boxShadow: '0 0 90px rgba(255,26,64,0.45)' }}
        animate={reduceAmbient ? undefined : { rotate: -360, scale: [1, 1.04, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={reduceAmbient ? undefined : { duration: 90, repeat: Infinity, ease: 'linear' }}
      />

      {/* Neon sweep */}
      <motion.div
        className="absolute -inset-20 opacity-30"
        style={{
          background:
            'conic-gradient(from 90deg, rgba(255,26,64,0.0), rgba(255,26,64,0.5), rgba(255,26,64,0.0) 60%)'
        }}
        animate={reduceAmbient ? undefined : { rotate: 360 }}
        transition={reduceAmbient ? undefined : { duration: 90, repeat: Infinity, ease: 'linear' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="max-w-4xl">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <motion.span
              className="inline-block px-4 py-2 border border-red-500/50 text-red-400 text-sm font-bold uppercase tracking-widest"
              style={{ boxShadow: '0 0 15px rgba(255,26,64,0.3)' }}
            >
              {hero.badge}
            </motion.span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white mb-8 font-unbounded leading-none"
            data-testid="dj-hero-headline"
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
          >
            <motion.span
              key={replayKey}
              variants={prefersReducedMotion ? undefined : containerVariants}
              initial={prefersReducedMotion ? false : 'hidden'}
              animate={prefersReducedMotion ? undefined : 'visible'}
              className="inline-block"
            >
              {headlineWords.map((word, index) => {
                const isBounce = word.toLowerCase().includes('bounce');
                if (prefersReducedMotion) {
                  return (
                    <span key={`${word}-${index}`} className="inline-block mr-4">
                      {word}
                    </span>
                  );
                }

                return (
                  <motion.span
                    key={`${word}-${index}`}
                    variants={wordVariants}
                    className={`inline-block mr-4 ${isBounce ? 'text-red-500' : ''}`}
                    style={isBounce ? { textShadow: '0 0 30px rgba(255,26,64,0.8)' } : undefined}
                  >
                    {isBounce ? (
                      <motion.span
                        className="inline-block"
                        animate={
                          isHovered
                            ? bounceLoop
                            : bouncePlayed
                            ? { y: 0, rotate: 0, scale: 1 }
                            : bounceOnce
                        }
                        transition={
                          isHovered
                            ? bounceTransitionLoop
                            : bouncePlayed
                            ? { duration: 0.2 }
                            : bounceTransitionOnce
                        }
                        onAnimationComplete={() => {
                          if (!bouncePlayed && !isHovered) {
                            setBouncePlayed(true);
                          }
                        }}
                      >
                        {word}
                      </motion.span>
                    ) : (
                      word
                    )}
                  </motion.span>
                );
              })}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-sm md:text-base font-medium tracking-wide text-neutral-300 mb-6 max-w-3xl font-space-mono"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-12"
          >
            <p className="text-xs md:text-sm text-red-400 font-space-mono tracking-wider">
              {hero.genres}
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            {hero.ctas.map((cta, index) => (
              <motion.button
                key={cta.text}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                onClick={() => (cta.external ? openExternal(cta.href) : scrollToSection(cta.href))}
                className="group flex items-center gap-2 px-8 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all duration-200 font-bold uppercase tracking-widest font-space-mono text-sm"
                style={{ boxShadow: '0 0 15px rgba(255,26,64,0.3)' }}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05, boxShadow: '0 0 25px rgba(255,26,64,0.5)' }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
                data-testid={`dj-hero-cta-${cta.text.toLowerCase().replace(' ', '-')}`}
              >
                {(cta.text === 'Listen' || cta.text === 'Watch') && <Play className="w-4 h-4" />}
                {cta.text}
                {cta.external && (
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DJHero;
