import React from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Music, Video } from 'lucide-react';
import djData from '../data/djData.json';

const Sets = () => {
  const { sets } = djData;

  const openExternal = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="sets" className="py-24 md:py-32 bg-neutral-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(217,70,239,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <motion.div
            className="flex items-center gap-4 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-16 h-1 bg-gradient-to-r from-fuchsia-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-white font-unbounded">
              {sets.title}
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm md:text-base font-medium tracking-wide text-neutral-400 font-space-mono"
          >
            {sets.description}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sets.platforms.map((platform, index) => {
            const Icon = platform.name === 'SoundCloud' ? Music : Video;
            const accentColor = platform.name === 'SoundCloud' ? 'fuchsia' : 'cyan';
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="group relative bg-black/50 backdrop-blur-sm border border-white/10 p-8 hover:border-fuchsia-500/50 transition-all overflow-hidden"
                whileHover={{ 
                  y: -8,
                  boxShadow: accentColor === 'fuchsia' 
                    ? '0 0 30px rgba(217,70,239,0.3)' 
                    : '0 0 30px rgba(6,182,212,0.3)'
                }}
              >
                {/* Background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  accentColor === 'fuchsia' 
                    ? 'from-fuchsia-500/5 to-transparent' 
                    : 'from-cyan-500/5 to-transparent'
                } opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className="relative z-10">
                  {/* Platform header */}
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      className={`w-16 h-16 border-2 ${
                        accentColor === 'fuchsia' 
                          ? 'border-fuchsia-500 bg-fuchsia-500/10' 
                          : 'border-cyan-500 bg-cyan-500/10'
                      } flex items-center justify-center`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className={`w-8 h-8 ${
                        accentColor === 'fuchsia' ? 'text-fuchsia-400' : 'text-cyan-400'
                      }`} />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-white uppercase tracking-wider font-unbounded">
                        {platform.name}
                      </h3>
                      <p className="text-xs text-neutral-500 font-space-mono">
                        Latest mixes & recordings
                      </p>
                    </div>
                  </div>

                  {/* Sets list */}
                  <div className="space-y-4 mb-6">
                    {platform.sets.map((set, setIndex) => (
                      <motion.div
                        key={setIndex}
                        className="bg-neutral-900/50 border border-white/5 p-4 hover:border-white/20 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-semibold font-space-mono text-sm">
                            {set.title}
                          </h4>
                          <span className={`text-xs ${
                            accentColor === 'fuchsia' ? 'text-fuchsia-400' : 'text-cyan-400'
                          } font-space-mono`}>
                            {set.duration}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-space-mono">{set.date}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* View all button */}
                  <motion.button
                    onClick={() => openExternal(platform.url)}
                    className={`group/btn w-full flex items-center justify-center gap-2 px-6 py-3 border ${
                      accentColor === 'fuchsia'
                        ? 'border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500'
                        : 'border-cyan-500 text-cyan-500 hover:bg-cyan-500'
                    } hover:text-black transition-all font-bold uppercase tracking-widest font-space-mono text-sm`}
                    style={{
                      boxShadow: accentColor === 'fuchsia' 
                        ? '0 0 15px rgba(217,70,239,0.3)'
                        : '0 0 15px rgba(6,182,212,0.3)'
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: accentColor === 'fuchsia'
                        ? '0 0 25px rgba(217,70,239,0.5)'
                        : '0 0 25px rgba(6,182,212,0.5)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" />
                    View All on {platform.name}
                    <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Sets;
