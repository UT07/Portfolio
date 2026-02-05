import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getIcon } from '../utils/helpers';
import { useProfessionalData } from '../contexts/ContentContext';

const Highlights = () => {
  const { data: professionalData } = useProfessionalData();
  const { highlights } = professionalData;
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section id="highlights" className="py-24 md:py-32 bg-neutral-50 relative overflow-hidden scroll-mt-24">
      {/* Animated background elements */}
      <motion.div
        style={{ y }}
        className="absolute top-20 right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 30]) }}
        className="absolute bottom-20 left-10 w-64 h-64 bg-neutral-200 rounded-full blur-3xl opacity-20"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.div
            className="flex items-center gap-4 mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-16 h-1 bg-black"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black">
              Highlights
            </h2>
          </motion.div>
          <p className="text-base md:text-lg text-neutral-600">
            Key achievements and capabilities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(highlights || []).map((highlight, index) => {
            const Icon = getIcon(highlight.icon);
            return (
              <motion.div
                key={`${highlight.title}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="group bg-white border border-neutral-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
                data-testid={`highlight-card-${index}`}
              >
                {highlight.category && (
                  <div className="text-[0.65rem] uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-2">
                    {highlight.category}
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-blue-600">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-1 transition-colors group-hover:text-blue-600">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-neutral-600">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
