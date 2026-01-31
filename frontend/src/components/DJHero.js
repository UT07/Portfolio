import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';
import djData from '../data/djData.json';

const DJHero = () => {
  const { hero } = djData;
  const [textSequence, setTextSequence] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setTextSequence(1), 800),    // Badge
      setTimeout(() => setTextSequence(2), 1500),   // Headline word by word
      setTimeout(() => setTextSequence(3), 4000),   // Subheadline
      setTimeout(() => setTextSequence(4), 5500),   // Genres
      setTimeout(() => setTextSequence(5), 6500),   // CTAs
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Large Hero Image */}
      <div className="absolute inset-0">
        <img 
          src={hero.hero_image}
          alt="UT DJ"
          className="w-full h-full object-cover opacity-40"
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
            backgroundImage: 'linear-gradient(rgba(217,70,239,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
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
          )}

          {/* Headline - words appear one by one */}
          {textSequence >= 2 && (
            <div className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white mb-8 font-unbounded leading-none min-h-[200px] md:min-h-[300px]" data-testid="dj-hero-headline">
              {headlineWords.map((word, index) => {
                const isBounce = word.toLowerCase().includes('bounce');
                return (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: index * 0.15,
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                    className={`inline-block mr-4 ${isBounce ? 'text-fuchsia-500' : ''}`}
                    style={isBounce ? {
                      textShadow: '0 0 30px rgba(217,70,239,0.8)'
                    } : {}}
                  >
                    {isBounce ? (
                      <motion.span
                        animate={{
                          y: [0, -20, 0],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          repeatDelay: 2,
                          ease: "easeInOut"
                        }}
                        className="inline-block"
                      >
                        {word}
                      </motion.span>
                    ) : word}
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
              <p className="text-xs md:text-sm text-cyan-400 font-space-mono tracking-wider">
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
          )}
        </div>
      </div>
    </section>
  );
};

export default DJHero;
