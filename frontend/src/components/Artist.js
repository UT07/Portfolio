import React from 'react';
import { motion } from 'framer-motion';
import djData from '../data/djData.json';

const Artist = () => {
  const { artist } = djData;

  return (
    <section id="artist" className="py-24 md:py-32 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-widest text-white mb-8 font-unbounded">
            {artist.title}
          </h2>
          
          <div className="space-y-6 mb-12">
            {artist.bio.split('\n\n').map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
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
            transition={{ delay: 0.4, duration: 0.6 }}
            className="border border-fuchsia-500/30 p-6"
            style={{
              boxShadow: '0 0 15px rgba(217,70,239,0.2)'
            }}
          >
            <ul className="space-y-3">
              {artist.highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="text-sm text-cyan-400 font-space-mono flex items-start gap-3"
                >
                  <span className="text-fuchsia-500 mt-1">▸</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Artist;
