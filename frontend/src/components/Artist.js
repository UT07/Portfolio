import React from 'react';
import { motion } from 'framer-motion';
import djData from '../data/djData.json';

const Artist = () => {
  const { artist } = djData;

  const titleWords = artist.title.split(' ');

  return (
    <section id="artist" className="py-24 md:py-32 bg-neutral-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(217,70,239,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div>
            {/* Animated title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="w-16 h-1 bg-gradient-to-r from-fuchsia-500 to-cyan-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: 64 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-white font-unbounded leading-tight">
                {titleWords.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="inline-block mr-3"
                  >
                    {word}
                  </motion.span>
                ))}
              </h2>
            </motion.div>
            
            <div className="space-y-6 mb-12">
              {artist.bio.split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  className="text-sm md:text-base font-medium tracking-wide text-neutral-400 leading-relaxed font-space-mono"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="border border-fuchsia-500/30 p-6"
              style={{
                boxShadow: '0 0 15px rgba(217,70,239,0.2)'
              }}
            >
              <ul className="space-y-3">
                {artist.highlights.map((highlight, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                    className="text-sm text-cyan-400 font-space-mono flex items-start gap-3"
                  >
                    <span className="text-fuchsia-500 mt-1">▸</span>
                    <span>{highlight}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right: Artist image/video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Decorative glow */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 blur-3xl"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Image container */}
              <div className="relative overflow-hidden border-2 border-fuchsia-500/50" style={{
                boxShadow: '0 0 30px rgba(217,70,239,0.3)'
              }}>
                <img 
                  src={artist.artist_image}
                  alt="UT Artist"
                  className="w-full h-[600px] object-cover"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-bold text-xl font-unbounded uppercase tracking-wider">
                    UT — Live Performance
                  </p>
                  <p className="text-cyan-400 text-sm font-space-mono">
                    Dublin's Underground Scene
                  </p>
                </div>
              </div>

              {/* Corner accents */}
              <motion.div
                className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-fuchsia-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1, duration: 0.6 }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-cyan-500"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
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
