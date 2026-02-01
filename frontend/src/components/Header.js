import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Cloud, Music2 } from 'lucide-react';

const Header = () => {
  const { mode, toggleMode, isProfessional } = useTheme();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const professionalNav = ['About', 'Highlights', 'Skills', 'Experience', 'Certifications', 'Education', 'Projects', 'Contact'];
  const djNav = ['Artist', 'Sets', 'Gigs', 'Press Kit', 'Contact'];
  const navItems = isProfessional ? professionalNav : djNav;

  return (
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
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
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

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <motion.button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase().replace(' ', ''))}
              className={`text-sm font-medium transition-colors ${
                isProfessional
                  ? 'text-neutral-600 hover:text-black'
                  : 'text-neutral-400 hover:text-red-500 uppercase tracking-widest'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              data-testid={`nav-${item.toLowerCase().replace(' ', '-')}`}
            >
              {item}
            </motion.button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
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
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
