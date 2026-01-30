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
      className={`min-h-screen ${
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
            <Experience />
            <Certifications />
            <Education />
            <About />
            <Projects />
            <Skills />
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
