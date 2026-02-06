import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useDJData } from '../contexts/ContentContext';
import { assetUrl } from '../utils/assets';
import placeholderImage from '../assets/asset-placeholder.svg';
import { useMediaQuery } from '../utils/useMediaQuery';

const Artist = () => {
  const { data: djData } = useDJData();
  const { artist } = djData || {};
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const enableAmbient = !prefersReducedMotion && !isMobile;
  const enablePerWord = !prefersReducedMotion && !isMobile;

  if (!artist) return null;

  const titleWords = (artist.title || '').split(' ');

  return (
    <section id="artist" className="py-24 md:py-32 bg-transparent relative overflow-hidden">
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      {/* Background effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,26,64,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,94,112,0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="lg:pr-10">
            {/* Animated title */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-300"
                  initial={{ width: 0 }}
                  whileInView={{ width: 64 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wide md:tracking-widest text-white font-unbounded leading-tight">
                {enablePerWord ? (
                  titleWords.map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="inline-block mr-3"
                    >
                      {word}
                    </motion.span>
                  ))
                ) : (
                  <motion.span
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block"
                  >
                    {artist.title}
                  </motion.span>
                )}
              </h2>
            </motion.div>
            
            <div className="space-y-6 mb-12">
              {artist.bio.split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="text-sm md:text-base font-medium tracking-wide text-neutral-400 leading-relaxed font-space-mono"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="border border-red-500/30 p-6"
              style={{
                boxShadow: '0 0 15px rgba(255,26,64,0.2)'
              }}
            >
              <ul className="space-y-3">
                {artist.highlights.map((highlight, index) => (
                  <motion.li
                    key={index}
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                    className="text-sm text-red-400 font-space-mono flex items-start gap-3"
                  >
                    <span className="text-red-500 mt-1">▸</span>
                    <span>{highlight}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right: Artist image/video */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9, x: 50 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative lg:pl-10 lg:justify-self-end"
          >
            <motion.div
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Decorative glow */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-br from-red-500/25 to-red-300/25 blur-3xl"
                animate={enableAmbient ? { opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] } : undefined}
                transition={enableAmbient ? { duration: 20, repeat: Infinity, ease: 'easeInOut' } : undefined}
              />
              
              {/* Image container */}
              <div
                className="relative overflow-hidden border-2 border-red-500/50"
                style={{ boxShadow: '0 0 30px rgba(255,26,64,0.3)' }}
              >
                <img
                  src={assetUrl(artist.artist_image)}
                  alt="UT Artist"
                  width={500}
                  height={680}
                  className="w-full h-[360px] sm:h-[500px] lg:h-[680px] object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    if (event.currentTarget.dataset.fallback === 'true') return;
                    event.currentTarget.dataset.fallback = 'true';
                    event.currentTarget.src = placeholderImage;
                  }}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Corner accents */}
              <motion.div
                className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-red-500"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 1, duration: 0.6 }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-red-500"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Artist;
