import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Cloud, Music2, Menu, X } from 'lucide-react';

const Header = () => {
  const { mode, toggleMode, isProfessional } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const professionalNav = [
    { label: 'Home', id: 'home' },
    { label: 'Highlights', id: 'highlights' },
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'tech-stack' },
    { label: 'Experience', id: 'experience' },
    { label: 'Projects', id: 'projects' },
    { label: 'Certifications', id: 'certifications' },
    { label: 'Education', id: 'education' },
    { label: 'Contact', id: 'contact' }
  ];
  const djNav = [
    { label: 'Artist', id: 'artist' },
    { label: 'Sets', id: 'sets' },
    { label: 'Gigs', id: 'gigs' },
    { label: 'Press Kit', id: 'presskit' },
    { label: 'Contact', id: 'contact' }
  ];
  const navItems = isProfessional ? professionalNav : djNav;

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isProfessional
            ? 'bg-white/80 backdrop-blur-md border-b border-neutral-100'
            : 'bg-black/80 backdrop-blur-xl border-b border-white/10'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="w-full px-6 md:px-12 py-4 flex items-center">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-xl md:text-2xl font-bold ${
              isProfessional
                ? 'text-black font-plus-jakarta'
                : 'text-red-500 font-unbounded tracking-wider'
            }`}
          >
            {isProfessional ? 'Utkarsh Singh' : 'UT'}
          </motion.div>

          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors ${
                  isProfessional
                    ? 'text-neutral-600 hover:text-black'
                    : 'text-neutral-400 hover:text-red-500 uppercase tracking-widest'
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                {item.label}
              </motion.button>
            ))}
          </nav>

          <div className="flex items-center gap-3 ml-auto">
            <div
              className={`hidden lg:block text-xs font-semibold ${
                isProfessional
                  ? 'text-neutral-600'
                  : 'text-neutral-400 uppercase tracking-widest font-space-mono'
              }`}
            >
              {isProfessional ? 'Toggle to meet my alter ego' : 'Toggle to see how I pay the bills'}
            </div>
            <motion.button
              onClick={toggleMode}
              className={`relative w-16 h-8 rounded-full transition-all duration-500 ${
                isProfessional ? 'bg-neutral-200' : 'bg-neutral-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="mode-toggle-switch"
              aria-label={isProfessional ? 'Switch to DJ mode' : 'Switch to Professional mode'}
            >
              <motion.div
                className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center ${
                  isProfessional ? 'bg-black' : 'bg-red-500'
                }`}
                animate={{
                  x: isProfessional ? 0 : 32,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {isProfessional ? (
                  <Cloud className="w-3 h-3 text-white" />
                ) : (
                  <Music2 className="w-3 h-3 text-black" />
                )}
              </motion.div>
            </motion.button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 ml-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className={`w-6 h-6 ${isProfessional ? 'text-black' : 'text-white'}`} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-[60] ${
              isProfessional ? 'bg-white' : 'bg-black'
            }`}
          >
            {/* Close button */}
            <button
              className={`absolute top-6 right-6 p-2 ${
                isProfessional ? 'text-black' : 'text-white'
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Navigation links */}
            <nav className="flex flex-col items-center justify-center h-full gap-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-2xl font-medium py-3 px-8 transition-colors ${
                    isProfessional
                      ? 'text-neutral-800 hover:text-black'
                      : 'text-neutral-300 hover:text-red-500 uppercase tracking-widest font-space-mono'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* Mode toggle in mobile menu */}
              <motion.div
                className="mt-8 flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className={`text-sm ${isProfessional ? 'text-neutral-500' : 'text-neutral-500'}`}>
                  {isProfessional ? 'Switch to DJ mode' : 'Switch to Professional mode'}
                </span>
                <motion.button
                  onClick={() => {
                    toggleMode();
                    setMobileMenuOpen(false);
                  }}
                  className={`relative w-20 h-10 rounded-full transition-all duration-500 ${
                    isProfessional ? 'bg-neutral-200' : 'bg-neutral-800'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className={`absolute top-1 left-1 w-8 h-8 rounded-full flex items-center justify-center ${
                      isProfessional ? 'bg-black' : 'bg-red-500'
                    }`}
                    animate={{
                      x: isProfessional ? 0 : 40,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    {isProfessional ? (
                      <Cloud className="w-4 h-4 text-white" />
                    ) : (
                      <Music2 className="w-4 h-4 text-black" />
                    )}
                  </motion.div>
                </motion.button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
