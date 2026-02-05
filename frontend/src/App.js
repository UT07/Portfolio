import React, { Suspense, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ContentProvider } from './contexts/ContentContext';
import Header from './components/Header';
import ProfessionalHero from './components/ProfessionalHero';
import DJHero from './components/DJHero';
import Highlights from './components/Highlights';
import About from './components/About';
import Education from './components/Education';
import Experience from './components/Experience';
import TechStackSection from './components/TechStackSection';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import { useMediaQuery } from './utils/useMediaQuery';
import './App.css';

const Projects = React.lazy(() => import('./components/Projects'));
const Artist = React.lazy(() => import('./components/Artist'));
const GigCarousel = React.lazy(() => import('./components/GigCarousel'));
const Sets = React.lazy(() => import('./components/Sets'));
const PressKit = React.lazy(() => import('./components/PressKit'));

const SectionLoader = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
  </div>
);

const AppContent = () => {
  const { mode, isProfessional } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const reduceMotion = prefersReducedMotion || isMobile;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [mode]);

  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className={`min-h-screen relative overflow-x-hidden ${
        isProfessional
          ? 'bg-white text-black font-inter'
          : 'bg-black text-white font-space-mono dj-mode'
      }`}
      style={{
        fontFamily: isProfessional 
          ? "'Plus Jakarta Sans', 'Inter', sans-serif" 
          : "'Space Mono', monospace"
      }}
    >
      {!isProfessional && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#050505]" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 15% 20%, rgba(255,26,64,0.45), transparent 35%), radial-gradient(circle at 85% 30%, rgba(255,94,112,0.35), transparent 40%), radial-gradient(circle at 40% 85%, rgba(255,26,64,0.35), transparent 35%)'
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,26,64,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,94,112,0.18) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
          <motion.div
            className="absolute inset-0 opacity-35 mix-blend-screen"
            style={{
              backgroundImage:
                'repeating-linear-gradient(120deg, rgba(255,26,64,0.2) 0px, rgba(255,26,64,0.0) 80px, rgba(255,94,112,0.22) 140px, rgba(255,94,112,0.0) 220px)',
              backgroundSize: '220px 220px'
            }}
            animate={reduceMotion ? undefined : { backgroundPosition: ['0px 0px', '220px 220px'] }}
            transition={reduceMotion ? undefined : { duration: 60, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.0) 3px, rgba(255,255,255,0.0) 6px)',
              backgroundSize: '100% 6px'
            }}
            animate={reduceMotion ? undefined : { opacity: [0.15, 0.3, 0.15] }}
            transition={reduceMotion ? undefined : { duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -top-48 -left-40 w-[640px] h-[640px] rounded-full border border-red-500/30 blur-[1px]"
            style={{ boxShadow: '0 0 90px rgba(255,26,64,0.6)' }}
            animate={reduceMotion ? undefined : { rotate: 360, scale: [1, 1.06, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={reduceMotion ? undefined : { duration: 80, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -bottom-56 -right-48 w-[740px] h-[740px] rounded-full border border-red-500/20 blur-[2px]"
            style={{ boxShadow: '0 0 100px rgba(255,94,112,0.5)' }}
            animate={reduceMotion ? undefined : { rotate: -360, scale: [1, 1.08, 1], opacity: [0.2, 0.45, 0.2] }}
            transition={reduceMotion ? undefined : { duration: 90, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -inset-32 opacity-30"
            style={{
              background:
                'conic-gradient(from 90deg, rgba(255,26,64,0.0), rgba(255,26,64,0.45), rgba(255,94,112,0.25), rgba(255,26,64,0.0) 70%)'
            }}
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={reduceMotion ? undefined : { duration: 90, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -inset-32 opacity-35"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,26,64,0.0) 0%, rgba(255,26,64,0.35) 30%, rgba(255,94,112,0.25) 50%, rgba(255,26,64,0.0) 70%)'
            }}
            animate={reduceMotion ? undefined : { x: ['-15%', '15%', '-15%'] }}
            transition={reduceMotion ? undefined : { duration: 45, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-0 -left-1/3 h-full w-1/3 opacity-35 blur-2xl"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,26,64,0.0) 0%, rgba(255,26,64,0.65) 40%, rgba(255,94,112,0.25) 80%, rgba(255,26,64,0.0) 100%)'
            }}
            animate={reduceMotion ? undefined : { x: ['-30%', '120%'] }}
            transition={reduceMotion ? undefined : { duration: 60, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute bottom-0 -right-1/2 h-full w-1/2 opacity-25 blur-3xl"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,94,112,0.0) 0%, rgba(255,94,112,0.6) 35%, rgba(255,26,64,0.25) 75%, rgba(255,94,112,0.0) 100%)'
            }}
            animate={reduceMotion ? undefined : { x: ['30%', '-120%'] }}
            transition={reduceMotion ? undefined : { duration: 70, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      <div className="relative z-10">
        <Header />

        <AnimatePresence mode="wait">
          {isProfessional ? (
            <motion.div
              key="professional"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProfessionalHero />
              <Highlights />
              <About />
              <TechStackSection />
              <Experience />
              <Suspense fallback={<SectionLoader />}>
                <Projects />
              </Suspense>
              <Certifications />
              <Education />
              <Contact />
            </motion.div>
          ) : (
            <motion.div
              key="dj"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DJHero />
              <Suspense fallback={<SectionLoader />}>
                <Artist />
              </Suspense>
              <Suspense fallback={<SectionLoader />}>
                <Sets />
              </Suspense>
              <Suspense fallback={<SectionLoader />}>
                <GigCarousel />
              </Suspense>
              <Suspense fallback={<SectionLoader />}>
                <PressKit />
              </Suspense>
              <Contact />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ContentProvider>
        <AppContent />
      </ContentProvider>
    </ThemeProvider>
  );
}

export default App;
