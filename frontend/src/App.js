import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import ProfessionalHero from './components/ProfessionalHero';
import DJHero from './components/DJHero';
import Highlights from './components/Highlights';
import About from './components/About';
import Education from './components/Education';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Artist from './components/Artist';
import GigTimeline from './components/GigTimeline';
import Sets from './components/Sets';
import PressKit from './components/PressKit';
import Contact from './components/Contact';
import './App.css';

const AppContent = () => {
  const { mode, isProfessional } = useTheme();

  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className={`min-h-screen relative ${
        isProfessional 
          ? 'bg-white text-black font-inter' 
          : 'bg-black text-white font-space-mono'
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
                'radial-gradient(circle at 15% 20%, rgba(217,70,239,0.45), transparent 35%), radial-gradient(circle at 85% 30%, rgba(6,182,212,0.35), transparent 40%), radial-gradient(circle at 40% 85%, rgba(217,70,239,0.35), transparent 35%)'
            }}
          />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(217,70,239,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.18) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
          <motion.div
            className="absolute inset-0 opacity-35 mix-blend-screen"
            style={{
              backgroundImage:
                'repeating-linear-gradient(120deg, rgba(217,70,239,0.2) 0px, rgba(217,70,239,0.0) 80px, rgba(6,182,212,0.22) 140px, rgba(6,182,212,0.0) 220px)',
              backgroundSize: '220px 220px'
            }}
            animate={{ backgroundPosition: ['0px 0px', '220px 220px'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.0) 3px, rgba(255,255,255,0.0) 6px)',
              backgroundSize: '100% 6px'
            }}
            animate={{ opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -top-48 -left-40 w-[640px] h-[640px] rounded-full border border-fuchsia-500/30 blur-[1px]"
            style={{ boxShadow: '0 0 90px rgba(217,70,239,0.6)' }}
            animate={{ rotate: 360, scale: [1, 1.06, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -bottom-56 -right-48 w-[740px] h-[740px] rounded-full border border-cyan-500/20 blur-[2px]"
            style={{ boxShadow: '0 0 100px rgba(6,182,212,0.5)' }}
            animate={{ rotate: -360, scale: [1, 1.08, 1], opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -inset-32 opacity-30"
            style={{
              background:
                'conic-gradient(from 90deg, rgba(217,70,239,0.0), rgba(217,70,239,0.45), rgba(6,182,212,0.25), rgba(217,70,239,0.0) 70%)'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -inset-32 opacity-35"
            style={{
              background:
                'linear-gradient(135deg, rgba(217,70,239,0.0) 0%, rgba(217,70,239,0.35) 30%, rgba(6,182,212,0.25) 50%, rgba(217,70,239,0.0) 70%)'
            }}
            animate={{ x: ['-15%', '15%', '-15%'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
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
              <About />
              <Highlights />
              <Skills />
              <Experience />
              <Certifications />
              <Education />
              <Projects />
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
              <Artist />
              <Sets />
              <GigTimeline />
              <PressKit />
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
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
