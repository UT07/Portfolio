import React from 'react';
import { motion } from 'framer-motion';
import professionalData from '../data/professionalData.json';
import { assetUrl } from '../utils/assets';
import placeholderImage from '../assets/asset-placeholder.svg';

const About = () => {
  const { about } = professionalData;
  const headshotSrc = assetUrl('/images/utkarsh-headshot.jpg');

  return (
    <section id="about" className="py-24 md:py-32 bg-white relative overflow-hidden scroll-mt-24">
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
            <img
              src={headshotSrc}
              alt="Headshot of Utkarsh Singh"
              className="w-full h-[320px] sm:h-[420px] lg:h-[520px] object-cover rounded-2xl shadow-md"
              loading="lazy"
              decoding="async"
              onError={(event) => {
                if (event.currentTarget.dataset.fallback === 'true') return;
                event.currentTarget.dataset.fallback = 'true';
                event.currentTarget.src = placeholderImage;
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
