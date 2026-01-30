import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Download, Linkedin, ExternalLink } from 'lucide-react';
import professionalData from '../data/professionalData.json';

const ProfessionalHero = () => {
  const { hero } = professionalData;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const openExternal = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-24 pb-32 relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white">
      {/* Animated geometric background */}
      <motion.div
        style={{ y }}
        className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full blur-3xl opacity-30"
      />
      <motion.div
        style={{ y: useTransform(scrollY, [0, 500], [0, -100]) }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-full blur-3xl opacity-40"
      />
      
      {/* Floating elements */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
          style={{
            left: `${10 + i * 10}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 max-w-3xl"
            style={{ opacity }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 flex items-center gap-3"
            >
              <motion.div
                className="h-1 bg-gradient-to-r from-blue-600 to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: 60 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
              <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
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
              {hero.headline.split(' ').map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="inline-block mr-3"
                  whileHover={{ scale: 1.05, color: '#2563eb' }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-base md:text-lg leading-relaxed text-neutral-600 mb-12 max-w-2xl"
            >
              {hero.subtext}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {hero.ctas.map((cta, index) => (
                <motion.button
                  key={cta.text}
                  onClick={() => cta.external ? openExternal(cta.href) : scrollToSection(cta.href)}
                  className={`group flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                    cta.primary
                      ? 'bg-black text-white hover:bg-blue-600 shadow-xl hover:shadow-2xl hover:scale-105'
                      : 'bg-white border-2 border-black text-black hover:bg-black hover:text-white shadow-lg hover:shadow-xl'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`hero-cta-${cta.text.toLowerCase().replace(' ', '-')}`}
                >
                  {cta.text === 'Download Resume' && <Download className="w-4 h-4" />}
                  {cta.text === 'LinkedIn' && <Linkedin className="w-4 h-4" />}
                  {cta.text}
                  {cta.primary && (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                  {cta.external && (
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Professional Headshot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative flex-shrink-0 hidden lg:block"
          >
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Decorative elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl opacity-20 blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Image container with border */}
              <div className="relative p-2 bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl shadow-2xl">
                <img 
                  src={hero.headshot}
                  alt="Utkarsh Singh"
                  className="w-80 h-96 object-cover rounded-2xl"
                />
                
                {/* Floating badge */}
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-white px-6 py-3 rounded-full shadow-xl border-2 border-blue-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  whileHover={{ scale: 1.05, rotate: -2 }}
                >
                  <p className="text-sm font-bold text-black">AWS Certified</p>
                  <p className="text-xs text-blue-600">Solutions Architect Pro</p>
                </motion.div>
              </div>
              
              {/* Corner accent */}
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-blue-600 rounded-tr-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalHero;
