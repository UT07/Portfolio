import React from 'react';
import { motion } from 'framer-motion';
import professionalData from '../data/professionalData.json';

const About = () => {
  const { about, hero } = professionalData;

  return (
    <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-neutral-100 rounded-full blur-3xl opacity-30" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="w-16 h-1 bg-black"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black">
              {about.title}
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            {about.paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-base md:text-lg leading-relaxed text-neutral-600"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Headshot */}
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
              {/* Decorative background */}
              <motion.div
                className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl opacity-20 blur-2xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.25, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Image with gradient border */}
              <div className="relative p-2 bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl shadow-2xl">
                <img 
                  src={hero.headshot}
                  alt="Utkarsh Singh"
                  className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover rounded-2xl"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-2 rounded-2xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* Quote badge */}
              <motion.div
                className="absolute -bottom-6 -left-6 bg-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-blue-100 max-w-xs"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ scale: 1.05, rotate: -1 }}
              >
                <p className="text-sm font-semibold text-black mb-1">
                  "Building reliability at scale"
                </p>
                <p className="text-xs text-blue-600">Cloud + MLOps Engineer</p>
              </motion.div>

              {/* Corner accent */}
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-blue-600 rounded-tr-3xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
