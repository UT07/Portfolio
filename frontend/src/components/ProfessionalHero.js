import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail } from 'lucide-react';
import professionalData from '../data/professionalData.json';

const ProfessionalHero = () => {
  const { hero } = professionalData;

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-32 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium">
              {hero.title}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-black mb-8 font-plus-jakarta leading-tight"
            data-testid="professional-hero-headline"
          >
            {hero.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-base md:text-lg leading-relaxed text-neutral-600 mb-12 max-w-3xl"
          >
            {hero.subtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            {hero.ctas.map((cta, index) => (
              <motion.button
                key={cta.text}
                onClick={() => scrollToSection(cta.href)}
                className={`group flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  cta.primary
                    ? 'bg-black text-white hover:bg-neutral-800 shadow-lg hover:shadow-xl'
                    : 'bg-neutral-100 text-black hover:bg-neutral-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid={`hero-cta-${cta.text.toLowerCase().replace(' ', '-')}`}
              >
                {cta.text === 'Download Resume' && <Download className="w-4 h-4" />}
                {cta.text === 'Contact' && <Mail className="w-4 h-4" />}
                {cta.text}
                {cta.primary && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProfessionalHero;
