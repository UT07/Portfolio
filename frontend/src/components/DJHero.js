import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import djData from '../data/djData.json';

const DJHero = () => {
  const { hero } = djData;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(timer);
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

  // Split headline to animate "bounce" separately
  const headlineWords = hero.headline.split(' ');

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-32 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-950/20 via-black to-cyan-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(217,70,239,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      
      {/* Animated grid background */}
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
      
      {/* Animated background particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? 'rgba(217,70,239,0.4)' : 'rgba(6,182,212,0.4)',
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 max-w-4xl"
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

            {/* Animated Headline - Word by word appearance */}
            <div className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-white mb-8 font-unbounded leading-none min-h-[300px] md:min-h-[400px]" data-testid="dj-hero-headline">
              {headlineWords.map((word, index) => {
                const isBounce = word.toLowerCase().includes('bounce');
                return (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      delay: 0.3 + index * 0.15,
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                    className={`inline-block mr-4 ${isBounce ? 'text-fuchsia-500' : ''}`}
                    style={isBounce ? {
                      textShadow: '0 0 30px rgba(217,70,239,0.6)'
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

            {showContent && (
              <>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-sm md:text-base font-medium tracking-wide text-neutral-400 mb-6 max-w-3xl font-space-mono"
                >
                  <TypeAnimation
                    sequence={[hero.subheadline]}
                    speed={70}
                    cursor={false}
                  />
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="mb-12"
                >
                  <p className="text-xs md:text-sm text-cyan-400 font-space-mono tracking-wider">
                    {hero.genres}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
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
              </>
            )}
          </motion.div>

          {/* Right side - DJ Photos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="relative hidden lg:block flex-shrink-0"
          >
            <div className="relative w-[400px] h-[500px]">
              {/* Main DJ photo */}
              <motion.div
                className="absolute top-0 right-0 w-72 h-80 overflow-hidden"
                style={{
                  border: '2px solid rgba(217,70,239,0.5)',
                  boxShadow: '0 0 30px rgba(217,70,239,0.3)'
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 50px rgba(217,70,239,0.5)'
                }}
              >
                <img 
                  src={hero.dj_photo}
                  alt="UT DJ"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>

              {/* Gig photo */}
              <motion.div
                className="absolute bottom-0 left-0 w-64 h-72 overflow-hidden"
                style={{
                  border: '2px solid rgba(6,182,212,0.5)',
                  boxShadow: '0 0 30px rgba(6,182,212,0.3)'
                }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 50px rgba(6,182,212,0.5)'
                }}
              >
                <img 
                  src={hero.gig_photo}
                  alt="UT performing"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>

              {/* Animated corner accents */}
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-fuchsia-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-cyan-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7, duration: 0.6 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DJHero;
