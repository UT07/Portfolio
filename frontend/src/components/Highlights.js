import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getIcon } from '../utils/helpers';
import professionalData from '../data/professionalData.json';

const Highlights = () => {
  const { highlights } = professionalData;
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section className="py-24 md:py-32 bg-neutral-50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        style={{ y }}
        className="absolute top-20 right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50]) }}
        className="absolute bottom-20 left-10 w-64 h-64 bg-neutral-200 rounded-full blur-3xl opacity-20"
      />

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
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white border border-neutral-200 rounded-2xl p-8 hover:border-black hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden"
                data-testid={`highlight-card-${index}`}
              >
                {/* Animated gradient background on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                
                <div className="relative z-10">
                  <motion.div
                    className="mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-blue-600 transition-colors">
                    {highlight.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>

                {/* Corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-blue-100 border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
