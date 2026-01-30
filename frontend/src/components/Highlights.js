import React from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/helpers';
import professionalData from '../data/professionalData.json';

const Highlights = () => {
  const { highlights } = professionalData;

  return (
    <section className="py-24 md:py-32 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black mb-4">
            Highlights
          </h2>
          <p className="text-base md:text-lg text-neutral-600">
            Key achievements and capabilities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => {
            const Icon = getIcon(highlight.icon);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="bg-white border border-neutral-200 rounded-2xl p-8 hover:border-neutral-300 transition-all duration-300"
                data-testid={`highlight-card-${index}`}
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {highlight.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {highlight.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
